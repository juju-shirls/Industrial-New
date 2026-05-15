'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'

type LogType = 'crawl' | 'ai' | 'classify' | 'push' | 'error'
type LogStatus = 'success' | 'failed' | 'warning' | 'info'

interface LogEntry {
  id: string
  type: LogType
  status: LogStatus
  message: string
  details?: string
  timestamp: string
  source?: string
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    type: 'push',
    status: 'success',
    message: '飞书推送成功',
    details: '支付行业群 - 3 条消息',
    timestamp: '2024-01-15 14:30:15',
  },
  {
    id: '2',
    type: 'ai',
    status: 'success',
    message: 'AI 摘要生成完成',
    details: 'Visa 宣布推出新一代支付网关解决方案',
    timestamp: '2024-01-15 14:29:45',
    source: 'TechCrunch',
  },
  {
    id: '3',
    type: 'classify',
    status: 'success',
    message: '自动分类完成',
    details: '归类为: 支付网关',
    timestamp: '2024-01-15 14:29:30',
  },
  {
    id: '4',
    type: 'crawl',
    status: 'success',
    message: '抓取完成',
    details: '获取 12 条新闻',
    timestamp: '2024-01-15 14:29:00',
    source: 'TechCrunch',
  },
  {
    id: '5',
    type: 'error',
    status: 'failed',
    message: 'Reuters 抓取失败',
    details: '连接超时 (ETIMEDOUT)',
    timestamp: '2024-01-15 14:15:00',
    source: 'Reuters',
  },
  {
    id: '6',
    type: 'ai',
    status: 'warning',
    message: 'AI 处理延迟',
    details: '队列积压 15 条待处理',
    timestamp: '2024-01-15 14:10:00',
  },
  {
    id: '7',
    type: 'crawl',
    status: 'success',
    message: '抓取完成',
    details: '获取 8 条新闻',
    timestamp: '2024-01-15 14:00:00',
    source: 'Bloomberg',
  },
  {
    id: '8',
    type: 'push',
    status: 'success',
    message: '飞书推送成功',
    details: '高优先级预警群 - 1 条消息',
    timestamp: '2024-01-15 13:45:00',
  },
  {
    id: '9',
    type: 'classify',
    status: 'info',
    message: '重新分类',
    details: '手动调整: 支付 AI 科技 -> 支付 SaaS',
    timestamp: '2024-01-15 13:30:00',
  },
  {
    id: '10',
    type: 'error',
    status: 'failed',
    message: '飞书推送失败',
    details: 'Webhook 响应 403',
    timestamp: '2024-01-15 12:00:00',
    source: 'Crypto 资讯群',
  },
]

const logTypeLabels: Record<LogType, string> = {
  crawl: '抓取',
  ai: 'AI 处理',
  classify: '分类',
  push: '推送',
  error: '错误',
}

const logTypeColors: Record<LogType, string> = {
  crawl: 'bg-[oklch(0.65_0.18_250)]/10 text-[oklch(0.65_0.18_250)]',
  ai: 'bg-primary/10 text-primary',
  classify: 'bg-[oklch(0.75_0.16_60)]/10 text-[oklch(0.75_0.16_60)]',
  push: 'bg-[oklch(0.70_0.15_300)]/10 text-[oklch(0.70_0.15_300)]',
  error: 'bg-destructive/10 text-destructive',
}

const statusIcons: Record<LogStatus, typeof CheckCircle2> = {
  success: CheckCircle2,
  failed: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const statusColors: Record<LogStatus, string> = {
  success: 'text-[oklch(0.72_0.19_160)]',
  failed: 'text-destructive',
  warning: 'text-[oklch(0.80_0.16_80)]',
  info: 'text-[oklch(0.65_0.18_250)]',
}

export function LogsTable() {
  const [selectedType, setSelectedType] = useState<LogType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  const filteredLogs = mockLogs.filter((log) => {
    if (selectedType !== 'all' && log.type !== selectedType) return false
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索日志..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-64 rounded-lg border border-border bg-input pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as LogType | 'all')}
              className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">全部类型</option>
              <option value="crawl">抓取日志</option>
              <option value="ai">AI 处理</option>
              <option value="classify">分类日志</option>
              <option value="push">推送日志</option>
              <option value="error">错误日志</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      {/* Logs List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {filteredLogs.map((log) => {
            const StatusIcon = statusIcons[log.status]
            const isExpanded = expandedLog === log.id

            return (
              <div key={log.id} className="hover:bg-muted/20 transition-colors">
                <button
                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <StatusIcon
                    className={cn('h-5 w-5 flex-shrink-0', statusColors[log.status])}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex rounded px-2 py-0.5 text-xs font-medium',
                          logTypeColors[log.type]
                        )}
                      >
                        {logTypeLabels[log.type]}
                      </span>
                      <span className="text-sm font-medium text-card-foreground truncate">
                        {log.message}
                      </span>
                    </div>
                    {log.details && (
                      <p className="mt-1 text-xs text-muted-foreground truncate">
                        {log.details}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {log.source && (
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {log.source}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {log.timestamp}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-muted-foreground transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="border-t border-border bg-muted/10 px-4 py-3">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">日志 ID:</span>
                        <span className="ml-2 font-mono text-card-foreground">{log.id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">时间戳:</span>
                        <span className="ml-2 text-card-foreground">{log.timestamp}</span>
                      </div>
                      {log.source && (
                        <div>
                          <span className="text-muted-foreground">来源:</span>
                          <span className="ml-2 text-card-foreground">{log.source}</span>
                        </div>
                      )}
                      {log.details && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">详情:</span>
                          <span className="ml-2 text-card-foreground">{log.details}</span>
                        </div>
                      )}
                    </div>
                    {log.status === 'failed' && (
                      <Button size="sm" variant="outline" className="mt-3">
                        <ExternalLink className="mr-2 h-3 w-3" />
                        查看完整错误
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
