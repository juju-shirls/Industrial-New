'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDashboardStore } from '@/lib/stores/dashboard-store'
import { useApi } from '@/hooks/use-api'
import { cn } from '@/lib/utils'
import {
  Download,
  Newspaper,
  Brain,
  Send,
  AlertCircle,
  Star,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  description?: string
  icon: React.ComponentType<{ className?: string }>
  loading?: boolean
}

function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  description, 
  icon: Icon,
  loading = false 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />
      case 'negative':
        return <TrendingDown className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          ) : (
            value
          )}
        </div>
        {change && !loading && (
          <div className={cn("flex items-center text-xs", getChangeColor())}>
            {getChangeIcon()}
            <span className="ml-1">{change}</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

interface RecentJobsProps {
  title: string
  jobs: Array<{
    id: string
    status: 'running' | 'success' | 'failed'
    started_at: string
    finished_at?: string
    source_name?: string
    job_type?: string
    error_message?: string
  }>
  loading?: boolean
}

function RecentJobs({ title, jobs, loading }: RecentJobsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return '成功'
      case 'failed':
        return '失败'
      case 'running':
        return '运行中'
      default:
        return '等待中'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-4 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            暂无最近任务
          </p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 text-sm">
                {getStatusIcon(job.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {job.source_name || job.job_type || '任务'}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getStatusLabel(job.status)}
                    </Badge>
                  </div>
                  {job.error_message && (
                    <p className="text-xs text-red-600 truncate mt-1">
                      {job.error_message}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(job.started_at).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface SystemHealthProps {
  loading?: boolean
}

function SystemHealth({ loading }: SystemHealthProps) {
  const healthItems = [
    { name: '数据库连接', status: 'healthy', message: '正常' },
    { name: 'AI 服务', status: 'healthy', message: 'OpenAI 可用' },
    { name: '飞书推送', status: 'healthy', message: '连接正常' },
    { name: '任务队列', status: 'warning', message: '队列积压 12 个' },
  ]

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">系统健康</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-4 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 h-4 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {healthItems.map((item) => (
              <div key={item.name} className="flex items-center gap-3 text-sm">
                {getHealthIcon(item.status)}
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <p className="text-xs text-muted-foreground">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function EnhancedDashboard() {
  const {
    stats,
    recentJobs,
    aiJobs,
    loading,
    error,
    lastRefresh,
    refreshDashboard,
    setError
  } = useDashboardStore()

  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    // Initial load
    refreshDashboard()

    // Set up auto-refresh
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshDashboard()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshDashboard])

  const handleManualRefresh = () => {
    refreshDashboard()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">数据概览</h2>
          <p className="text-muted-foreground">
            {lastRefresh && (
              <>最后更新: {lastRefresh.toLocaleString('zh-CN')}</>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className={cn("mr-2 h-4 w-4", autoRefresh && "text-green-500")} />
            {autoRefresh ? '自动刷新' : '手动模式'}
          </Button>
          
          <Button onClick={handleManualRefresh} disabled={loading} size="sm">
            <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
            刷新
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="今日抓取"
          value={stats?.todayCrawled || 0}
          change="+12.5%"
          changeType="positive"
          description="较昨日"
          icon={Download}
          loading={loading && !stats}
        />
        <StatsCard
          title="今日新增"
          value={stats?.todayCreated || 0}
          change="+8.2%"
          changeType="positive"
          description="较昨日"
          icon={Newspaper}
          loading={loading && !stats}
        />
        <StatsCard
          title="AI 成功率"
          value={stats ? `${(stats.aiSuccessRate * 100).toFixed(1)}%` : '0%'}
          change="+0.3%"
          changeType="positive"
          description="较昨日"
          icon={Brain}
          loading={loading && !stats}
        />
        <StatsCard
          title="飞书推送"
          value={stats ? (stats.pushSuccessRate === 1 ? '正常' : '异常') : '未知'}
          description="最近推送 5 分钟前"
          icon={Send}
          loading={loading && !stats}
        />
        <StatsCard
          title="抓取失败"
          value={stats?.failedJobs || 0}
          change="-2"
          changeType="positive"
          description="较昨日"
          icon={AlertCircle}
          loading={loading && !stats}
        />
        <StatsCard
          title="高优先级"
          value={stats?.highImportanceArticles || 0}
          change="+4"
          changeType="neutral"
          description="待处理"
          icon={Star}
          loading={loading && !stats}
        />
      </div>

      {/* Charts Row - Placeholder for now */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              抓取趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">图表组件开发中...</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              分类分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">图表组件开发中...</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentJobs
          title="最近抓取任务"
          jobs={recentJobs}
          loading={loading && recentJobs.length === 0}
        />
        
        <RecentJobs
          title="最近 AI 任务"
          jobs={aiJobs}
          loading={loading && aiJobs.length === 0}
        />
        
        <SystemHealth loading={loading} />
      </div>
    </div>
  )
}