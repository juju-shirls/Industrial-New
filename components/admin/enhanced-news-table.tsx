'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useNewsStore } from '@/lib/stores/news-store'
import { useCategoriesStore } from '@/lib/stores/categories-store'
import { useFeishuStore } from '@/lib/stores/feishu-store'
import { useApi } from '@/hooks/use-api'
import { toast } from 'sonner'
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
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

export function EnhancedNewsTable() {
  const {
    articles,
    selectedArticles,
    totalCount,
    loading,
    error,
    currentPage,
    pageSize,
    filters,
    searchQuery,
    setArticles,
    selectArticle,
    selectAllArticles,
    clearSelection,
    setFilters,
    setSearchQuery,
    setPage,
    publishArticles,
    unpublishArticles,
    deleteArticles,
    pushToFeishu,
    setLoading,
    setError
  } = useNewsStore()

  const { categories, getEnabledCategories } = useCategoriesStore()
  const { webhooks, getEnabledWebhooks } = useFeishuStore()
  
  const [selectedWebhook, setSelectedWebhook] = useState<string>('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBulkPushDialog, setShowBulkPushDialog] = useState(false)

  const fetchArticles = useApi({
    showErrorToast: true,
  })

  // Fetch articles when filters, search, or page changes
  useEffect(() => {
    fetchArticles()
  }, [filters, searchQuery, currentPage, pageSize, fetchArticles])

  const handleBulkPublish = async () => {
    if (selectedArticles.length === 0) return
    
    try {
      await publishArticles(selectedArticles)
      toast.success(`已发布 ${selectedArticles.length} 篇文章`)
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const handleBulkUnpublish = async () => {
    if (selectedArticles.length === 0) return
    
    try {
      await unpublishArticles(selectedArticles)
      toast.success(`已下架 ${selectedArticles.length} 篇文章`)
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) return
    
    try {
      await deleteArticles(selectedArticles)
      toast.success(`已删除 ${selectedArticles.length} 篇文章`)
      setShowDeleteDialog(false)
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const handleBulkPush = async () => {
    if (selectedArticles.length === 0 || !selectedWebhook) return
    
    try {
      await pushToFeishu(selectedArticles, selectedWebhook)
      toast.success(`已推送 ${selectedArticles.length} 篇文章到飞书`)
      setShowBulkPushDialog(false)
      setSelectedWebhook('')
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const handleRegenerateAI = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/regenerate-summary`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to regenerate AI summary')
      }
        
        toast.success('AI 摘要重新生成中...')
        // Refresh the article data
        fetchArticles()
    } catch (error) {
      toast.error('重新生成 AI 摘要失败')
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-200'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
      case 'low':
        return 'bg-gray-500/10 text-gray-600 border-gray-200'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-600'
      case 'draft':
        return 'bg-gray-500/10 text-gray-600'
      case 'archived':
        return 'bg-orange-500/10 text-orange-600'
      default:
        return 'bg-gray-500/10 text-gray-600'
    }
  }

  const enabledCategories = getEnabledCategories()
  const enabledWebhooks = getEnabledWebhooks()

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          {/* Search and Filters */}
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
              
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) => 
                  setFilters({ category: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {enabledCategories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => 
                  setFilters({ status: value === 'all' ? undefined : value as any })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.importance || 'all'}
                onValueChange={(value) => 
                  setFilters({ importance: value === 'all' ? undefined : value as any })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="重要性" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={fetchArticles} disabled={loading} size="sm">
              <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
              刷新
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedArticles.length > 0 && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                已选择 {selectedArticles.length} 篇文章
              </span>
              
              <div className="flex items-center gap-2">
                <Button onClick={handleBulkPublish} size="sm" variant="outline">
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  批量发布
                </Button>
                
                <Button onClick={handleBulkUnpublish} size="sm" variant="outline">
                  <EyeOff className="mr-2 h-3.5 w-3.5" />
                  批量下架
                </Button>
                
                <Dialog open={showBulkPushDialog} onOpenChange={setShowBulkPushDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Send className="mr-2 h-3.5 w-3.5" />
                      批量推送
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>推送到飞书</DialogTitle>
                      <DialogDescription>
                        选择要推送到的飞书群，将推送 {selectedArticles.length} 篇文章。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Select value={selectedWebhook} onValueChange={setSelectedWebhook}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择飞书群" />
                        </SelectTrigger>
                        <SelectContent>
                          {enabledWebhooks.map((webhook) => (
                            <SelectItem key={webhook.id} value={webhook.id}>
                              {webhook.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowBulkPushDialog(false)}>
                        取消
                      </Button>
                      <Button 
                        onClick={handleBulkPush} 
                        disabled={!selectedWebhook || loading}
                      >
                        推送
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      批量删除
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>确认删除</DialogTitle>
                      <DialogDescription>
                        确定要删除这 {selectedArticles.length} 篇文章吗？此操作不可撤销。
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        取消
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleBulkDelete}
                        disabled={loading}
                      >
                        删除
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </Card>
      )}

      {/* Articles Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left w-12">
                  <Checkbox
                    checked={selectedArticles.length === articles.length && articles.length > 0}
                    onCheckedChange={selectAllArticles}
                  />
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
              {loading && articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      正在加载...
                    </div>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    暂无数据
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    key={article.id}
                    className="group hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedArticles.includes(article.id)}
                        onCheckedChange={() => selectArticle(article.id)}
                      />
                    </td>
                    <td className="px-4 py-4 max-w-md">
                      <div className="flex items-start gap-2">
                        {article.importance === 'high' && (
                          <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning fill-warning" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-card-foreground line-clamp-2 mb-1">
                            {article.title}
                          </h4>
                          {article.ai_summary && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {article.ai_summary.summary}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            <Badge
                              variant="outline"
                              className={cn("text-xs", getImportanceColor(article.importance))}
                            >
                              {article.importance === 'high' ? '高' : 
                               article.importance === 'medium' ? '中' : '低'}
                            </Badge>
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                            {article.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{article.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {article.categories.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {article.categories[0].name}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {article.source_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(article.published_at).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", getStatusColor(article.status))}
                      >
                        {article.status === 'published' ? '已发布' :
                         article.status === 'draft' ? '草稿' : '已归档'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleRegenerateAI(article.id)}
                          title="重新生成 AI 摘要"
                        >
                          <Sparkles className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => window.open(article.original_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              显示 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)} 条，共 {totalCount} 条
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(totalCount / pageSize)) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(page)}
                      className="w-8"
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalCount / pageSize)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}