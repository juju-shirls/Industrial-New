import type { NewsSource } from '@/lib/types'

export interface CrawlResult {
  title: string
  url: string
  content: string
  author?: string
  publishedAt: Date
  source: string
  rawHtml?: string
  canonicalUrl?: string
  language?: string
  excerpt?: string
  images?: string[]
  tags?: string[]
}

export interface CrawlStats {
  totalFound: number
  totalCreated: number
  totalDuplicated: number
  totalErrors: number
  startTime: Date
  endTime?: Date
  duration?: number
  errors: CrawlError[]
}

export interface CrawlError {
  url: string
  error: string
  timestamp: Date
  type: 'network' | 'parsing' | 'validation' | 'database' | 'unknown'
}

export interface CrawlJob {
  id: string
  sourceId: string
  source: NewsSource
  status: 'pending' | 'running' | 'completed' | 'failed'
  stats: CrawlStats
  startedAt?: Date
  finishedAt?: Date
  error?: string
}

export interface CrawlerConfig {
  userAgent: string
  timeout: number
  retryAttempts: number
  retryDelay: number
  maxConcurrency: number
  respectRobotsTxt: boolean
  delayBetweenRequests: number
  maxContentLength: number
  enableJavaScript: boolean
}

export interface ParsedArticle {
  title: string
  content: string
  author?: string
  publishedAt?: Date
  excerpt?: string
  images: string[]
  language: string
  canonicalUrl?: string
  tags: string[]
  metadata: Record<string, any>
}

export interface DuplicationCheck {
  hash: string
  isDuplicate: boolean
  similarArticles: string[]
  confidence: number
}