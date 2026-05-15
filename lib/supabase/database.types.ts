export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      news_sources: {
        Row: {
          id: string
          name: string
          type: 'rss' | 'website' | 'api' | 'search'
          url: string
          enabled: boolean
          crawl_interval_minutes: number
          last_crawled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'rss' | 'website' | 'api' | 'search'
          url: string
          enabled?: boolean
          crawl_interval_minutes?: number
          last_crawled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'rss' | 'website' | 'api' | 'search'
          url?: string
          enabled?: boolean
          crawl_interval_minutes?: number
          last_crawled_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          source_id: string
          title: string
          original_url: string
          canonical_url: string | null
          author: string | null
          source_name: string
          published_at: string
          crawled_at: string
          raw_html: string | null
          content_text: string
          language: string
          status: 'draft' | 'published' | 'archived'
          importance: 'low' | 'medium' | 'high'
          hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source_id: string
          title: string
          original_url: string
          canonical_url?: string | null
          author?: string | null
          source_name: string
          published_at: string
          crawled_at?: string
          raw_html?: string | null
          content_text: string
          language?: string
          status?: 'draft' | 'published' | 'archived'
          importance?: 'low' | 'medium' | 'high'
          hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_id?: string
          title?: string
          original_url?: string
          canonical_url?: string | null
          author?: string | null
          source_name?: string
          published_at?: string
          crawled_at?: string
          raw_html?: string | null
          content_text?: string
          language?: string
          status?: 'draft' | 'published' | 'archived'
          importance?: 'low' | 'medium' | 'high'
          hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      article_ai_summaries: {
        Row: {
          id: string
          article_id: string
          summary: string
          key_points: Json
          keywords: Json
          entities: Json
          model_name: string
          prompt_version: string
          status: 'pending' | 'success' | 'failed'
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          article_id: string
          summary: string
          key_points: Json
          keywords: Json
          entities: Json
          model_name: string
          prompt_version: string
          status?: 'pending' | 'success' | 'failed'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          summary?: string
          key_points?: Json
          keywords?: Json
          entities?: Json
          model_name?: string
          prompt_version?: string
          status?: 'pending' | 'success' | 'failed'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          sort_order: number
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          sort_order?: number
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          sort_order?: number
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      article_categories: {
        Row: {
          article_id: string
          category_id: string
        }
        Insert: {
          article_id: string
          category_id: string
        }
        Update: {
          article_id?: string
          category_id?: string
        }
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
      }
      crawl_jobs: {
        Row: {
          id: string
          source_id: string
          status: 'running' | 'success' | 'failed'
          started_at: string
          finished_at: string | null
          total_found: number
          total_created: number
          total_duplicated: number
          error_message: string | null
        }
        Insert: {
          id?: string
          source_id: string
          status?: 'running' | 'success' | 'failed'
          started_at?: string
          finished_at?: string | null
          total_found?: number
          total_created?: number
          total_duplicated?: number
          error_message?: string | null
        }
        Update: {
          id?: string
          source_id?: string
          status?: 'running' | 'success' | 'failed'
          started_at?: string
          finished_at?: string | null
          total_found?: number
          total_created?: number
          total_duplicated?: number
          error_message?: string | null
        }
      }
      ai_jobs: {
        Row: {
          id: string
          article_id: string
          job_type: 'summarize' | 'classify' | 'tag'
          status: 'pending' | 'running' | 'success' | 'failed'
          input_tokens: number | null
          output_tokens: number | null
          cost: number | null
          error_message: string | null
          started_at: string
          finished_at: string | null
        }
        Insert: {
          id?: string
          article_id: string
          job_type: 'summarize' | 'classify' | 'tag'
          status?: 'pending' | 'running' | 'success' | 'failed'
          input_tokens?: number | null
          output_tokens?: number | null
          cost?: number | null
          error_message?: string | null
          started_at?: string
          finished_at?: string | null
        }
        Update: {
          id?: string
          article_id?: string
          job_type?: 'summarize' | 'classify' | 'tag'
          status?: 'pending' | 'running' | 'success' | 'failed'
          input_tokens?: number | null
          output_tokens?: number | null
          cost?: number | null
          error_message?: string | null
          started_at?: string
          finished_at?: string | null
        }
      }
      feishu_webhooks: {
        Row: {
          id: string
          name: string
          webhook_url: string
          secret: string | null
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          webhook_url: string
          secret?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          webhook_url?: string
          secret?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      feishu_push_logs: {
        Row: {
          id: string
          article_id: string | null
          webhook_id: string
          push_type: 'daily_digest' | 'breaking_news' | 'manual'
          status: 'success' | 'failed'
          request_payload: Json
          response_body: string | null
          pushed_at: string
          error_message: string | null
        }
        Insert: {
          id?: string
          article_id?: string | null
          webhook_id: string
          push_type: 'daily_digest' | 'breaking_news' | 'manual'
          status: 'success' | 'failed'
          request_payload: Json
          response_body?: string | null
          pushed_at?: string
          error_message?: string | null
        }
        Update: {
          id?: string
          article_id?: string | null
          webhook_id?: string
          push_type?: 'daily_digest' | 'breaking_news' | 'manual'
          status?: 'success' | 'failed'
          request_payload?: Json
          response_body?: string | null
          pushed_at?: string
          error_message?: string | null
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          password_hash: string | null
          role: 'admin' | 'editor' | 'viewer'
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          password_hash?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password_hash?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_digests: {
        Row: {
          id: string
          digest_date: string
          title: string
          content: string
          status: 'draft' | 'sent'
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          digest_date: string
          title: string
          content: string
          status?: 'draft' | 'sent'
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          digest_date?: string
          title?: string
          content?: string
          status?: 'draft' | 'sent'
          sent_at?: string | null
          created_at?: string
        }
      }
      article_similarities: {
        Row: {
          id: string
          article_id: string
          similar_article_id: string
          similarity_score: number
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          similar_article_id: string
          similarity_score: number
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          similar_article_id?: string
          similarity_score?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}