import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  FeishuWebhook, 
  FeishuPushLog, 
  CreateFeishuWebhookForm, 
  ApiResponse 
} from '@/lib/types'

interface FeishuState {
  // Data
  webhooks: FeishuWebhook[]
  pushLogs: FeishuPushLog[]
  
  // UI State
  loading: boolean
  error: string | null
  
  // Actions
  setWebhooks: (webhooks: FeishuWebhook[]) => void
  setPushLogs: (logs: FeishuPushLog[]) => void
  addWebhook: (webhook: FeishuWebhook) => void
  updateWebhook: (id: string, updates: Partial<FeishuWebhook>) => void
  deleteWebhook: (id: string) => void
  addPushLog: (log: FeishuPushLog) => void
  
  // API Actions
  createWebhook: (data: CreateFeishuWebhookForm) => Promise<void>
  updateWebhookStatus: (id: string, enabled: boolean) => Promise<void>
  testWebhook: (id: string) => Promise<void>
  sendDailyDigest: (date: string, webhookId?: string) => Promise<void>
  
  // Loading & Error
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Helpers
  getEnabledWebhooks: () => FeishuWebhook[]
}

export const useFeishuStore = create<FeishuState>()(
  devtools(
    (set, get) => ({
      // Initial state
      webhooks: [],
      pushLogs: [],
      loading: false,
      error: null,

      // Data actions
      setWebhooks: (webhooks) => 
        set({ webhooks, loading: false, error: null }),

      setPushLogs: (logs) => 
        set({ pushLogs: logs }),

      addWebhook: (webhook) => 
        set((state) => ({ 
          webhooks: [...state.webhooks, webhook] 
        })),

      updateWebhook: (id, updates) => 
        set((state) => ({
          webhooks: state.webhooks.map(webhook => 
            webhook.id === id ? { ...webhook, ...updates } : webhook
          )
        })),

      deleteWebhook: (id) => 
        set((state) => ({
          webhooks: state.webhooks.filter(webhook => webhook.id !== id)
        })),

      addPushLog: (log) => 
        set((state) => ({ 
          pushLogs: [log, ...state.pushLogs] 
        })),

      // API actions
      createWebhook: async (data) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/feishu/webhooks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to create webhook')
          }
          
          const result: ApiResponse<FeishuWebhook> = await response.json()
          if (result.data) {
            get().addWebhook(result.data)
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

      updateWebhookStatus: async (id, enabled) => {
        try {
          const response = await fetch(`/api/feishu/webhooks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled })
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to update webhook')
          }
          
          get().updateWebhook(id, { enabled })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          throw error
        }
      },

      testWebhook: async (id) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/feishu/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ webhookId: id })
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to test webhook')
          }
          
          // Add a test push log
          const testLog: FeishuPushLog = {
            id: `test-${Date.now()}`,
            webhook_id: id,
            push_type: 'manual',
            status: 'success',
            request_payload: { test: true },
            pushed_at: new Date().toISOString()
          }
          
          get().addPushLog(testLog)
          set({ loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          })
          throw error
        }
      },

      sendDailyDigest: async (date, webhookId) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/feishu/daily-digest/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, webhookId })
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to send daily digest')
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

      // Loading & Error actions
      setLoading: (loading) => 
        set({ loading }),

      setError: (error) => 
        set({ error, loading: false }),

      // Helper functions
      getEnabledWebhooks: () => {
        return get().webhooks.filter(webhook => webhook.enabled)
      }
    }),
    { name: 'feishu-store' }
  )
)