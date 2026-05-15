import { NextRequest, NextResponse } from 'next/server'
import { ArticlesService } from '@/lib/supabase/services'
import type { ApiResponse, PaginatedResponse, NewsArticle, NewsFilters } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    
    // Parse filter parameters
    const filters: NewsFilters = {}
    
    if (searchParams.get('keyword')) filters.keyword = searchParams.get('keyword')!
    if (searchParams.get('category')) filters.category = searchParams.get('category')!
    if (searchParams.get('tag')) filters.tag = searchParams.get('tag')!
    if (searchParams.get('sourceId')) filters.sourceId = searchParams.get('sourceId')!
    if (searchParams.get('importance')) filters.importance = searchParams.get('importance') as any
    if (searchParams.get('status')) filters.status = searchParams.get('status') as any
    if (searchParams.get('startDate')) filters.startDate = searchParams.get('startDate')!
    if (searchParams.get('endDate')) filters.endDate = searchParams.get('endDate')!
    
    // Validate pagination parameters
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_PAGINATION',
            message: 'Invalid pagination parameters'
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    // Fetch articles from Supabase
    const result = await ArticlesService.getPaginated(page, pageSize, filters)
    
    return NextResponse.json({
      data: result.data,
      pagination: result.pagination,
      message: 'Articles fetched successfully'
    } as PaginatedResponse<NewsArticle>)
    
  } catch (error) {
    console.error('Error fetching articles:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch articles'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'original_url', 'source_name', 'published_at', 'content_text']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: `Missing required fields: ${missingFields.join(', ')}`
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    // Create article
    const article = await ArticlesService.create({
      source_id: body.source_id,
      title: body.title,
      original_url: body.original_url,
      canonical_url: body.canonical_url,
      author: body.author,
      source_name: body.source_name,
      published_at: body.published_at,
      crawled_at: new Date().toISOString(),
      raw_html: body.raw_html,
      content_text: body.content_text,
      language: body.language || 'zh-CN',
      status: body.status || 'draft',
      importance: body.importance || 'medium',
      hash: body.hash
    })
    
    return NextResponse.json(
      {
        data: article,
        message: 'Article created successfully'
      } as ApiResponse<NewsArticle>,
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating article:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create article'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}