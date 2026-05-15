import { NextRequest, NextResponse } from 'next/server'
import { ArticlesService } from '@/lib/supabase/services'
import type { ApiResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Article IDs array is required'
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    // Validate IDs are strings
    if (!ids.every(id => typeof id === 'string')) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'All article IDs must be strings'
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    await ArticlesService.bulkUpdateStatus(ids, 'published')
    
    return NextResponse.json({
      message: `Successfully published ${ids.length} articles`
    } as ApiResponse<never>)
    
  } catch (error) {
    console.error('Error bulk publishing articles:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to publish articles'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}