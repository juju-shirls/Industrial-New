import { NextRequest, NextResponse } from 'next/server'
import { DashboardService } from '@/lib/supabase/services'
import type { ApiResponse, DashboardStats } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const stats = await DashboardService.getStats()
    
    return NextResponse.json({
      data: stats,
      message: 'Dashboard stats fetched successfully'
    } as ApiResponse<DashboardStats>)
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
        }
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}