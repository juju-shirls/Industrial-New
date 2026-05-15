import Parser from 'rss-parser'
import { fetch } from 'undici'
import type { CrawlResult, CrawlStats, CrawlError, CrawlerConfig } from './types'
import type { NewsSource } from '@/lib/types'
import { 
  normalizeUrl, 
  generateContentHash, 
  isPaymentRelated, 
  isValidContent, 
  extractDomain,
  rateLimiter 
} from './utils'
import { DEFAULT_CRAWLER_CONFIG, RATE_LIMITS } from './config'

export class RSSCrawler {
  private parser: Parser
  private config: CrawlerConfig
  private stats: CrawlStats

  constructor(config?: Partial<CrawlerConfig>) {
    this.config = { ...DEFAULT_CRAWLER_CONFIG, ...config }
    this.parser = new Parser({
      timeout: this.config.timeout,
      headers: {
        'User-Agent': this.config.userAgent,
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'Accept-Encoding': 'gzip, deflate',
      },
      customFields: {
        item: [
          ['media:content', 'mediaContent'],
          ['content:encoded', 'contentEncoded'],
          ['description', 'description'],
          ['summary', 'summary']
        ]
      }
    })
    
    this.stats = this.initializeStats()
  }

  private initializeStats(): CrawlStats {
    return {
      totalFound: 0,
      totalCreated: 0,
      totalDuplicated: 0,
      totalErrors: 0,
      startTime: new Date(),
      errors: []
    }
  }

  async crawlRSSFeed(source: NewsSource): Promise<CrawlResult[]> {
    this.stats = this.initializeStats()
    
    try {
      console.log(`Starting RSS crawl for: ${source.name} (${source.url})`)
      
      // Apply rate limiting
      const domain = extractDomain(source.url)
      const rateLimit = RATE_LIMITS[domain] || RATE_LIMITS.default
      await rateLimiter.waitIfNeeded(domain, rateLimit.requestsPerMinute)
      
      // Parse RSS feed
      const feed = await this.parseRSSFeed(source.url)
      this.stats.totalFound = feed.items?.length || 0
      
      if (!feed.items || feed.items.length === 0) {
        console.warn(`No items found in RSS feed: ${source.url}`)
        return []
      }
      
      console.log(`Found ${this.stats.totalFound} items in RSS feed`)
      
      // Process feed items
      const results: CrawlResult[] = []
      
      for (const item of feed.items) {
        try {
          const crawlResult = await this.processFeedItem(item, source)
          
          if (crawlResult) {
            // Validate content quality and relevance
            if (this.isValidCrawlResult(crawlResult)) {
              results.push(crawlResult)
              this.stats.totalCreated++
            } else {
              console.log(`Skipping low-quality or irrelevant item: ${item.title}`)
            }
          }
          
          // Delay between items to be respectful
          if (this.config.delayBetweenRequests > 0) {
            await new Promise(resolve => setTimeout(resolve, this.config.delayBetweenRequests))
          }
          
        } catch (error) {
          this.handleError(item.link || 'unknown', error, 'parsing')
        }
      }
      
      this.stats.endTime = new Date()
      this.stats.duration = this.stats.endTime.getTime() - this.stats.startTime.getTime()
      
      console.log(`RSS crawl completed for ${source.name}:`, {
        found: this.stats.totalFound,
        processed: this.stats.totalCreated,
        errors: this.stats.totalErrors
      })
      
      return results
      
    } catch (error) {
      this.handleError(source.url, error, 'network')
      this.stats.endTime = new Date()
      this.stats.duration = this.stats.endTime.getTime() - this.stats.startTime.getTime()
      throw error
    }
  }

