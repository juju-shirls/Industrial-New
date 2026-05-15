import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ArticlesService } from '@/lib/supabase/services'
import type { 
  NewsArticle, 
  NewsFilters, 
  PaginatedResponse,
  ApiResponse 
} from '@/lib/types'

interface NewsState {
  // Data
  articles: NewsArticle[]
  selectedArticles: string[]
  totalCount: number
  
  // UI State
  loading: boolean
  error: string | null
  currentPage: number
  pageSize: number
  
  // Filters
  filters: NewsFilters
  searchQuery: string
  
  // Actions
  setArticles: (response: PaginatedResponse<NewsArticle>) => void
  addArticle: (article: NewsArticle) => void
  updateArticle: (id: string, updates: Partial<NewsArticle>) => void
  deleteArticle: (id: string) => void
  
  // Selection
  selectArticle: (id: string) => void
  selectAllArticles: () => void
  clearSelection: () => void
  
  // Filters & Search
  setFilters: (filters: Partial<NewsFilters>) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
  
  // Pagination
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  
  // Loading & Error
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Supabase integration
  fetchArticles: () => Promise<void>
  handleRealtimeUpdate: (payload: any) => void
  
  // Bulk Operations
  publishArticles: (ids: string[]) => Promise<void>
  unpublishArticles: (ids: string[]) => Promise<void>
  deleteArticles: (ids: string[]) => Promise<void>
  pushToFeishu: (ids: string[], webhookId: string) => Promise<void>
}

export const useNewsStore = create<NewsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      articles: [],
      selectedArticles: [],
      totalCount: 0,
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 20,
      filters: {},
      searchQuery: '',

      // Data actions
      setArticles: (response) => 
        set({ 
          articles: response.data, 
          totalCount: response.pagination.total,
          currentPage: response.pagination.page,
          loading: false,
          error: null 
        }),

      addArticle: (article) => 
        set((state) => ({ 
          articles: [article, ...state.articles],
          totalCount: state.totalCount + 1 
        })),

      updateArticle: (id, updates) => 
        set((state) => ({
          articles: state.articles.map(article => 
            article.id === id ? { ...article, ...updates } : article
          )
        })),

      deleteArticle: (id) => 
        set((state) => ({
          articles: state.articles.filter(article => article.id !== id),
          selectedArticles: state.selectedArticles.filter(articleId => articleId !== id),
          totalCount: state.totalCount - 1
        })),

      // Selection actions
      selectArticle: (id) => 
        set((state) => {
          const isSelected = state.selectedArticles.includes(id)
          return {
            selectedArticles: isSelected
              ? state.selectedArticles.filter(articleId => articleId !== id)
              : [...state.selectedArticles, id]
          }
        }),

      selectAllArticles: () => 
        set((state) => ({
          selectedArticles: state.selectedArticles.length === state.articles.length
            ? []
            : state.articles.map(article => article.id)
        })),

      clearSelection: () => 
        set({ selectedArticles: [] }),

      // Filter & Search actions
      setFilters: (newFilters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...newFilters },
          currentPage: 1 // Reset to first page when filtering
        })),

      setSearchQuery: (query) => 
        set({ 
          searchQuery: query,
          currentPage: 1 // Reset to first page when searching
        }),

      clearFilters: () => 
        set({ 
          filters: {},
          searchQuery: '',
          currentPage: 1 
        }),

      // Pagination actions
      setPage: (page) => 
        set({ currentPage: page }),

      setPageSize: (size) => 
        set({ 
          pageSize: size,
          currentPage: 1 // Reset to first page when changing page size
        }),

      // Loading & Error actions
      setLoading: (loading) => 
        set({ loading }),

      setError: (error) => 
        set({ error, loading: false }),

      // Supabase integration
      fetchArticles: async () => {
        const state = get()
        set({ loading: true, error: null })
        
        try {
          const result = await ArticlesService.getPaginated(
            state.currentPage,
            state.pageSize,
            {
              ...state.filters,
              keyword: state.searchQuery || undefined
            }
          )
          
          set({ 
            articles: result.data,
            totalCount: result.pagination.total,
            currentPage: result.pagination.page,
            loading: false,
            error: null
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch articles',
            loading: false 
          })
        }
      },

      handleRealtimeUpdate: (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload
        
        set((state) => {
          let updatedArticles = [...state.articles]
          
          switch (eventType) {
            case 'INSERT':
              if (newRecord) {
                updatedArticles = [newRecord, ...updatedArticles]
              }
              break
              
            case 'UPDATE':
              if (newRecord) {
                const index = updatedArticles.findIndex(a => a.id === newRecord.id)
                if (index >= 0) {
                  updatedArticles[index] = newRecord
                }
              }
              break
              
            case 'DELETE':
              if (oldRecord) {
                updatedArticles = updatedArticles.filter(a => a.id !== oldRecord.id)
              }
              break
          }
          
          return { articles: updatedArticles }
        })
      },

      // Bulk operations
      publishArticles: async (ids) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/articles/bulk-publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
          })
          
          if (!response.ok) {
            throw new Error('Failed to publish articles')
          }
          
          set((state) => ({
            articles: state.articles.map(article => 
              ids.includes(article.id) ? { ...article, status: 'published' as const } : article
            ),
            selectedArticles: [],
            loading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          })
        }
      },

      unpublishArticles: async (ids) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/articles/bulk-unpublish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
          })
          
          if (!response.ok) {
            throw new Error('Failed to unpublish articles')
          }
          
          set((state) => ({
            articles: state.articles.map(article => 
              ids.includes(article.id) ? { ...article, status: 'draft' as const } : article
            ),
            selectedArticles: [],
            loading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          })
        }
      },

      deleteArticles: async (ids) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/articles/bulk-delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
          })
          
          if (!response.ok) {
            throw new Error('Failed to delete articles')
          }
          
          set((state) => ({
            articles: state.articles.filter(article => !ids.includes(article.id)),
            selectedArticles: [],
            totalCount: state.totalCount - ids.length,
            loading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          })
        }
      },

      pushToFeishu: async (ids, webhookId) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/feishu/push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ articleIds: ids, webhookId, pushType: 'manual' })
          })
          
          if (!response.ok) {
            throw new Error('Failed to push to Feishu')
          }
          
          set({ 
            selectedArticles: [],
            loading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          })
        }
      }
    }),
    { name: 'news-store' }
  )
)