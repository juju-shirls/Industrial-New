'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

// Generic real-time hook for any table
export function useRealtimeTable<T extends TableName>(
  table: T,
  callback: (payload: RealtimePostgresChangesPayload<Tables[T]['Row']>) => void,
  options: {
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
    filter?: string
    enabled?: boolean
  } = {}
) {
  const { event = '*', filter, enabled = true } = options
  const channelRef = useRef<RealtimeChannel | null>(null)
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return

    const channelName = `${table}-changes-${Date.now()}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table: table as string,
          filter
        },
        (payload) => {
          callbackRef.current(payload as RealtimePostgresChangesPayload<Tables[T]['Row']>)
        }
      )
      .subscribe((status) => {
        console.log(`Real-time subscription status for ${table}:`, status)
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [table, event, filter, enabled])

  // Return unsubscribe function
  return () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }
}

// Specific hooks for different tables
export function useRealtimeArticles(
  callback: (payload: RealtimePostgresChangesPayload<Tables['articles']['Row']>) => void,
  options: { enabled?: boolean } = {}
) {
  return useRealtimeTable('articles', callback, options)
}

export function useRealtimeSources(
  callback: (payload: RealtimePostgresChangesPayload<Tables['news_sources']['Row']>) => void,
  options: { enabled?: boolean } = {}
) {
  return useRealtimeTable('news_sources', callback, options)
}

export function useRealtimeCrawlJobs(
  callback: (payload: RealtimePostgresChangesPayload<Tables['crawl_jobs']['Row']>) => void,
  options: { enabled?: boolean } = {}
) {
  return useRealtimeTable('crawl_jobs', callback, options)
}

export function useRealtimeAIJobs(
  callback: (payload: RealtimePostgresChangesPayload<Tables['ai_jobs']['Row']>) => void,
  options: { enabled?: boolean } = {}
) {
  return useRealtimeTable('ai_jobs', callback, options)
}

export function useRealtimeFeishuLogs(
  callback: (payload: RealtimePostgresChangesPayload<Tables['feishu_push_logs']['Row']>) => void,
  options: { enabled?: boolean } = {}
) {
  return useRealtimeTable('feishu_push_logs', callback, options)
}

// Hook for multiple tables (dashboard use case)
export function useRealtimeDashboard(
  callbacks: {
    onArticleChange?: (payload: RealtimePostgresChangesPayload<Tables['articles']['Row']>) => void
    onJobChange?: (payload: RealtimePostgresChangesPayload<Tables['crawl_jobs']['Row']>) => void
    onAIJobChange?: (payload: RealtimePostgresChangesPayload<Tables['ai_jobs']['Row']>) => void
    onPushLogChange?: (payload: RealtimePostgresChangesPayload<Tables['feishu_push_logs']['Row']>) => void
  },
  options: { enabled?: boolean } = {}
) {
  const { enabled = true } = options
  const channelRefs = useRef<RealtimeChannel[]>([])

  useEffect(() => {
    if (!enabled) return

    const channels: RealtimeChannel[] = []

    // Articles subscription
    if (callbacks.onArticleChange) {
      const articlesChannel = supabase
        .channel('dashboard-articles')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'articles'
          },
          callbacks.onArticleChange
        )
        .subscribe()
      
      channels.push(articlesChannel)
    }

    // Crawl jobs subscription
    if (callbacks.onJobChange) {
      const jobsChannel = supabase
        .channel('dashboard-crawl-jobs')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'crawl_jobs'
          },
          callbacks.onJobChange
        )
        .subscribe()
      
      channels.push(jobsChannel)
    }

    // AI jobs subscription
    if (callbacks.onAIJobChange) {
      const aiJobsChannel = supabase
        .channel('dashboard-ai-jobs')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'ai_jobs'
          },
          callbacks.onAIJobChange
        )
        .subscribe()
      
      channels.push(aiJobsChannel)
    }

    // Push logs subscription
    if (callbacks.onPushLogChange) {
      const pushLogsChannel = supabase
        .channel('dashboard-push-logs')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'feishu_push_logs'
          },
          callbacks.onPushLogChange
        )
        .subscribe()
      
      channels.push(pushLogsChannel)
    }

    channelRefs.current = channels

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel)
      })
      channelRefs.current = []
    }
  }, [enabled, callbacks])

  // Return cleanup function
  return () => {
    channelRefs.current.forEach(channel => {
      supabase.removeChannel(channel)
    })
    channelRefs.current = []
  }
}

// Connection status hook
export function useSupabaseConnection() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Listen to connection status
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setStatus('connected')
        setError(null)
      } else if (event === 'SIGNED_OUT') {
        setStatus('disconnected')
      }
    })

    // Check initial connection
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error.message)
        setStatus('disconnected')
      } else if (session) {
        setStatus('connected')
      } else {
        setStatus('disconnected')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return { status, error }
}