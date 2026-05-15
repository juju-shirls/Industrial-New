import { NextRequest, NextResponse } from 'next/server'
import { ArticlesService } from '@/lib/supabase/services'
import type { ApiResponse, NewsArticle } from '@/lib/types'

interface Params {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ID',
            message: 'Article ID is required'
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    const article = await ArticlesService.getById(id)
    
    if (!article) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Article not found'
          }
        } as ApiResponse<never>,
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      data: article,
      message: 'Article fetched successfully'
    } as ApiResponse<NewsArticle>)
    
  } catch (error) {
    console.error('Error fetching article:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch article'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = params
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ID',
            message: 'Article ID is required'
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    const article = await ArticlesService.update(id, body)
    
    return NextResponse.json({
      data: article,
      message: 'Article updated successfully'
    } as ApiResponse<NewsArticle>)
    
  } catch (error) {
    console.error('Error updating article:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update article'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ID',
            message: 'Article ID is required'
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    await ArticlesService.bulkDelete([id])
    
    return NextResponse.json({
      message: 'Article deleted successfully'
    } as ApiResponse<never>)
    
  } catch (error) {
    console.error('Error deleting article:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete article'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}