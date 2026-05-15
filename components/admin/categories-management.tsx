'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCategoriesStore } from '@/lib/stores/categories-store'
import { useApi } from '@/hooks/use-api'
import { toast } from 'sonner'
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Tags,
  FolderOpen,
  Hash,
  GripVertical,
  AlertTriangle,
} from 'lucide-react'
import type { CreateCategoryForm, CreateTagForm } from '@/lib/types'

export function CategoriesManagement() {
  const {
    categories,
    tags,
    loading,
    error,
    setCategories,
    setTags,
    createCategory,
    createTag,
    updateCategoryStatus,
    setError
  } = useCategoriesStore()

  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false)
  const [showCreateTagDialog, setShowCreateTagDialog] = useState(false)
  
  const [categoryForm, setCategoryForm] = useState<CreateCategoryForm>({
    name: '',
    slug: '',
    description: '',
    sort_order: 1,
    enabled: true
  })

  const [tagForm, setTagForm] = useState<CreateTagForm>({
    name: '',
    slug: '',
    description: ''
  })

  const fetchData = useApi({ showErrorToast: true })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Fetch categories and tags in parallel
      const [categoriesResponse, tagsResponse] = await Promise.all([
        fetchData.execute(fetch('/api/categories')),
        fetchData.execute(fetch('/api/tags'))
      ])

      if (categoriesResponse && Array.isArray(categoriesResponse)) {
        setCategories(categoriesResponse)
      }
      
      if (tagsResponse && Array.isArray(tagsResponse)) {
        setTags(tagsResponse)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[\s+]/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleCategoryNameChange = (name: string) => {
    setCategoryForm({
      ...categoryForm,
      name,
      slug: generateSlug(name)
    })
  }

  const handleTagNameChange = (name: string) => {
    setTagForm({
      ...tagForm,
      name,
      slug: generateSlug(name)
    })
  }

  const handleCreateCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error('请填写必填字段')
      return
    }

    try {
      await createCategory(categoryForm)
      toast.success('分类创建成功')
      setShowCreateCategoryDialog(false)
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        sort_order: categories.length + 1,
        enabled: true
      })
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const handleCreateTag = async () => {
    if (!tagForm.name || !tagForm.slug) {
      toast.error('请填写必填字段')
      return
    }

    try {
      await createTag(tagForm)
      toast.success('标签创建成功')
      setShowCreateTagDialog(false)
      setTagForm({
        name: '',
        slug: '',
        description: ''
      })
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const handleToggleCategory = async (id: string, enabled: boolean) => {
    try {
      await updateCategoryStatus(id, enabled)
      toast.success(enabled ? '分类已启用' : '分类已禁用')
    } catch (error) {
      // Error is already handled in the store
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">分类标签管理</h3>
          <p className="text-sm text-muted-foreground">
            管理支付行业资讯的分类和标签体系
          </p>
        </div>
        
        <Button onClick={loadData} disabled={loading} variant="outline">
          <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          刷新
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
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

      {/* Tabs */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            分类管理
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            标签管理
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              共 {categories.length} 个分类，其中 {categories.filter(c => c.enabled).length} 个已启用
            </p>
            
            <Dialog open={showCreateCategoryDialog} onOpenChange={setShowCreateCategoryDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加分类
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加分类</DialogTitle>
                  <DialogDescription>
                    创建一个新的支付行业资讯分类
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">分类名称 *</Label>
                    <Input
                      id="category-name"
                      placeholder="例如：支付终端"
                      value={categoryForm.name}
                      onChange={(e) => handleCategoryNameChange(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-slug">URL 标识 *</Label>
                    <Input
                      id="category-slug"
                      placeholder="payment-terminal"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-description">描述</Label>
                    <Textarea
                      id="category-description"
                      placeholder="分类描述..."
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-order">排序序号</Label>
                    <Input
                      id="category-order"
                      type="number"
                      min="1"
                      value={categoryForm.sort_order}
                      onChange={(e) => setCategoryForm({ 
                        ...categoryForm, 
                        sort_order: parseInt(e.target.value) || 1 
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="category-enabled"
                      checked={categoryForm.enabled}
                      onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, enabled: checked })}
                    />
                    <Label htmlFor="category-enabled">启用此分类</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateCategoryDialog(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreateCategory} disabled={loading}>
                    创建
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Categories List */}
          {loading && categories.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  正在加载分类...
                </div>
              </CardContent>
            </Card>
          ) : categories.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-muted-foreground">
                  <FolderOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">暂无分类</h3>
                  <p className="text-sm">点击"添加分类"创建第一个资讯分类</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {categories
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((category) => (
                <Card key={category.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{category.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {category.slug}
                          </Badge>
                          {!category.enabled && (
                            <Badge variant="secondary" className="text-xs">
                              已禁用
                            </Badge>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {category.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          排序: {category.sort_order}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={category.enabled}
                        onCheckedChange={(checked) => handleToggleCategory(category.id, checked)}
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              共 {tags.length} 个标签
            </p>
            
            <Dialog open={showCreateTagDialog} onOpenChange={setShowCreateTagDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加标签
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加标签</DialogTitle>
                  <DialogDescription>
                    创建一个新的资讯标签
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag-name">标签名称 *</Label>
                    <Input
                      id="tag-name"
                      placeholder="例如：POS"
                      value={tagForm.name}
                      onChange={(e) => handleTagNameChange(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tag-slug">URL 标识 *</Label>
                    <Input
                      id="tag-slug"
                      placeholder="pos"
                      value={tagForm.slug}
                      onChange={(e) => setTagForm({ ...tagForm, slug: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tag-description">描述</Label>
                    <Textarea
                      id="tag-description"
                      placeholder="标签描述..."
                      value={tagForm.description}
                      onChange={(e) => setTagForm({ ...tagForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateTagDialog(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreateTag} disabled={loading}>
                    创建
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tags Grid */}
          {loading && tags.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  正在加载标签...
                </div>
              </CardContent>
            </Card>
          ) : tags.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-muted-foreground">
                  <Tags className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">暂无标签</h3>
                  <p className="text-sm">点击"添加标签"创建第一个资讯标签</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tag) => (
                <Card key={tag.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{tag.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {tag.slug}
                        </Badge>
                      </div>
                      {tag.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {tag.description}
                        </p>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}