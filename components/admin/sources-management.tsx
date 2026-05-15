'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useSourcesStore } from '@/lib/stores/sources-store'
import { useApi } from '@/hooks/use-api'
import { toast } from 'sonner'
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  RefreshCw,
  Rss,
  Globe,
  Search,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
} from 'lucide-react'
import type { CreateNewsSourceForm } from '@/lib/types'

export function SourcesManagement() {
  const {
    sources,
    loading,
    error,
    setSources,
    addSource,
    updateSourceStatus,
    triggerCrawl,
    triggerAllCrawl,
    createSource
  } = useSourcesStore()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedSourceId, setSelectedSourceId] = useState<string>('')
  
  const [formData, setFormData] = useState<CreateNewsSourceForm>({
    name: '',
    type: 'rss',
    url: '',
    enabled: true,
    crawl_interval_minutes: 60
  })

  const fetchSources = useApi({
    showErrorToast: true,
  })

  useEffect(() => {
    loadSources()
  }, [])

  const loadSources = async () => {
    try {
      const response = await fetchSources.execute(fetch('/api/sources'))
      if (response && Array.isArray(response)) {
        setSources(response)
      }
    } catch (error) {
      console.error('Failed to load sources:', error)
    }
  }

  const handleCreateSource = async () => {
    if (!formData.name || !formData.url) {
      toast.error('请填写必填字段')
      return
    }

    try {
      await createSource(formData)
      toast.success('新闻源创建成功')
      setShowCreateDialog(false)
      setFormData({
        name: '',
        type: 'rss',
        url: '',
        enabled: true,
        crawl_interval_minutes: 60
      })
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const handleToggleSource = async (id: string, enabled: boolean) => {
    try {
      await updateSourceStatus(id, enabled)
      toast.success(enabled ? '新闻源已启用' : '新闻源已禁用')
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const handleTriggerCrawl = async (id: string) => {
    try {
      await triggerCrawl(id)
      toast.success('抓取任务已启动')
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const handleTriggerAllCrawl = async () => {
    try {
      await triggerAllCrawl()
      toast.success('全部抓取任务已启动')
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'rss':
        return Rss
      case 'website':
        return Globe
      case 'search':
        return Search
      case 'api':
        return Database
      default:
        return Globe
    }
  }

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case 'rss':
        return 'RSS 订阅'
      case 'website':
        return '网站抓取'
      case 'search':
        return '搜索引擎'
      case 'api':
        return 'API 接口'
      default:
        return '未知类型'
    }
  }

  const getStatusColor = (enabled: boolean, lastCrawled?: string) => {
    if (!enabled) return 'text-gray-500'
    
    if (!lastCrawled) return 'text-yellow-500'
    
    const lastCrawledDate = new Date(lastCrawled)
    const now = new Date()
    const diffHours = (now.getTime() - lastCrawledDate.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 2) return 'text-green-500'
    if (diffHours < 24) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getStatusIcon = (enabled: boolean, lastCrawled?: string) => {
    if (!enabled) return XCircle
    
    if (!lastCrawled) return AlertTriangle
    
    const lastCrawledDate = new Date(lastCrawled)
    const now = new Date()
    const diffHours = (now.getTime() - lastCrawledDate.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 2) return CheckCircle
    if (diffHours < 24) return AlertTriangle
    return XCircle
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">新闻源管理</h3>
          <p className="text-sm text-muted-foreground">
            管理和配置支付行业资讯来源
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={loadSources} disabled={loading} variant="outline">
            <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
            刷新
          </Button>
          
          <Button onClick={handleTriggerAllCrawl} disabled={loading}>
            <Play className="mr-2 h-4 w-4" />
            全部抓取
          </Button>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加新闻源
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新闻源</DialogTitle>
                <DialogDescription>
                  配置一个新的支付行业资讯来源
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">名称 *</Label>
                  <Input
                    id="name"
                    placeholder="例如：Finextra 支付新闻"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">类型</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rss">RSS 订阅</SelectItem>
                      <SelectItem value="website">网站抓取</SelectItem>
                      <SelectItem value="search">搜索引擎</SelectItem>
                      <SelectItem value="api">API 接口</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/rss"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interval">抓取间隔 (分钟)</Label>
                  <Input
                    id="interval"
                    type="number"
                    min="5"
                    max="1440"
                    value={formData.crawl_interval_minutes}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      crawl_interval_minutes: parseInt(e.target.value) || 60 
                    })}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                  />
                  <Label htmlFor="enabled">启用此新闻源</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateSource} disabled={loading}>
                  创建
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sources Grid */}
      {loading && sources.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              正在加载新闻源...
            </div>
          </CardContent>
        </Card>
      ) : sources.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">
              <Rss className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">暂无新闻源</h3>
              <p className="text-sm">点击"添加新闻源"开始配置第一个资讯来源</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((source) => {
            const TypeIcon = getSourceTypeIcon(source.type)
            const StatusIcon = getStatusIcon(source.enabled, source.last_crawled_at)
            const statusColor = getStatusColor(source.enabled, source.last_crawled_at)
            
            return (
              <Card key={source.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <TypeIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-1">
                          {source.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getSourceTypeLabel(source.type)}
                          </Badge>
                          <StatusIcon className={cn("h-3 w-3", statusColor)} />
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">URL</p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded text-xs truncate">
                      {source.url}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground mb-1">抓取间隔</p>
                      <p className="font-medium">{source.crawl_interval_minutes} 分钟</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">最近抓取</p>
                      <p className="font-medium">
                        {source.last_crawled_at
                          ? new Date(source.last_crawled_at).toLocaleString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '从未'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={source.enabled}
                        onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                        size="sm"
                      />
                      <span className="text-xs text-muted-foreground">
                        {source.enabled ? '已启用' : '已禁用'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTriggerCrawl(source.id)}
                        disabled={!source.enabled || loading}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        抓取
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}