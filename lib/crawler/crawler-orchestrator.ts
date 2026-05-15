import type { NewsSource } from '@/lib/types'
import type { CrawlResult, CrawlStats, CrawlJob } from './types'
import { createRSSCrawler } from './rss-crawler'
import { createWebsiteCrawler } from './website-crawler'
import { 
  ArticlesService, 
  NewsSourcesService, 
  TagsService 
} from '@/lib/supabase/services'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { 
  generateContentHash, 
  isDuplicate, 
  isValidContent,
  isPaymentRelated 
} from './utils'

export class CrawlerOrchestrator {
  private activeCrawls: Map<string, CrawlJob> = new Map()
  private crawlHistory: CrawlJob[] = []

  async crawlSource(sourceId: string): Promise<CrawlJob> {
    // Check if source is already being crawled
    if (this.activeCrawls.has(sourceId)) {
      throw new Error(`Source ${sourceId} is already being crawled`)
    }

    // Get source details from database
    const source = await NewsSourcesService.getById(sourceId)
    if (!source) {
      throw new Error(`Source ${sourceId} not found`)
    }

    if (!source.enabled) {
      throw new Error(`Source ${sourceId} is disabled`)
    }

    // Create crawl job
    const crawlJob: CrawlJob = {
      id: crypto.randomUUID(),
      sourceId,
      source,
      status: 'pending',
      stats: {
        totalFound: 0,
        totalCreated: 0,
        totalDuplicated: 0,
        totalErrors: 0,
        startTime: new Date(),
        errors: []
      }
    }

    // Add to active crawls
    this.activeCrawls.set(sourceId, crawlJob)

    try {
      // Start crawling
      crawlJob.status = 'running'
      crawlJob.startedAt = new Date()

      console.log(`Starting crawl for source: ${source.name} (${source.type})`)

      // Log crawl start to database
      const supabase = createServerSupabaseClient()
      const { data: crawlJobRecord } = await supabase
        .from('crawl_jobs')
        .insert({
          source_id: sourceId,
          status: 'running',
          started_at: crawlJob.startedAt.toISOString()
        })
        .select()
        .single()

      // Crawl based on source type
      let crawlResults: CrawlResult[]
      
      switch (source.type) {
        case 'rss':
          crawlResults = await this.crawlRSSSource(source, crawlJob)
          break
        case 'website':
          crawlResults = await this.crawlWebsiteSource(source, crawlJob)
          break
        case 'api':
          crawlResults = await this.crawlAPISource(source, crawlJob)
          break
        case 'search':
          crawlResults = await this.crawlSearchSource(source, crawlJob)
          break
        default:
          throw new Error(`Unsupported source type: ${source.type}`)
      }

      // Process and save results
      const savedResults = await this.processAndSaveResults(crawlResults, source, crawlJob)

      // Update job status
      crawlJob.status = 'completed'
      crawlJob.finishedAt = new Date()
      crawlJob.stats.endTime = crawlJob.finishedAt
      crawlJob.stats.duration = crawlJob.finishedAt.getTime() - crawlJob.startedAt.getTime()

      // Update database
      await supabase
        .from('crawl_jobs')
        .update({
          status: 'success',
          finished_at: crawlJob.finishedAt.toISOString(),
          total_found: crawlJob.stats.totalFound,
          total_created: crawlJob.stats.totalCreated,
          total_duplicated: crawlJob.stats.totalDuplicated
        })
        .eq('id', crawlJobRecord.id)

      // Update source last crawled time
      await NewsSourcesService.updateLastCrawled(sourceId)

      console.log(`Crawl completed for ${source.name}:`, {
        found: crawlJob.stats.totalFound,
        created: crawlJob.stats.totalCreated,
        duplicated: crawlJob.stats.totalDuplicated,
        errors: crawlJob.stats.totalErrors,
        duration: `${Math.round(crawlJob.stats.duration! / 1000)}s`
      })

    } catch (error) {
      // Handle crawl failure
      crawlJob.status = 'failed'
      crawlJob.finishedAt = new Date()
      crawlJob.error = error instanceof Error ? error.message : String(error)
      crawlJob.stats.endTime = crawlJob.finishedAt
      crawlJob.stats.duration = crawlJob.finishedAt.getTime() - (crawlJob.startedAt?.getTime() || crawlJob.stats.startTime.getTime())

      console.error(`Crawl failed for ${source.name}:`, error)

      // Update database
      const supabase = createServerSupabaseClient()
      await supabase
        .from('crawl_jobs')
        .update({
          status: 'failed',
          finished_at: crawlJob.finishedAt.toISOString(),
          error_message: crawlJob.error,
          total_found: crawlJob.stats.totalFound,
          total_created: crawlJob.stats.totalCreated,
          total_duplicated: crawlJob.stats.totalDuplicated
        })
        .eq('source_id', sourceId)
        .eq('status', 'running')

      throw error
    } finally {
      // Remove from active crawls
      this.activeCrawls.delete(sourceId)
      
      // Add to history
      this.crawlHistory.unshift(crawlJob)
      
      // Keep only last 100 jobs in memory
      if (this.crawlHistory.length > 100) {
        this.crawlHistory = this.crawlHistory.slice(0, 100)
      }
    }

    return crawlJob
  }

