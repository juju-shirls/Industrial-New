import { createServerSupabaseClient } from './client'
import type { Database } from './database.types'

type Tables = Database['public']['Tables']

// Generic database utilities
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export function handleDatabaseError(error: any): never {
  console.error('Database operation failed:', error)
  
  if (error?.code === 'PGRST116') {
    throw new DatabaseError('Record not found', 'NOT_FOUND', error)
  }
  
  if (error?.code === '23505') {
    throw new DatabaseError('Record already exists', 'DUPLICATE', error)
  }
  
  if (error?.code === '23503') {
    throw new DatabaseError('Referenced record not found', 'FOREIGN_KEY', error)
  }
  
  if (error?.code === '42501') {
    throw new DatabaseError('Permission denied', 'UNAUTHORIZED', error)
  }
  
  throw new DatabaseError(
    error?.message || 'Database operation failed',
    error?.code || 'UNKNOWN',
    error
  )
}

// Generic CRUD operations
export async function createRecord<T extends keyof Tables>(
  table: T,
  data: Tables[T]['Insert']
): Promise<Tables[T]['Row']> {
  const supabase = createServerSupabaseClient()
  
  const { data: record, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single()
  
  if (error) {
    handleDatabaseError(error)
  }
  
  return record
}

export async function updateRecord<T extends keyof Tables>(
  table: T,
  id: string,
  data: Tables[T]['Update']
): Promise<Tables[T]['Row']> {
  const supabase = createServerSupabaseClient()
  
  const { data: record, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    handleDatabaseError(error)
  }
  
  return record
}

export async function deleteRecord<T extends keyof Tables>(
  table: T,
  id: string
): Promise<void> {
  const supabase = createServerSupabaseClient()
  
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
  
  if (error) {
    handleDatabaseError(error)
  }
}

export async function getRecord<T extends keyof Tables>(
  table: T,
  id: string
): Promise<Tables[T]['Row'] | null> {
  const supabase = createServerSupabaseClient()
  
  const { data: record, error } = await supabase
    .from(table)
    .select()
    .eq('id', id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Record not found
    }
    handleDatabaseError(error)
  }
  
  return record
}

export async function getRecords<T extends keyof Tables>(
  table: T,
  options: {
    select?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
    offset?: number
  } = {}
): Promise<Tables[T]['Row'][]> {
  const supabase = createServerSupabaseClient()
  
  let query = supabase.from(table).select(options.select || '*')
  
  // Apply filters
  if (options.filters) {
    Object.entries(options.filters).forEach(([column, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(column, value)
      }
    })
  }
  
  // Apply ordering
  if (options.orderBy) {
    query = query.order(options.orderBy.column, { 
      ascending: options.orderBy.ascending ?? true 
    })
  }
  
  // Apply pagination
  if (options.limit) {
    query = query.limit(options.limit)
  }
  
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 1000) - 1)
  }
  
  const { data: records, error } = await query
  
  if (error) {
    handleDatabaseError(error)
  }
  
  return records || []
}

// Pagination utilities
export interface PaginationOptions {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export async function getPaginatedRecords<T extends keyof Tables>(
  table: T,
  options: PaginationOptions & {
    select?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    search?: { columns: string[]; query: string }
  }
): Promise<PaginatedResult<Tables[T]['Row']>> {
  const supabase = createServerSupabaseClient()
  
  let query = supabase.from(table).select(options.select || '*', { count: 'exact' })
  let countQuery = supabase.from(table).select('*', { count: 'exact', head: true })
  
  // Apply filters to both queries
  if (options.filters) {
    Object.entries(options.filters).forEach(([column, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(column, value)
        countQuery = countQuery.eq(column, value)
      }
    })
  }
  
  // Apply search to both queries
  if (options.search && options.search.query) {
    const searchConditions = options.search.columns
      .map(col => `${col}.ilike.%${options.search!.query}%`)
      .join(',')
    
    query = query.or(searchConditions)
    countQuery = countQuery.or(searchConditions)
  }
  
  // Apply ordering
  if (options.orderBy) {
    query = query.order(options.orderBy.column, { 
      ascending: options.orderBy.ascending ?? true 
    })
  }
  
  // Apply pagination
  const offset = (options.page - 1) * options.pageSize
  query = query.range(offset, offset + options.pageSize - 1)
  
  // Execute both queries
  const [{ data: records, error: dataError, count }, { error: countError }] = await Promise.all([
    query,
    countQuery
  ])
  
  if (dataError) {
    handleDatabaseError(dataError)
  }
  
  if (countError) {
    handleDatabaseError(countError)
  }
  
  const total = count || 0
  const totalPages = Math.ceil(total / options.pageSize)
  
  return {
    data: records || [],
    pagination: {
      page: options.page,
      pageSize: options.pageSize,
      total,
      totalPages
    }
  }
}

// Batch operations
export async function batchInsert<T extends keyof Tables>(
  table: T,
  records: Tables[T]['Insert'][],
  batchSize = 100
): Promise<Tables[T]['Row'][]> {
  const supabase = createServerSupabaseClient()
  const results: Tables[T]['Row'][] = []
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    
    const { data, error } = await supabase
      .from(table)
      .insert(batch)
      .select()
    
    if (error) {
      handleDatabaseError(error)
    }
    
    if (data) {
      results.push(...data)
    }
  }
  
  return results
}

export async function batchUpdate<T extends keyof Tables>(
  table: T,
  updates: Array<{ id: string; data: Tables[T]['Update'] }>,
  batchSize = 50
): Promise<Tables[T]['Row'][]> {
  const results: Tables[T]['Row'][] = []
  
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize)
    const batchPromises = batch.map(({ id, data }) => updateRecord(table, id, data))
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
  }
  
  return results
}

export async function batchDelete<T extends keyof Tables>(
  table: T,
  ids: string[],
  batchSize = 100
): Promise<void> {
  const supabase = createServerSupabaseClient()
  
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)
    
    const { error } = await supabase
      .from(table)
      .delete()
      .in('id', batch)
    
    if (error) {
      handleDatabaseError(error)
    }
  }
}

// Transaction helper (using Supabase RPC for complex transactions)
export async function executeTransaction(
  operations: Array<{
    table: keyof Tables
    operation: 'insert' | 'update' | 'delete'
    data?: any
    id?: string
  }>
): Promise<void> {
  // For complex transactions, you would typically create a stored procedure
  // This is a simplified version that executes operations sequentially
  const supabase = createServerSupabaseClient()
  
  try {
    for (const op of operations) {
      switch (op.operation) {
        case 'insert':
          await supabase.from(op.table).insert(op.data)
          break
        case 'update':
          await supabase.from(op.table).update(op.data).eq('id', op.id!)
          break
        case 'delete':
          await supabase.from(op.table).delete().eq('id', op.id!)
          break
      }
    }
  } catch (error) {
    // In a real transaction, you would rollback here
    throw error
  }
}