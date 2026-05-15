import { NextRequest, NextResponse } from 'next/server'
import { CategoriesService } from '@/lib/supabase/services'
import type { ApiResponse, Category, CreateCategoryForm } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const enabledOnly = searchParams.get('enabled') === 'true'
    
    const categories = enabledOnly 
      ? await CategoriesService.getEnabled()
      : await CategoriesService.getAll()
    
    return NextResponse.json({
      data: categories,
      message: 'Categories fetched successfully'
    } as ApiResponse<Category[]>)
    
  } catch (error) {
    console.error('Error fetching categories:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch categories'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCategoryForm = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'slug']
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
    
    // Validate slug format (alphanumeric and hyphens only)
    const slugPattern = /^[a-z0-9-]+$/
    if (!slugPattern.test(body.slug)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Slug can only contain lowercase letters, numbers, and hyphens'
          }
        } as ApiResponse<never>,
        { status: 400 }
      )
    }
    
    const category = await CategoriesService.create(body)
    
    return NextResponse.json(
      {
        data: category,
        message: 'Category created successfully'
      } as ApiResponse<Category>,
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating category:', error)
    
    // Check for duplicate slug error
    if (error instanceof Error && error.message.includes('duplicate') || error.message.includes('already exists')) {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_SLUG',
            message: 'A category with this slug already exists'
          }
        } as ApiResponse<never>,
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create category'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}