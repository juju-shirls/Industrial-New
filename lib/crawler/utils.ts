import crypto from 'crypto'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'
import type { ParsedArticle, CrawlResult } from './types'
import { 
  PAYMENT_KEYWORDS, 
  LANGUAGE_PATTERNS, 
  QUALITY_THRESHOLDS,
  CONTENT_PARSING_RULES 
} from './config'

// URL utilities
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    
    // Remove tracking parameters
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'fbclid', 'gclid', 'ref', 'source', 'campaign'
    ]
    
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param)
    })
    
    // Normalize the URL
    return urlObj.toString().toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}

export function generateContentHash(title: string, content: string): string {
  const normalized = `${title.toLowerCase().trim()}\n${content.toLowerCase().trim()}`
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

// Content analysis
export function isPaymentRelated(title: string, content: string): boolean {
  const text = `${title} ${content}`.toLowerCase()
  
  // Check for payment keywords
  const keywordMatches = PAYMENT_KEYWORDS.filter(keyword => 
    text.includes(keyword.toLowerCase())
  ).length
  
  // Require at least 2 keyword matches for relevance
  return keywordMatches >= 2
}

export function detectLanguage(text: string): string {
  const cleanText = text.replace(/\s+/g, ' ').trim()
  
  // Check for Chinese characters (most common pattern)
  if (LANGUAGE_PATTERNS['zh-CN'].test(cleanText)) {
    return 'zh-CN'
  }
  
  // Check for Japanese
  if (LANGUAGE_PATTERNS['ja'].test(cleanText)) {
    return 'ja'
  }
  
  // Check for Korean
  if (LANGUAGE_PATTERNS['ko'].test(cleanText)) {
    return 'ko'
  }
  
  // Default to English
  return 'en'
}

export function isValidContent(title: string, content: string): boolean {
  // Check minimum length requirements
  if (title.length < QUALITY_THRESHOLDS.minTitleLength || 
      title.length > QUALITY_THRESHOLDS.maxTitleLength) {
    return false
  }
  
  if (content.length < QUALITY_THRESHOLDS.minContentLength ||
      content.length > QUALITY_THRESHOLDS.maxContentLength) {
    return false
  }
  
  // Check word count
  const wordCount = content.split(/\s+/).length
  if (wordCount < QUALITY_THRESHOLDS.minWordCount) {
    return false
  }
  
  // Check for spam patterns
  if (isSpamContent(title, content)) {
    return false
  }
  
  return true
}

export function isSpamContent(title: string, content: string): boolean {
  const spamPatterns = [
    /click here/i,
    /buy now/i,
    /limited time offer/i,
    /make money fast/i,
    /free money/i,
    /工作机会/i,
    /兼职赚钱/i,
    /免费获得/i
  ]
  
  const text = `${title} ${content}`
  return spamPatterns.some(pattern => pattern.test(text))
}

// HTML parsing utilities
export function parseHtmlContent(html: string, url: string): ParsedArticle {
  const dom = new JSDOM(html, { url })
  const document = dom.window.document
  
  // Use Mozilla Readability for content extraction
  const reader = new Readability(document, {
    debug: false,
    maxElemsToParse: 0,
    nbTopCandidates: 5,
    charThreshold: 500,
    classesToPreserve: ['highlight', 'quote'],
  })
  
  const article = reader.parse()
  
  // Fallback parsing if Readability fails
  if (!article?.content) {
    return parseHtmlFallback(document, url)
  }
  
  // Extract additional metadata
  const metadata = extractMetadata(document)
  const images = extractImages(document, url)
  const tags = extractTags(document)
  
  return {
    title: article.title || extractTitle(document),
    content: cleanContent(article.textContent || ''),
    author: metadata.author || extractAuthor(document),
    publishedAt: metadata.publishedAt ? new Date(metadata.publishedAt) : undefined,
    excerpt: article.excerpt || generateExcerpt(article.textContent || ''),
    images,
    language: detectLanguage(article.textContent || ''),
    canonicalUrl: metadata.canonicalUrl || url,
    tags,
    metadata
  }
}

function parseHtmlFallback(document: Document, url: string): ParsedArticle {
  const title = extractTitle(document)
  const content = extractContentFallback(document)
  const cleanedContent = cleanContent(content)
  
  return {
    title,
    content: cleanedContent,
    author: extractAuthor(document),
    publishedAt: extractPublishDate(document),
    excerpt: generateExcerpt(cleanedContent),
    images: extractImages(document, url),
    language: detectLanguage(cleanedContent),
    canonicalUrl: extractCanonicalUrl(document) || url,
    tags: extractTags(document),
    metadata: extractMetadata(document)
  }
}

function extractTitle(document: Document): string {
  for (const selector of CONTENT_PARSING_RULES.titleSelectors) {
    const element = document.querySelector(selector)
    if (element?.textContent?.trim()) {
      return element.textContent.trim()
    }
  }
  
  // Fallback to document title
  return document.title || 'Untitled'
}

function extractContentFallback(document: Document): string {
  // Try content selectors in order
  for (const selector of CONTENT_PARSING_RULES.contentSelectors) {
    const element = document.querySelector(selector)
    if (element) {
      // Remove unwanted elements
      CONTENT_PARSING_RULES.removeSelectors.forEach(removeSelector => {
        element.querySelectorAll(removeSelector).forEach(el => el.remove())
      })
      
      const content = element.textContent?.trim()
      if (content && content.length > QUALITY_THRESHOLDS.minContentLength) {
        return content
      }
    }
  }
  
  // Last resort: body content
  const body = document.body
  if (body) {
    CONTENT_PARSING_RULES.removeSelectors.forEach(removeSelector => {
      body.querySelectorAll(removeSelector).forEach(el => el.remove())
    })
    return body.textContent?.trim() || ''
  }
  
  return ''
}

function extractAuthor(document: Document): string | undefined {
  for (const selector of CONTENT_PARSING_RULES.authorSelectors) {
    const element = document.querySelector(selector)
    const author = element?.textContent?.trim() || element?.getAttribute('content')
    if (author) {
      return author
    }
  }
  
  return undefined
}

function extractPublishDate(document: Document): Date | undefined {
  for (const selector of CONTENT_PARSING_RULES.dateSelectors) {
    const element = document.querySelector(selector)
    const dateStr = element?.getAttribute('datetime') || 
                   element?.getAttribute('content') ||
                   element?.textContent?.trim()
    
    if (dateStr) {
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
  }
  
  return undefined
}

function extractCanonicalUrl(document: Document): string | undefined {
  const canonical = document.querySelector('link[rel="canonical"]')
  return canonical?.getAttribute('href') || undefined
}

function extractImages(document: Document, baseUrl: string): string[] {
  const images: string[] = []
  const imgElements = document.querySelectorAll('img[src]')
  
  imgElements.forEach(img => {
    const src = img.getAttribute('src')
    if (src) {
      try {
        const absoluteUrl = new URL(src, baseUrl).toString()
        if (!images.includes(absoluteUrl)) {
          images.push(absoluteUrl)
        }
      } catch {
        // Invalid URL, skip
      }
    }
  })
  
  return images.slice(0, 10) // Limit to 10 images
}

function extractTags(document: Document): string[] {
  const tags = new Set<string>()
  
  // Meta keywords
  const keywords = document.querySelector('meta[name="keywords"]')
  if (keywords?.getAttribute('content')) {
    keywords.getAttribute('content')!.split(',').forEach(tag => {
      tags.add(tag.trim())
    })
  }
  
  // Article tags
  document.querySelectorAll('[rel="tag"], .tag, .tags a, .category a').forEach(el => {
    const tag = el.textContent?.trim()
    if (tag) {
      tags.add(tag)
    }
  })
  
  return Array.from(tags).slice(0, 20) // Limit to 20 tags
}

function extractMetadata(document: Document): Record<string, any> {
  const metadata: Record<string, any> = {}
  
  // Open Graph metadata
  document.querySelectorAll('meta[property^="og:"]').forEach(meta => {
    const property = meta.getAttribute('property')?.replace('og:', '')
    const content = meta.getAttribute('content')
    if (property && content) {
      metadata[property] = content
    }
  })
  
  // Twitter Card metadata
  document.querySelectorAll('meta[name^="twitter:"]').forEach(meta => {
    const name = meta.getAttribute('name')?.replace('twitter:', '')
    const content = meta.getAttribute('content')
    if (name && content) {
      metadata[`twitter_${name}`] = content
    }
  })
  
  // Article metadata
  document.querySelectorAll('meta[name]').forEach(meta => {
    const name = meta.getAttribute('name')
    const content = meta.getAttribute('content')
    if (name && content) {
      metadata[name] = content
    }
  })
  
  return metadata
}

function cleanContent(content: string): string {
  return content
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Trim
    .trim()
}

function generateExcerpt(content: string, maxLength = 200): string {
  const cleaned = cleanContent(content)
  
  if (cleaned.length <= maxLength) {
    return cleaned
  }
  
  // Find the last complete sentence within the limit
  const truncated = cleaned.substring(0, maxLength)
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('？')
  )
  
  if (lastSentenceEnd > maxLength * 0.5) {
    return truncated.substring(0, lastSentenceEnd + 1)
  }
  
  // Fallback to word boundary
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
}

// Similarity checking
export function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)
  
  const set1 = new Set(words1)
  const set2 = new Set(words2)
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return union.size > 0 ? intersection.size / union.size : 0
}

