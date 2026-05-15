import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DashboardStats, CrawlJob, AIJob } from '@/lib/types'

interface DashboardState {
  // Data
  stats: DashboardStats | null
  recentJobs: CrawlJob[]
  aiJobs: AIJob[]
  
  // UI State
  loading: boolean
  error: string | null
  lastRefresh: Date | null
  
  // Actions
  setStats: (stats: DashboardStats) => void
  setRecentJobs: (jobs: CrawlJob[]) => void
  setAIJobs: (jobs: AIJob[]) => void
  
  // API Actions
  refreshDashboard: () => Promise<void>
  refreshStats: () => Promise<void>
  refreshJobs: () => Promise<void>
  
  // Loading & Error
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      // Initial state
      stats: null,
      recentJobs: [],
      aiJobs: [],
      loading: false,
      error: null,
      lastRefresh: null,

      // Data actions
      setStats: (stats) => 
        set({ stats, loading: false, error: null }),

      setRecentJobs: (jobs) => 
        set({ recentJobs: jobs }),

      setAIJobs: (jobs) => 
        set({ aiJobs: jobs }),

      // API actions
      refreshDashboard: async () => {
        set({ loading: true, error: null })
        try {
          await Promise.all([
            get().refreshStats(),
            get().refreshJobs()
          ])
          set({ lastRefresh: new Date(), loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to refresh dashboard',
            loading: false 
          })
        }
      },

      refreshStats: async () => {
        try {
          const response = await fetch('/api/dashboard/overview')
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to fetch dashboard stats')
          }
          
          const result = await response.json()
          if (result.data) {
            get().setStats(result.data)
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          throw error
        }
      },

      refreshJobs: async () => {
        try {
          // Fetch recent crawl jobs
          const crawlResponse = await fetch('/api/jobs/crawl?limit=10')
          if (!crawlResponse.ok) {
            throw new Error('Failed to fetch crawl jobs')
          }
          const crawlResult = await crawlResponse.json()
          
          // Fetch recent AI jobs
          const aiResponse = await fetch('/api/jobs/ai?limit=10')
          if (!aiResponse.ok) {
            throw new Error('Failed to fetch AI jobs')
          }
          const aiResult = await aiResponse.json()
          
          get().setRecentJobs(crawlResult.data || [])
          get().setAIJobs(aiResult.data || [])
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          throw error
        }
      },

      // Loading & Error actions
      setLoading: (loading) => 
        set({ loading }),

      setError: (error) => 
        set({ error, loading: false })
    }),
    { name: 'dashboard-store' }
  )
)