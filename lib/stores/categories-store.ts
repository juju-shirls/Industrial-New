import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  Category, 
  Tag, 
  CreateCategoryForm, 
  CreateTagForm, 
  ApiResponse 
} from '@/lib/types'

interface CategoriesState {
  // Data
  categories: Category[]
  tags: Tag[]
  
  // UI State
  loading: boolean
  error: string | null
  
  // Actions
  setCategories: (categories: Category[]) => void
  setTags: (tags: Tag[]) => void
  addCategory: (category: Category) => void
  addTag: (tag: Tag) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  updateTag: (id: string, updates: Partial<Tag>) => void
  deleteCategory: (id: string) => void
  deleteTag: (id: string) => void
  
  // API Actions
  createCategory: (data: CreateCategoryForm) => Promise<void>
  createTag: (data: CreateTagForm) => Promise<void>
  updateCategoryStatus: (id: string, enabled: boolean) => Promise<void>
  
  // Loading & Error
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Helpers
  getCategoryBySlug: (slug: string) => Category | undefined
  getTagBySlug: (slug: string) => Tag | undefined
  getEnabledCategories: () => Category[]
}

export const useCategoriesStore = create<CategoriesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      categories: [],
      tags: [],
      loading: false,
      error: null,

      // Data actions
      setCategories: (categories) => 
        set({ categories, loading: false, error: null }),

      setTags: (tags) => 
        set({ tags, loading: false, error: null }),

      addCategory: (category) => 
        set((state) => ({ 
          categories: [...state.categories, category].sort((a, b) => a.sort_order - b.sort_order)
        })),

      addTag: (tag) => 
        set((state) => ({ 
          tags: [...state.tags, tag].sort((a, b) => a.name.localeCompare(b.name))
        })),

      updateCategory: (id, updates) => 
        set((state) => ({
          categories: state.categories
            .map(category => category.id === id ? { ...category, ...updates } : category)
            .sort((a, b) => a.sort_order - b.sort_order)
        })),

      updateTag: (id, updates) => 
        set((state) => ({
          tags: state.tags
            .map(tag => tag.id === id ? { ...tag, ...updates } : tag)
            .sort((a, b) => a.name.localeCompare(b.name))
        })),

      deleteCategory: (id) => 
        set((state) => ({
          categories: state.categories.filter(category => category.id !== id)
        })),

      deleteTag: (id) => 
        set((state) => ({
          tags: state.tags.filter(tag => tag.id !== id)
        })),

      // API actions
      createCategory: async (data) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to create category')
          }
          
          const result: ApiResponse<Category> = await response.json()
          if (result.data) {
            get().addCategory(result.data)
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

      createTag: async (data) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to create tag')
          }
          
          const result: ApiResponse<Tag> = await response.json()
          if (result.data) {
            get().addTag(result.data)
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

      updateCategoryStatus: async (id, enabled) => {
        try {
          const response = await fetch(`/api/categories/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled })
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to update category')
          }
          
          get().updateCategory(id, { enabled })
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
        set({ error, loading: false }),

      // Helper functions
      getCategoryBySlug: (slug) => {
        return get().categories.find(category => category.slug === slug)
      },

      getTagBySlug: (slug) => {
        return get().tags.find(tag => tag.slug === slug)
      },

      getEnabledCategories: () => {
        return get().categories.filter(category => category.enabled)
      }
    }),
    { name: 'categories-store' }
  )
)