export function isDuplicate(
  newTitle: string, 
  newContent: string, 
  existingArticles: { title: string; content_text: string }[]
): { isDuplicate: boolean; similarArticles: string[]; confidence: number } {
  const similarities: Array<{ id: string; similarity: number }> = []
  
  existingArticles.forEach(article => {
    const titleSim = calculateSimilarity(newTitle, article.title)
    const contentSim = calculateSimilarity(newContent, article.content_text)
    const overallSim = (titleSim * 0.4) + (contentSim * 0.6)
    
    if (overallSim > 0.3) { // Only consider if there's some similarity
      similarities.push({
        id: crypto.createHash('md5').update(article.title).digest('hex'),
        similarity: overallSim
      })
    }
  })
  
  // Sort by similarity
  similarities.sort((a, b) => b.similarity - a.similarity)
  
  const maxSimilarity = similarities.length > 0 ? similarities[0].similarity : 0
  const isDuplicate = maxSimilarity > QUALITY_THRESHOLDS.maxDuplicatePercentage
  
  return {
    isDuplicate,
    similarArticles: similarities.slice(0, 5).map(s => s.id),
    confidence: maxSimilarity
  }
}

// Rate limiting utilities
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  async waitIfNeeded(domain: string, requestsPerMinute = 30): Promise<void> {
    const now = Date.now()
    const requests = this.requests.get(domain) || []
    
    // Clean old requests (older than 1 minute)
    const validRequests = requests.filter(timestamp => now - timestamp < 60000)
    
    if (validRequests.length >= requestsPerMinute) {
      const oldestRequest = validRequests[0]
      const waitTime = 60000 - (now - oldestRequest)
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
    
    validRequests.push(now)
    this.requests.set(domain, validRequests)
  }
}

export const rateLimiter = new RateLimiter()