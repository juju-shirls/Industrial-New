import { createServerSupabaseClient } from './client'
import { 
  createRecord, 
  updateRecord, 
  deleteRecord, 
  getRecord, 
  getPaginatedRecords,
  batchInsert,
  batchDelete,
  handleDatabaseError,
  type PaginatedResult 
} from './utils'
import type { Database } from './database.types'
import type { 
  NewsArticle, 
  NewsSource, 
  Category, 
  Tag, 
  NewsFilters,
  CreateNewsSourceForm,
  CreateCategoryForm,
  CreateTagForm
} from '@/lib/types'

type Tables = Database['public']['Tables']

// News Sources Service
export class NewsSourcesService {
  static async getAll(): Promise<NewsSource[]> {
    return getRecords('news_sources', {
      orderBy: { column: 'name', ascending: true }
    }) as Promise<NewsSource[]>
  }

  static async getById(id: string): Promise<NewsSource | null> {
    return getRecord('news_sources', id) as Promise<NewsSource | null>
  }

  static async create(data: CreateNewsSourceForm): Promise<NewsSource> {
    const sourceData: Tables['news_sources']['Insert'] = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    return createRecord('news_sources', sourceData) as Promise<NewsSource>
  }

  static async update(id: string, data: Partial<CreateNewsSourceForm>): Promise<NewsSource> {
    const updateData: Tables['news_sources']['Update'] = {
      ...data,
      updated_at: new Date().toISOString()
    }
    
    return updateRecord('news_sources', id, updateData) as Promise<NewsSource>
  }

  static async delete(id: string): Promise<void> {
    return deleteRecord('news_sources', id)
  }

  static async updateLastCrawled(id: string): Promise<NewsSource> {
    return updateRecord('news_sources', id, {
      last_crawled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }) as Promise<NewsSource>
  }
}

// Articles Service
export class ArticlesService {
  static async getPaginated(
    page: number, 
    pageSize: number, 
    filters: NewsFilters = {}
  ): Promise<PaginatedResult<NewsArticle>> {
    const supabase = createServerSupabaseClient()
    
    // Build complex query with joins
    let query = supabase
      .from('articles')
      .select(`
        *,
        ai_summary:article_ai_summaries(
          id,
          summary,
          key_points,
          keywords,
          entities,
          status
        ),
        categories:article_categories(
          category:categories(*)
        ),
        tags:article_tags(
          tag:tags(*)
        )
      `, { count: 'exact' })
    
    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.importance) {
      query = query.eq('importance', filters.importance)
    }
    
    if (filters.sourceId) {
      query = query.eq('source_id', filters.sourceId)
    }
    
    if (filters.keyword) {
      query = query.or(`title.ilike.%${filters.keyword}%,content_text.ilike.%${filters.keyword}%`)
    }
    
    if (filters.startDate) {
      query = query.gte('published_at', filters.startDate)
    }
    
    if (filters.endDate) {
      query = query.lte('published_at', filters.endDate)
    }
    
    // Apply category filter through join
    if (filters.category) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.category)
        .single()
      
      if (categoryData) {
        query = query.in('id', 
          supabase
            .from('article_categories')
            .select('article_id')
            .eq('category_id', categoryData.id)
        )
      }
    }
    
    // Apply tag filter through join
    if (filters.tag) {
      const { data: tagData } = await supabase
        .from('tags')
        .select('id')
        .eq('slug', filters.tag)
        .single()
      
      if (tagData) {
        query = query.in('id',
          supabase
            .from('article_tags')
            .select('article_id')
            .eq('tag_id', tagData.id)
        )
      }
    }
    
    // Order by published date
    query = query.order('published_at', { ascending: false })
    
    // Apply pagination
    const offset = (page - 1) * pageSize
    query = query.range(offset, offset + pageSize - 1)
    
    const { data: articles, error, count } = await query
    
    if (error) {
      handleDatabaseError(error)
    }
    
    // Transform data to match our types
    const transformedArticles: NewsArticle[] = (articles || []).map(article => ({
      ...article,
      ai_summary: article.ai_summary?.[0] || undefined,
      categories: article.categories?.map(ac => ac.category).filter(Boolean) || [],
      tags: article.tags?.map(at => at.tag).filter(Boolean) || []
    }))
    
    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)
    
    return {
      data: transformedArticles,
      pagination: { page, pageSize, total, totalPages }
    }
  }

  static async getById(id: string): Promise<NewsArticle | null> {
    const supabase = createServerSupabaseClient()
    
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        ai_summary:article_ai_summaries(
          id,
          summary,
          key_points,
          keywords,
          entities,
          status
        ),
        categories:article_categories(
          category:categories(*)
        ),
        tags:article_tags(
          tag:tags(*)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      handleDatabaseError(error)
    }
    
    if (!article) return null
    
    return {
      ...article,
      ai_summary: article.ai_summary?.[0] || undefined,
      categories: article.categories?.map(ac => ac.category).filter(Boolean) || [],
      tags: article.tags?.map(at => at.tag).filter(Boolean) || []
    }
  }

  static async create(data: Tables['articles']['Insert']): Promise<NewsArticle> {
    return createRecord('articles', data) as Promise<NewsArticle>
  }

  static async update(id: string, data: Tables['articles']['Update']): Promise<NewsArticle> {
    return updateRecord('articles', id, {
      ...data,
      updated_at: new Date().toISOString()
    }) as Promise<NewsArticle>
  }

  static async bulkUpdateStatus(ids: string[], status: 'draft' | 'published' | 'archived'): Promise<void> {
    const supabase = createServerSupabaseClient()
    
    const { error } = await supabase
      .from('articles')
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .in('id', ids)
    
    if (error) {
      handleDatabaseError(error)
    }
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    return batchDelete('articles', ids)
  }

  static async addCategories(articleId: string, categoryIds: string[]): Promise<void> {
    const supabase = createServerSupabaseClient()
    
    const relations = categoryIds.map(categoryId => ({
      article_id: articleId,
      category_id: categoryId
    }))
    
    const { error } = await supabase
      .from('article_categories')
      .upsert(relations)
    
    if (error) {
      handleDatabaseError(error)
    }
  }

  static async addTags(articleId: string, tagIds: string[]): Promise<void> {
    const supabase = createServerSupabaseClient()
    
    const relations = tagIds.map(tagId => ({
      article_id: articleId,
      tag_id: tagId
    }))
    
    const { error } = await supabase
      .from('article_tags')
      .upsert(relations)
    
    if (error) {
      handleDatabaseError(error)
    }
  }
}

