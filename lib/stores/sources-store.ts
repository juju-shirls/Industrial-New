import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { NewsSource, CreateNewsSourceForm, ApiResponse } from '@/lib/types'

interface SourcesState {
  // Data
  sources: NewsSource[]
  
  // UI State
  loading: boolean
  error: string | null
  
  // Actions
  setSources: (sources: NewsSource[]) => void
  addSource: (source: NewsSource) => void
  updateSource: (id: string, updates: Partial<NewsSource>) => void
  deleteSource: (id: string) => void
  
  // API Actions
  createSource: (data: CreateNewsSourceForm) => Promise<void>
  updateSourceStatus: (id: string, enabled: boolean) => Promise<void>
  triggerCrawl: (id: string) => Promise<void>
  triggerAllCrawl: () => Promise<void>
  
  // Loading & Error
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useSourcesStore = create<SourcesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      sources: [],
      loading: false,
      error: null,

      // Data actions
      setSources: (sources) => 
        set({ sources, loading: false, error: null }),

      addSource: (source) => 
        set((state) => ({ 
          sources: [...state.sources, source] 
        })),

      updateSource: (id, updates) => 
        set((state) => ({
          sources: state.sources.map(source => 
            source.id === id ? { ...source, ...updates } : source
          )
        })),

      deleteSource: (id) => 
        set((state) => ({
          sources: state.sources.filter(source => source.id !== id)
        })),

      // API actions
      createSource: async (data) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/sources', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to create source')
          }
          
          const result: ApiResponse<NewsSource> = await response.json()
          if (result.data) {
            get().addSource(result.data)
          }
          
          set({ loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          })
          throw error
        }
      },

      updateSourceStatus: async (id, enabled) => {
        try {
          const response = await fetch(`/api/sources/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled })
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to update source')
          }
          
          get().updateSource(id, { enabled })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          throw error
        }
      },

      triggerCrawl: async (id) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`/api/sources/${id}/crawl`, {
            method: 'POST'
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to trigger crawl')
          }
          
          // Update last_crawled_at to current time
          get().updateSource(id, { 
            last_crawled_at: new Date().toISOString() 
          })
          
          set({ loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          })
          throw error
        }
      },

      triggerAllCrawl: async () => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/sources/crawl-all', {
            method: 'POST'
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to trigger crawl for all sources')
          }
          
          // Update all enabled sources' last_crawled_at
          const currentTime = new Date().toISOString()
          set((state) => ({
            sources: state.sources.map(source => 
              source.enabled ? { ...source, last_crawled_at: currentTime } : source
            ),
            loading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
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
    { name: 'sources-store' }
  )
)