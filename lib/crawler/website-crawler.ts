import { fetch } from 'undici'
import * as cheerio from 'cheerio'
import type { CrawlResult, CrawlStats, CrawlError, CrawlerConfig } from './types'
import type { NewsSource } from '@/lib/types'
import {
  normalizeUrl,
  generateContentHash,
  isPaymentRelated,
  isValidContent,
  extractDomain,
  rateLimiter,
  parseHtmlContent
} from './utils'
import { DEFAULT_CRAWLER_CONFIG, RATE_LIMITS } from './config'

export class WebsiteCrawler {
  private config: CrawlerConfig
  private stats: CrawlStats
  private visitedUrls: Set<string>

  constructor(config?: Partial<CrawlerConfig>) {
    this.config = { ...DEFAULT_CRAWLER_CONFIG, ...config }
    this.stats = this.initializeStats()
    this.visitedUrls = new Set()
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

  async crawlWebsite(source: NewsSource): Promise<CrawlResult[]> {
    this.stats = this.initializeStats()
    this.visitedUrls.clear()

    try {
      console.log(`Starting website crawl for: ${source.name} (${source.url})`)

      const domain = extractDomain(source.url)
      const rateLimit = RATE_LIMITS[domain] || RATE_LIMITS.default

      // Apply rate limiting
      await rateLimiter.waitIfNeeded(domain, rateLimit.requestsPerMinute)

      // Determine crawl strategy based on source type
      let articleUrls: string[]

      if (source.type === 'website') {
        // Discover article URLs from the main page
        articleUrls = await this.discoverArticleUrls(source.url, source)
      } else {
        // For single page sources, just crawl the main URL
        articleUrls = [source.url]
      }

      this.stats.totalFound = articleUrls.length
      console.log(`Found ${this.stats.totalFound} potential article URLs`)

      if (articleUrls.length === 0) {
        console.warn(`No article URLs discovered for: ${source.url}`)
        return []
      }

      // Crawl articles with concurrency control
      const results: CrawlResult[] = []
      const concurrency = Math.min(this.config.maxConcurrency, articleUrls.length)
      
      for (let i = 0; i < articleUrls.length; i += concurrency) {
        const batch = articleUrls.slice(i, i + concurrency)
        const batchPromises = batch.map(url => this.crawlSingleArticle(url, source))
        
        const batchResults = await Promise.allSettled(batchPromises)
        
        for (const result of batchResults) {
          if (result.status === 'fulfilled' && result.value) {
            if (this.isValidCrawlResult(result.value)) {
              results.push(result.value)
              this.stats.totalCreated++
            }
          } else if (result.status === 'rejected') {
            this.handleError('batch-error', result.reason, 'unknown')
          }
        }

        // Delay between batches
        if (i + concurrency < articleUrls.length && rateLimit.delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, rateLimit.delayMs))
        }
      }

      this.stats.endTime = new Date()
      this.stats.duration = this.stats.endTime.getTime() - this.stats.startTime.getTime()

      console.log(`Website crawl completed for ${source.name}:`, {
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

  private async discoverArticleUrls(baseUrl: string, source: NewsSource): Promise<string[]> {
    try {
      const response = await this.fetchPage(baseUrl)
      const $ = cheerio.load(response.content)
      const domain = extractDomain(baseUrl)
      const urls = new Set<string>()

      // Common selectors for news article links
      const articleSelectors = [
        'article a[href]',
        '.article a[href]',
        '.news-item a[href]',
        '.post a[href]',
        '.entry a[href]',
        '.story a[href]',
        '.content a[href]',
        '[class*="article"] a[href]',
        '[class*="news"] a[href]',
        '[class*="post"] a[href]',
        'h1 a[href], h2 a[href], h3 a[href]',
        '.headline a[href]',
        '.title a[href]',
        '.link a[href]',
        'a[href*="/article/"]',
        'a[href*="/news/"]',
        'a[href*="/post/"]',
        'a[href*="/story/"]'
      ]

      // Collect URLs
      articleSelectors.forEach(selector => {
        $(selector).each((_, element) => {
          const href = $(element).attr('href')
          if (href) {
            try {
              const absoluteUrl = new URL(href, baseUrl).toString()
              const normalizedUrl = normalizeUrl(absoluteUrl)
              
              // Only include URLs from the same domain (unless explicitly allowed)
              if (extractDomain(normalizedUrl) === domain) {
                urls.add(normalizedUrl)
              }
            } catch {
              // Invalid URL, skip
            }
          }
        })
      })

      // Filter URLs that look like articles (not navigation, etc.)
      const filteredUrls = Array.from(urls).filter(url => {
        const path = new URL(url).pathname.toLowerCase()
        
        // Include patterns
        const includePatterns = [
          /\/article\//,
          /\/news\//,
          /\/post\//,
          /\/story\//,
          /\/blog\//,
          /\/\d{4}\/\d{2}\/\d{2}\//, // Date patterns
          /\/\d{4}-\d{2}-\d{2}/,
          /-\d+\.html?$/, // Numbered articles
          /\/[a-z0-9-]+\.html?$/
        ]

        // Exclude patterns
        const excludePatterns = [
          /\/tag\//,
          /\/category\//,
          /\/author\//,
          /\/page\//,
          /\/search\//,
          /\/login/,
          /\/register/,
          /\/contact/,
          /\/about/,
          /\/privacy/,
          /\/terms/,
          /\.pdf$/,
          /\.jpg$/,
          /\.png$/,
          /\.gif$/,
          /\/feed\//,
          /\/rss/
        ]

        const hasIncludePattern = includePatterns.some(pattern => pattern.test(path))
        const hasExcludePattern = excludePatterns.some(pattern => pattern.test(path))

        return !hasExcludePattern && (hasIncludePattern || path.length > 10)
      })

      // Limit number of URLs to crawl
      const maxUrls = 50 // Configurable limit
      return filteredUrls.slice(0, maxUrls)

    } catch (error) {
      console.error(`Failed to discover article URLs from ${baseUrl}:`, error)
      return []
    }
  }

  private async crawlSingleArticle(url: string, source: NewsSource): Promise<CrawlResult | null> {
    if (this.visitedUrls.has(url)) {
      return null // Already visited
    }

    this.visitedUrls.add(url)

    try {
      const domain = extractDomain(url)
      const rateLimit = RATE_LIMITS[domain] || RATE_LIMITS.default
      await rateLimiter.waitIfNeeded(domain, rateLimit.requestsPerMinute)

      const response = await this.fetchPage(url)
      const parsed = parseHtmlContent(response.content, url)

      // Validate content
      if (!parsed.title || !parsed.content) {
        return null
      }

      return {
        title: parsed.title,
        url: normalizeUrl(url),
        content: parsed.content,
        author: parsed.author,
        publishedAt: parsed.publishedAt || new Date(),
        source: source.name,
        rawHtml: response.content,
        canonicalUrl: parsed.canonicalUrl || url,
        language: parsed.language,
        excerpt: parsed.excerpt,
        images: parsed.images,
        tags: parsed.tags
      }

    } catch (error) {
      this.handleError(url, error, 'network')
      return null
    }
  }

  private async fetchPage(url: string): Promise<{ content: string; headers: Record<string, string> }> {
    const domain = extractDomain(url)
    const rateLimit = RATE_LIMITS[domain] || RATE_LIMITS.default

    const response = await fetch(url, {
      headers: {
        'User-Agent': this.config.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        'DNT': '1'
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

    const content = await response.text()

    // Convert headers to plain object
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return { content, headers }
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

// Factory function for creating website crawler instances
export function createWebsiteCrawler(config?: Partial<CrawlerConfig>): WebsiteCrawler {
  return new WebsiteCrawler(config)
}

// Utility function to test website crawlability
export async function validateWebsite(url: string): Promise<{ 
  isValid: boolean 
  hasArticles: boolean
  robotsAllowed: boolean
  error?: string 
}> {
  try {
    const crawler = createWebsiteCrawler({
      timeout: 10000 // Shorter timeout for validation
    })

    // Check robots.txt
    let robotsAllowed = true
    try {
      const robotsUrl = new URL('/robots.txt', url).toString()
      const robotsResponse = await fetch(robotsUrl, { 
        signal: AbortSignal.timeout(5000) 
      })
      
      if (robotsResponse.ok) {
        const robotsText = await robotsResponse.text()
        // Simple check for disallow rules (more sophisticated parsing could be added)
        robotsAllowed = !robotsText.toLowerCase().includes('disallow: /')
      }
    } catch {
      // Robots.txt not found or inaccessible - assume allowed
      robotsAllowed = true
    }

    // Try to fetch the main page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WiseVision-Validator/1.0'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      return {
        isValid: false,
        hasArticles: false,
        robotsAllowed,
        error: `HTTP ${response.status}: ${response.statusText}`
      }
    }

    const html = await response.text()
    
    // Check if the page has potential article links
    const hasArticles = html.includes('<article') || 
                       html.includes('class="article') ||
                       html.includes('class="news') ||
                       html.includes('class="post') ||
                       /href="[^"]*\/(article|news|post|story)\//.test(html)

    return {
      isValid: true,
      hasArticles,
      robotsAllowed
    }

  } catch (error) {
    return {
      isValid: false,
      hasArticles: false,
      robotsAllowed: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}