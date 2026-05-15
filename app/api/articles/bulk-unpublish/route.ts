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
    
    await ArticlesService.bulkUpdateStatus(ids, 'draft')
    
    return NextResponse.json({
      message: `Successfully unpublished ${ids.length} articles`
    } as ApiResponse<never>)
    
  } catch (error) {
    console.error('Error bulk unpublishing articles:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to unpublish articles'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}