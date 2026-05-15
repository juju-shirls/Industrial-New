import { NextRequest, NextResponse } from 'next/server'
import { ArticlesService } from '@/lib/supabase/services'
import type { ApiResponse } from '@/lib/types'

export async function DELETE(request: NextRequest) {
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
    
    await ArticlesService.bulkDelete(ids)
    
    return NextResponse.json({
      message: `Successfully deleted ${ids.length} articles`
    } as ApiResponse<never>)
    
  } catch (error) {
    console.error('Error bulk deleting articles:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete articles'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}