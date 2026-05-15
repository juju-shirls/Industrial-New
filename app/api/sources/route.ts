import { NextRequest, NextResponse } from 'next/server'
import { NewsSourcesService } from '@/lib/supabase/services'
import type { ApiResponse, NewsSource, CreateNewsSourceForm } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const sources = await NewsSourcesService.getAll()
    
    return NextResponse.json({
      data: sources,
      message: 'News sources fetched successfully'
    } as ApiResponse<NewsSource[]>)
    
  } catch (error) {
    console.error('Error fetching news sources:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch news sources'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateNewsSourceForm = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'url']
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
    
    // Validate URL
    try {
      new URL(body.url)
    } catch {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid URL format'
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    // Validate type
    const validTypes = ['rss', 'website', 'api', 'search']
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: `Invalid type. Must be one of: ${validTypes.join(', ')}`
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    // Validate crawl interval
    if (body.crawl_interval_minutes && (body.crawl_interval_minutes < 5 || body.crawl_interval_minutes > 1440)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Crawl interval must be between 5 and 1440 minutes'
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    const source = await NewsSourcesService.create(body)
    
    return NextResponse.json(
      {
        data: source,
        message: 'News source created successfully'
      } as ApiResponse<NewsSource>,
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating news source:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create news source'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}