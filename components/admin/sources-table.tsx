'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Power,
  RefreshCw,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Globe,
} from 'lucide-react'

interface NewsSource {
  id: string
  name: string
  url: string
  category: string
  frequency: string
  lastCrawl: string
  lastCrawlStatus: 'success' | 'failed' | 'pending'
  isEnabled: boolean
  articleCount: number
}

const mockSources: NewsSource[] = [
  {
    id: '1',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/tag/fintech',
    category: '支付科技',
    frequency: '每 30 分钟',
    lastCrawl: '2024-01-15 14:30',
    lastCrawlStatus: 'success',
    isEnabled: true,
    articleCount: 1245,
  },
  {
    id: '2',
    name: 'Bloomberg Fintech',
    url: 'https://bloomberg.com/fintech',
    category: '综合财经',
    frequency: '每 1 小时',
    lastCrawl: '2024-01-15 14:00',
    lastCrawlStatus: 'success',
    isEnabled: true,
    articleCount: 892,
  },
  {
    id: '3',
    name: 'CoinDesk',
    url: 'https://coindesk.com/payments',
    category: 'Crypto',
    frequency: '每 15 分钟',
    lastCrawl: '2024-01-15 14:35',
    lastCrawlStatus: 'success',
    isEnabled: true,
    articleCount: 2156,
  },
  {
    id: '4',
    name: 'Reuters Fintech',
    url: 'https://reuters.com/technology/fintech',
    category: '综合财经',
    frequency: '每 1 小时',
    lastCrawl: '2024-01-15 13:00',
    lastCrawlStatus: 'failed',
    isEnabled: true,
    articleCount: 567,
  },
  {
    id: '5',
    name: '财经网',
    url: 'https://caijing.com.cn/payment',
    category: '国内媒体',
    frequency: '每 2 小时',
    lastCrawl: '2024-01-15 12:00',
    lastCrawlStatus: 'success',
    isEnabled: true,
    articleCount: 423,
  },
  {
    id: '6',
    name: 'Finextra',
    url: 'https://finextra.com',
    category: '支付科技',
    frequency: '每 30 分钟',
    lastCrawl: '2024-01-15 14:20',
    lastCrawlStatus: 'pending',
    isEnabled: false,
    articleCount: 789,
  },
]

export function SourcesTable() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索新闻源..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-72 rounded-lg border border-border bg-input pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          添加新闻源
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockSources.map((source) => (
          <div
            key={source.id}
            className={cn(
              'group relative rounded-xl border bg-card p-5 transition-all hover:shadow-lg',
              source.isEnabled ? 'border-border hover:border-primary/30' : 'border-border/50 opacity-60'
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground">{source.name}</h3>
                  <p className="text-xs text-muted-foreground">{source.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* URL */}
            <div className="mt-4">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors truncate"
              >
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{source.url}</span>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{source.frequency}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{source.articleCount.toLocaleString()} 篇</span>
              </div>
            </div>

            {/* Last Crawl Status */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                {source.lastCrawlStatus === 'success' && (
                  <CheckCircle2 className="h-4 w-4 text-[oklch(0.72_0.19_160)]" />
                )}
                {source.lastCrawlStatus === 'failed' && (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                {source.lastCrawlStatus === 'pending' && (
                  <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
                )}
                <span className="text-xs text-muted-foreground">
                  {source.lastCrawl}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7 px-2',
                  source.isEnabled
                    ? 'text-[oklch(0.72_0.19_160)] hover:bg-[oklch(0.72_0.19_160)]/10'
                    : 'text-muted-foreground'
                )}
              >
                <Power className="mr-1 h-3.5 w-3.5" />
                {source.isEnabled ? '启用' : '禁用'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