  private async parseRSSFeed(url: string): Promise<Parser.Output<any>> {
    try {
      return await this.parser.parseURL(url)
    } catch (error) {
      // Fallback: try fetching manually and parsing
      console.log(`Direct RSS parsing failed, trying manual fetch: ${url}`)
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.config.userAgent,
          'Accept': 'application/rss+xml, application/xml, text/xml'
        },
        signal: AbortSignal.timeout(this.config.timeout)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const xmlText = await response.text()
      return await this.parser.parseString(xmlText)
    }
  }

  private async processFeedItem(item: any, source: NewsSource): Promise<CrawlResult | null> {
    if (!item.link || !item.title) {
      return null
    }
    
    // Normalize URL
    const normalizedUrl = normalizeUrl(item.link)
    
    // Extract content from RSS item
    let content = this.extractContentFromItem(item)
    
    // If content is too short, try to fetch full article
    if (content.length < 300) {
      try {
        content = await this.fetchFullArticleContent(normalizedUrl)
      } catch (error) {
        console.log(`Failed to fetch full content for ${normalizedUrl}:`, error)
        // Continue with RSS content
      }
    }
    
    // Extract publish date
    const publishedAt = this.extractPublishDate(item)
    
    // Extract author
    const author = this.extractAuthor(item)
    
    return {
      title: item.title.trim(),
      url: normalizedUrl,
      content: content.trim(),
      author,
      publishedAt,
      source: source.name,
      rawHtml: undefined, // RSS doesn't provide raw HTML
      canonicalUrl: normalizedUrl,
      language: 'auto-detect',
      excerpt: this.generateExcerpt(content),
      images: this.extractImages(item),
      tags: this.extractTags(item)
    }
  }

  private extractContentFromItem(item: any): string {
    // Try different content fields in order of preference
    const contentFields = [
      'contentEncoded', // content:encoded
      'content',
      'description',
      'summary',
      'content:encoded',
      'description'
    ]
    
    for (const field of contentFields) {
      const content = item[field]
      if (content && typeof content === 'string') {
        // Strip HTML tags and decode entities
        const stripped = this.stripHtml(content)
        if (stripped.length > 100) { // Prefer longer content
          return stripped
        }
      }
    }
    
    return item.contentSnippet || item.description || ''
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
  }

  private async fetchFullArticleContent(url: string): Promise<string> {
    const domain = extractDomain(url)
    const rateLimit = RATE_LIMITS[domain] || RATE_LIMITS.default
    
    // Apply rate limiting for individual article fetches
    await rateLimiter.waitIfNeeded(domain, rateLimit.requestsPerMinute)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': this.config.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Accept-Encoding': 'gzip, deflate'
      },
      signal: AbortSignal.timeout(this.config.timeout)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    // Check content type
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      throw new Error(`Invalid content type: ${contentType}`)
    }
    
    // Check content length
    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > this.config.maxContentLength) {
      throw new Error(`Content too large: ${contentLength} bytes`)
    }
    
    const html = await response.text()
    
    // Parse content using the same utilities as the HTML crawler
    const { parseHtmlContent } = await import('./utils')
    const parsed = parseHtmlContent(html, url)
    
    return parsed.content
  }

  private extractPublishDate(item: any): Date {
    const dateFields = ['pubDate', 'isoDate', 'date', 'published', 'updated']
    
    for (const field of dateFields) {
      const dateValue = item[field]
      if (dateValue) {
        const date = new Date(dateValue)
        if (!isNaN(date.getTime())) {
          return date
        }
      }
    }
    
    // Fallback to current date if no valid date found
    return new Date()
  }

  private extractAuthor(item: any): string | undefined {
    const authorFields = ['author', 'creator', 'dc:creator']
    
    for (const field of authorFields) {
      const author = item[field]
      if (author && typeof author === 'string') {
        return author.trim()
      }
    }
    
    return undefined
  }

  private generateExcerpt(content: string, maxLength = 200): string {
    if (content.length <= maxLength) {
      return content
    }
    
    const truncated = content.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
  }

  private extractImages(item: any): string[] {
    const images: string[] = []
    
    // Media content from RSS extensions
    if (item.mediaContent) {
      if (Array.isArray(item.mediaContent)) {
        item.mediaContent.forEach((media: any) => {
          if (media.$ && media.$.url && media.$.medium === 'image') {
            images.push(media.$.url)
          }
        })
      }
    }
    
    // Enclosure images
    if (item.enclosure && item.enclosure.type?.startsWith('image/')) {
      images.push(item.enclosure.url)
    }
    
    return images
  }

  private extractTags(item: any): string[] {
    const tags: string[] = []
    
    // Categories as tags
    if (item.categories) {
      item.categories.forEach((category: string) => {
        if (category && category.trim()) {
          tags.push(category.trim())
        }
      })
    }
    
    return tags
  }

  private isValidCrawlResult(result: CrawlResult): boolean {
    // Check basic validity
    if (!isValidContent(result.title, result.content)) {
      return false
    }
    
    // Check payment relevance
    if (!isPaymentRelated(result.title, result.content)) {
      return false
    }
    
    return true
  }

  private handleError(url: string, error: any, type: CrawlError['type']) {
    const crawlError: CrawlError = {
      url,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date(),
      type
    }
    
    this.stats.errors.push(crawlError)
    this.stats.totalErrors++
    
    console.error(`Crawl error [${type}] for ${url}:`, error)
  }

  getStats(): CrawlStats {
    return { ...this.stats }
  }
}

// Factory function for creating RSS crawler instances
export function createRSSCrawler(config?: Partial<CrawlerConfig>): RSSCrawler {
  return new RSSCrawler(config)
}

// Utility function to test RSS feed validity
export async function validateRSSFeed(url: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const crawler = createRSSCrawler({
      timeout: 10000 // Shorter timeout for validation
    })
    
    const parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'WiseVision-Validator/1.0'
      }
    })
    
    const feed = await parser.parseURL(url)
    
    return {
      isValid: !!(feed && feed.items && feed.items.length > 0)
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}