// Categories Service
export class CategoriesService {
  static async getAll(): Promise<Category[]> {
    return getRecords('categories', {
      orderBy: { column: 'sort_order', ascending: true }
    }) as Promise<Category[]>
  }

  static async getEnabled(): Promise<Category[]> {
    return getRecords('categories', {
      filters: { enabled: true },
      orderBy: { column: 'sort_order', ascending: true }
    }) as Promise<Category[]>
  }

  static async create(data: CreateCategoryForm): Promise<Category> {
    return createRecord('categories', {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }) as Promise<Category>
  }

  static async update(id: string, data: Partial<CreateCategoryForm>): Promise<Category> {
    return updateRecord('categories', id, {
      ...data,
      updated_at: new Date().toISOString()
    }) as Promise<Category>
  }

  static async delete(id: string): Promise<void> {
    return deleteRecord('categories', id)
  }
}

// Tags Service
export class TagsService {
  static async getAll(): Promise<Tag[]> {
    return getRecords('tags', {
      orderBy: { column: 'name', ascending: true }
    }) as Promise<Tag[]>
  }

  static async create(data: CreateTagForm): Promise<Tag> {
    return createRecord('tags', {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }) as Promise<Tag>
  }

  static async update(id: string, data: Partial<CreateTagForm>): Promise<Tag> {
    return updateRecord('tags', id, {
      ...data,
      updated_at: new Date().toISOString()
    }) as Promise<Tag>
  }

  static async delete(id: string): Promise<void> {
    return deleteRecord('tags', id)
  }

  static async findOrCreate(name: string, slug?: string): Promise<Tag> {
    const supabase = createServerSupabaseClient()
    
    // Try to find existing tag
    const { data: existingTag } = await supabase
      .from('tags')
      .select()
      .or(`name.eq.${name},slug.eq.${slug || name.toLowerCase().replace(/\s+/g, '-')}`)
      .single()
    
    if (existingTag) {
      return existingTag
    }
    
    // Create new tag
    return this.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: ''
    })
  }
}

// AI Service for summaries and classification
export class AIService {
  static async createSummary(
    articleId: string,
    summary: string,
    keyPoints: string[],
    keywords: string[],
    entities: any,
    modelName: string,
    promptVersion: string
  ): Promise<void> {
    const summaryData: Tables['article_ai_summaries']['Insert'] = {
      article_id: articleId,
      summary,
      key_points: keyPoints,
      keywords,
      entities,
      model_name: modelName,
      prompt_version: promptVersion,
      status: 'success',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await createRecord('article_ai_summaries', summaryData)
  }

  static async regenerateSummary(articleId: string): Promise<void> {
    const supabase = createServerSupabaseClient()
    
    // Update existing summary status to pending
    const { error } = await supabase
      .from('article_ai_summaries')
      .update({ 
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('article_id', articleId)
    
    if (error) {
      handleDatabaseError(error)
    }
    
    // Here you would trigger your AI processing job
    // This could be a queue job, API call, etc.
  }
}

// Dashboard Service
export class DashboardService {
  static async getStats(): Promise<any> {
    const supabase = createServerSupabaseClient()
    
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // Get various stats in parallel
    const [
      { count: todayCrawled },
      { count: todayCreated },
      { count: totalAIJobs },
      { count: successfulAIJobs },
      { count: failedJobs },
      { count: highImportanceArticles }
    ] = await Promise.all([
      supabase.from('crawl_jobs').select('*', { count: 'exact', head: true }).gte('started_at', todayStr),
      supabase.from('articles').select('*', { count: 'exact', head: true }).gte('created_at', todayStr),
      supabase.from('ai_jobs').select('*', { count: 'exact', head: true }),
      supabase.from('ai_jobs').select('*', { count: 'exact', head: true }).eq('status', 'success'),
      supabase.from('crawl_jobs').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('importance', 'high').eq('status', 'published')
    ])
    
    const aiSuccessRate = totalAIJobs > 0 ? (successfulAIJobs || 0) / totalAIJobs : 1
    
    return {
      todayCrawled: todayCrawled || 0,
      todayCreated: todayCreated || 0,
      aiSuccessRate,
      pushSuccessRate: 1, // Would calculate from feishu_push_logs
      failedJobs: failedJobs || 0,
      highImportanceArticles: highImportanceArticles || 0
    }
  }

  static async getRecentJobs(): Promise<any[]> {
    return getRecords('crawl_jobs', {
      select: `
        *,
        source:news_sources(name)
      `,
      orderBy: { column: 'started_at', ascending: false },
      limit: 10
    })
  }

  static async getRecentAIJobs(): Promise<any[]> {
    return getRecords('ai_jobs', {
      orderBy: { column: 'started_at', ascending: false },
      limit: 10
    })
  }
}