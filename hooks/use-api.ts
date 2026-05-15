import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { ApiResponse } from '@/lib/types'

interface UseApiOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (promise: Promise<Response>) => Promise<T | null>
}

export function useApi<T = any>(options: UseApiOptions = {}): UseApiReturn<T> {
  const { 
    showSuccessToast = false, 
    showErrorToast = true,
    successMessage = 'Operation completed successfully'
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (promise: Promise<Response>): Promise<T | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await promise
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData: ApiResponse<never> = await response.json()
          if (errorData.error?.message) {
            errorMessage = errorData.error.message
          }
        } catch {
          // If we can't parse the error response, use the default message
        }
        
        throw new Error(errorMessage)
      }
      
      const result: ApiResponse<T> = await response.json()
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      const responseData = result.data || null
      setData(responseData)
      
      if (showSuccessToast) {
        toast.success(result.message || successMessage)
      }
      
      setLoading(false)
      return responseData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      
      if (showErrorToast) {
        toast.error(errorMessage)
      }
      
      setLoading(false)
      throw err
    }
  }, [showSuccessToast, showErrorToast, successMessage])

  return { data, loading, error, execute }
}

// Utility function for making API requests with consistent error handling
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    
    try {
      const errorData: ApiResponse<never> = await response.json()
      if (errorData.error?.message) {
        errorMessage = errorData.error.message
      }
    } catch {
      // If we can't parse the error response, use the default message
    }
    
    throw new Error(errorMessage)
  }

  const result: ApiResponse<T> = await response.json()
  
  if (result.error) {
    throw new Error(result.error.message)
  }

  return result.data as T
}

// Hook for fetching data with automatic error handling
export function useFetch<T>(
  url: string | null,
  options: RequestInit = {}
): UseApiReturn<T> {
  const api = useApi<T>()
  
  const fetchData = useCallback(async () => {
    if (!url) return null
    
    return api.execute(fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }))
  }, [url, api, options])

  return {
    ...api,
    execute: fetchData
  }
}

// Hook for mutations with automatic error handling and toast notifications
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<Response>,
  options: UseApiOptions = {}
) {
  const api = useApi<TData>({
    showSuccessToast: true,
    showErrorToast: true,
    ...options
  })

  const mutate = useCallback(async (variables: TVariables): Promise<TData | null> => {
    return api.execute(mutationFn(variables))
  }, [api, mutationFn])

  return {
    ...api,
    mutate
  }
}