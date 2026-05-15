'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Tag,
  FolderOpen,
  Sparkles,
  GripVertical,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  articleCount: number
  aiPrompt: string
  tags: string[]
}

const categories: Category[] = [
  {
    id: '1',
    name: '支付终端',
    description: 'POS 机、智能终端、收银设备等硬件相关资讯',
    articleCount: 156,
    aiPrompt: '识别与支付终端、POS设备、收银机相关的新闻...',
    tags: ['POS', '智能终端', '收银机', '硬件'],
  },
  {
    id: '2',
    name: '支付网关',
    description: '在线支付网关、API 接口、支付通道等相关资讯',
    articleCount: 234,
    aiPrompt: '识别与支付网关、支付接口、支付通道相关的新闻...',
    tags: ['API', '网关', '通道', '接口'],
  },
  {
    id: '3',
    name: '支付 SaaS / ISV',
    description: '支付 SaaS 平台、ISV 服务商、软件解决方案',
    articleCount: 189,
    aiPrompt: '识别与支付 SaaS 平台、ISV 服务商相关的新闻...',
    tags: ['SaaS', 'ISV', 'Stripe', 'Square'],
  },
  {
    id: '4',
    name: '支付 AI 科技',
    description: 'AI 风控、智能客服、机器学习在支付领域的应用',
    articleCount: 98,
    aiPrompt: '识别与 AI 在支付领域应用相关的新闻...',
    tags: ['AI', '风控', '机器学习', '智能'],
  },
  {
    id: '5',
    name: 'Crypto / 稳定币',
    description: '加密货币支付、稳定币、区块链支付相关资讯',
    articleCount: 312,
    aiPrompt: '识别与加密货币、稳定币、区块链支付相关的新闻...',
    tags: ['Crypto', 'USDC', 'USDT', '区块链'],
  },
  {
    id: '6',
    name: '支付监管与合规',
    description: '支付牌照、监管政策、合规要求等相关资讯',
    articleCount: 145,
    aiPrompt: '识别与支付监管、政策法规、合规要求相关的新闻...',
    tags: ['监管', '合规', '牌照', '政策'],
  },
  {
    id: '7',
    name: '跨境支付',
    description: '跨境汇款、国际支付、外汇结算等相关资讯',
    articleCount: 178,
    aiPrompt: '识别与跨境支付、国际汇款、外汇相关的新闻...',
    tags: ['跨境', '外汇', '国际', 'SWIFT'],
  },
]

export function CategoriesManager() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('1')
  const [newTag, setNewTag] = useState('')

  const currentCategory = categories.find((c) => c.id === selectedCategory)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Categories List */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-medium text-card-foreground">分类列表</h3>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'flex w-full items-center justify-between p-4 text-left transition-colors',
                  selectedCategory === category.id
                    ? 'bg-primary/5 border-l-2 border-l-primary'
                    : 'hover:bg-muted/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {category.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.articleCount} 篇
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform',
                    selectedCategory === category.id && 'rotate-90'
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Detail */}
      <div className="lg:col-span-2 space-y-4">
        {currentCategory && (
          <>
            {/* Basic Info */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">
                      {currentCategory.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentCategory.articleCount} 篇资讯
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    分类描述
                  </label>
                  <p className="mt-1 text-sm text-card-foreground">
                    {currentCategory.description}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Prompt */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-card-foreground">AI 分类提示词</h4>
              </div>
              <textarea
                defaultValue={currentCategory.aiPrompt}
                className="w-full h-24 rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="设置 AI 分类提示词..."
              />
              <p className="mt-2 text-xs text-muted-foreground">
                AI 将根据此提示词自动将相关新闻归类到此分类
              </p>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-card-foreground">关联标签</h4>
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentCategory.tags.length} 个标签
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {currentCategory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="group inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    {tag}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="添加新标签..."
                  className="flex-1 h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  添加
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
