'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit2,
  Trash2,
  ExternalLink,
  Send,
  Star,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  source: string
  category: string
  tags: string[]
  publishedAt: string
  isPublished: boolean
  isHighPriority: boolean
  aiSummary: string
  originalUrl: string
}

const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Visa 宣布推出新一代支付网关解决方案，支持 AI 智能风控',
    source: 'TechCrunch',
    category: '支付网关',
    tags: ['Visa', '支付网关', 'AI', '风控'],
    publishedAt: '2024-01-15 14:30',
    isPublished: true,
    isHighPriority: true,
    aiSummary: 'Visa 推出新一代支付网关，集成 AI 智能风控，实时交易处理能力提升 50%...',
    originalUrl: 'https://techcrunch.com/visa-gateway',
  },
  {
    id: '2',
    title: 'Square 推出面向中小企业的 AI 财务助手',
    source: 'Bloomberg',
    category: '支付 AI 科技',
    tags: ['Square', 'AI', '中小企业', '财务'],
    publishedAt: '2024-01-15 13:45',
    isPublished: true,
    isHighPriority: true,
    aiSummary: 'Square 发布 AI 驱动的财务管理工具，帮助中小企业自动化会计流程...',
    originalUrl: 'https://bloomberg.com/square-ai',
  },
  {
    id: '3',
    title: '央行发布跨境支付新规征求意见稿',
    source: '财经网',
    category: '支付监管与合规',
    tags: ['央行', '跨境支付', '监管', '合规'],
    publishedAt: '2024-01-15 12:00',
    isPublished: true,
    isHighPriority: false,
    aiSummary: '中国人民银行发布跨境支付管理新规，加强资金流动监控...',
    originalUrl: 'https://caijing.com/pboc-regulation',
  },
  {
    id: '4',
    title: 'Stripe 完成新一轮融资，估值达 700 亿美元',
    source: 'Reuters',
    category: '支付 SaaS / ISV',
    tags: ['Stripe', '融资', 'SaaS', '估值'],
    publishedAt: '2024-01-15 10:30',
    isPublished: false,
    isHighPriority: false,
    aiSummary: 'Stripe 获得新一轮融资，估值达到 700 亿美元，将加大 AI 领域投入...',
    originalUrl: 'https://reuters.com/stripe-funding',
  },
  {
    id: '5',
    title: 'PayPal 将支持 USDC 稳定币支付',
    source: 'CoinDesk',
    category: 'Crypto / 稳定币',
    tags: ['PayPal', 'USDC', '稳定币', 'Crypto'],
    publishedAt: '2024-01-15 09:15',
    isPublished: true,
    isHighPriority: true,
    aiSummary: 'PayPal 宣布将在其平台支持 USDC 稳定币，推动加密货币主流化...',
    originalUrl: 'https://coindesk.com/paypal-usdc',
  },
  {
    id: '6',
    title: 'Adyen 发布 2024 年全球支付趋势报告',
    source: 'Finextra',
    category: '支付终端',
    tags: ['Adyen', '报告', '趋势', '全球'],
    publishedAt: '2024-01-14 18:00',
    isPublished: true,
    isHighPriority: false,
    aiSummary: 'Adyen 年度报告显示，嵌入式支付和 AI 将成为 2024 年主要趋势...',
    originalUrl: 'https://finextra.com/adyen-report',
  },
]

const categories = [
  '全部分类',
  '支付终端',
  '支付网关',
  '支付 SaaS / ISV',
  '支付 AI 科技',
  'Crypto / 稳定币',
  '支付监管与合规',
  '跨境支付',
]

export function NewsTable() {
  const [selectedCategory, setSelectedCategory] = useState('全部分类')
  const [selectedNews, setSelectedNews] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const toggleSelectAll = () => {
    if (selectedNews.length === mockNews.length) {
      setSelectedNews([])
    } else {
      setSelectedNews(mockNews.map((n) => n.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedNews.includes(id)) {
      setSelectedNews(selectedNews.filter((n) => n !== id))
    } else {
      setSelectedNews([...selectedNews, id])
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索标题、来源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-72 rounded-lg border border-border bg-input pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {selectedNews.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              已选择 {selectedNews.length} 条
            </span>
            <Button variant="outline" size="sm">
              <Send className="mr-2 h-3.5 w-3.5" />
              批量推送
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-3.5 w-3.5" />
              批量发布
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={toggleSelectAll}
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                      selectedNews.length === mockNews.length
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {selectedNews.length === mockNews.length && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  资讯
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  分类
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  来源
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  发布时间
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  状态
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockNews.map((news) => (
                <tr
                  key={news.id}
                  className="group hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleSelect(news.id)}
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                        selectedNews.includes(news.id)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {selectedNews.includes(news.id) && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 max-w-md">
                    <div className="flex items-start gap-2">
                      {news.isHighPriority && (
                        <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-[oklch(0.80_0.16_80)] fill-[oklch(0.80_0.16_80)]" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-card-foreground line-clamp-1">
                          {news.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                          {news.aiSummary}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {news.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {news.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {news.source}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                    {news.publishedAt}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                        news.isPublished
                          ? 'bg-[oklch(0.72_0.19_160)]/10 text-[oklch(0.72_0.19_160)]'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {news.isPublished ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {news.isPublished ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Send className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            显示 1-6 条，共 847 条
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <span className="text-muted-foreground">...</span>
            <Button variant="outline" size="sm">
              142
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