  async crawlAllSources(): Promise<CrawlJob[]> {
    console.log('Starting crawl for all enabled sources')

    // Get all enabled sources
    const sources = await NewsSourcesService.getAll()
    const enabledSources = sources.filter(source => source.enabled)

    if (enabledSources.length === 0) {
      console.log('No enabled sources found')
      return []
    }

    console.log(`Found ${enabledSources.length} enabled sources`)

    // Crawl sources with concurrency control
    const maxConcurrency = 3 // Limit concurrent crawls to be respectful
    const results: CrawlJob[] = []

    for (let i = 0; i < enabledSources.length; i += maxConcurrency) {
      const batch = enabledSources.slice(i, i + maxConcurrency)
      const batchPromises = batch.map(async source => {
        try {
          return await this.crawlSource(source.id)
        } catch (error) {
          console.error(`Failed to crawl source ${source.name}:`, error)
          return null
        }
      })

      const batchResults = await Promise.allSettled(batchPromises)
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value)
        }
      }

      // Delay between batches to be respectful
      if (i + maxConcurrency < enabledSources.length) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // 5 second delay
      }
    }

    console.log(`Bulk crawl completed. ${results.length} sources crawled successfully.`)

    return results
  }

  private async crawlRSSSource(source: NewsSource, job: CrawlJob): Promise<CrawlResult[]> {
    const crawler = createRSSCrawler()
    const results = await crawler.crawlRSSFeed(source)
    
    // Update job stats
    const crawlerStats = crawler.getStats()
    job.stats.totalFound = crawlerStats.totalFound
    job.stats.errors.push(...crawlerStats.errors)
    job.stats.totalErrors += crawlerStats.totalErrors

    return results
  }

  private async crawlWebsiteSource(source: NewsSource, job: CrawlJob): Promise<CrawlResult[]> {
    const crawler = createWebsiteCrawler()
    const results = await crawler.crawlWebsite(source)
    
    // Update job stats
    const crawlerStats = crawler.getStats()
    job.stats.totalFound = crawlerStats.totalFound
    job.stats.errors.push(...crawlerStats.errors)
    job.stats.totalErrors += crawlerStats.totalErrors

    return results
  }

  private async crawlAPISource(source: NewsSource, job: CrawlJob): Promise<CrawlResult[]> {
    // TODO: Implement API crawler for sources that provide JSON/XML APIs
    console.warn(`API crawling not yet implemented for ${source.name}`)
    return []
  }

  private async crawlSearchSource(source: NewsSource, job: CrawlJob): Promise<CrawlResult[]> {
    // TODO: Implement search engine crawling (Google News, Bing News, etc.)
    console.warn(`Search crawling not yet implemented for ${source.name}`)
    return []
  }

  private async processAndSaveResults(
    crawlResults: CrawlResult[], 
    source: NewsSource, 
    job: CrawlJob
  ): Promise<number> {
    let savedCount = 0
    let duplicateCount = 0

    // Get recent articles for duplicate checking
    const recentArticles = await ArticlesService.getPaginated(1, 1000, {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
    })

    const existingArticles = recentArticles.data.map(article => ({
      title: article.title,
      content_text: article.content_text,
      hash: article.hash
    }))

    for (const result of crawlResults) {
      try {
        // Generate content hash
        const contentHash = generateContentHash(result.title, result.content)

        // Check for duplicates
        const existingByHash = existingArticles.find(a => a.hash === contentHash)
        if (existingByHash) {
          duplicateCount++
          continue
        }

        // More sophisticated duplicate checking
        const duplicationCheck = isDuplicate(result.title, result.content, existingArticles)
        if (duplicationCheck.isDuplicate) {
          duplicateCount++
          continue
        }

        // Final validation
        if (!isValidContent(result.title, result.content) || 
            !isPaymentRelated(result.title, result.content)) {
          continue
        }

        // Save to database
        const savedArticle = await ArticlesService.create({
          source_id: source.id,
          title: result.title,
          original_url: result.url,
          canonical_url: result.canonicalUrl,
          author: result.author,
          source_name: result.source,
          published_at: result.publishedAt.toISOString(),
          crawled_at: new Date().toISOString(),
          raw_html: result.rawHtml,
          content_text: result.content,
          language: result.language || 'auto-detect',
          status: 'draft',
          importance: 'medium',
          hash: contentHash
        })

        // Auto-tag articles with extracted tags
        if (result.tags && result.tags.length > 0) {
          const tagPromises = result.tags.map(async tagName => {
            try {
              return await TagsService.findOrCreate(tagName)
            } catch {
              return null
            }
          })

          const tags = (await Promise.all(tagPromises)).filter(Boolean)
          const tagIds = tags.map(tag => tag!.id)
          
          if (tagIds.length > 0) {
            await ArticlesService.addTags(savedArticle.id, tagIds)
          }
        }

        savedCount++

      } catch (error) {
        console.error(`Error saving article "${result.title}":`, error)
        job.stats.errors.push({
          url: result.url,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date(),
          type: 'database'
        })
        job.stats.totalErrors++
      }
    }

    job.stats.totalCreated = savedCount
    job.stats.totalDuplicated = duplicateCount

    return savedCount
  }

  // Utility methods
  getActiveCrawls(): CrawlJob[] {
    return Array.from(this.activeCrawls.values())
  }

  getCrawlHistory(): CrawlJob[] {
    return [...this.crawlHistory]
  }

  isSourceBeingCrawled(sourceId: string): boolean {
    return this.activeCrawls.has(sourceId)
  }

  async getCrawlJobsBySource(sourceId: string, limit = 10): Promise<any[]> {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase
      .from('crawl_jobs')
      .select('*')
      .eq('source_id', sourceId)
      .order('started_at', { ascending: false })
      .limit(limit)

    return data || []
  }
}

// Singleton instance for the application
export const crawlerOrchestrator = new CrawlerOrchestrator()

// Utility functions
export async function crawlSingleSource(sourceId: string): Promise<CrawlJob> {
  return crawlerOrchestrator.crawlSource(sourceId)
}

export async function crawlAllSources(): Promise<CrawlJob[]> {
  return crawlerOrchestrator.crawlAllSources()
}

export function getActiveCrawls(): CrawlJob[] {
  return crawlerOrchestrator.getActiveCrawls()
}

export function getCrawlHistory(): CrawlJob[] {
  return crawlerOrchestrator.getCrawlHistory()
}