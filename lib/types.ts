// Core types for WiseVision platform
export interface NewsArticle {
  id: string
  source_id: string
  title: string
  original_url: string
  canonical_url: string | null
  author: string | null
  source_name: string
  published_at: string
  crawled_at: string
  raw_html: string | null
  content_text: string
  language: string
  status: 'draft' | 'published' | 'archived'
  importance: 'low' | 'medium' | 'high'
  hash: string
  created_at: string
  updated_at: string
  
  // Relations
  ai_summary?: AISummary
  categories: Category[]
  tags: Tag[]
}

export interface AISummary {
  id: string
  article_id: string
  summary: string
  key_points: string[]
  keywords: string[]
  entities: {
    companies: string[]
    products: string[]
    regulators: string[]
    regions: string[]
  }
  model_name: string
  prompt_version: string
  status: 'pending' | 'success' | 'failed'
  error_message?: string
  created_at: string
  updated_at: string
}

export interface NewsSource {
  id: string
  name: string
  type: 'rss' | 'website' | 'api' | 'search'
  url: string
  enabled: boolean
  crawl_interval_minutes: number
  last_crawled_at?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  sort_order: number
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  updated_at: string
}

export interface CrawlJob {
  id: string
  source_id: string
  status: 'running' | 'success' | 'failed'
  started_at: string
  finished_at?: string
  total_found: number
  total_created: number
  total_duplicated: number
  error_message?: string
}

export interface AIJob {
  id: string
  article_id: string
  job_type: 'summarize' | 'classify' | 'tag'
  status: 'pending' | 'running' | 'success' | 'failed'
  input_tokens?: number
  output_tokens?: number
  cost?: number
  error_message?: string
  started_at: string
  finished_at?: string
}

export interface FeishuWebhook {
  id: string
  name: string
  webhook_url: string
  secret?: string
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface FeishuPushLog {
  id: string
  article_id?: string
  webhook_id: string
  push_type: 'daily_digest' | 'breaking_news' | 'manual'
  status: 'success' | 'failed'
  request_payload: any
  response_body?: string
  pushed_at: string
  error_message?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  last_login_at?: string
  created_at: string
  updated_at: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: {
    code: string
    message: string
  }
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Filter and search types
export interface NewsFilters {
  keyword?: string
  category?: string
  tag?: string
  sourceId?: string
  importance?: 'low' | 'medium' | 'high'
  status?: 'draft' | 'published' | 'archived'
  startDate?: string
  endDate?: string
}

export interface DashboardStats {
  todayCrawled: number
  todayCreated: number
  aiSuccessRate: number
  pushSuccessRate: number
  failedJobs: number
  highImportanceArticles: number
}

// Form types
export interface CreateNewsSourceForm {
  name: string
  type: 'rss' | 'website' | 'api' | 'search'
  url: string
  enabled: boolean
  crawl_interval_minutes: number
}

export interface CreateCategoryForm {
  name: string
  slug: string
  description?: string
  sort_order: number
  enabled: boolean
}

export interface CreateTagForm {
  name: string
  slug: string
  description?: string
}

export interface CreateFeishuWebhookForm {
  name: string
  webhook_url: string
  secret?: string
  enabled: boolean
}