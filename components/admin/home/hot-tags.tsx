'use client'

import { Hash, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const hotTags = [
  { name: '数字人民币', count: 234, trend: 'up', change: 45 },
  { name: '跨境支付', count: 189, trend: 'up', change: 32 },
  { name: 'CBDC', count: 156, trend: 'up', change: 28 },
  { name: '移动支付', count: 134, trend: 'stable', change: 0 },
  { name: '聚合支付', count: 98, trend: 'down', change: 12 },
  { name: '数字钱包', count: 87, trend: 'up', change: 15 },
  { name: '支付牌照', count: 76, trend: 'up', change: 8 },
  { name: '收单业务', count: 65, trend: 'stable', change: 0 },
  { name: '反洗钱', count: 54, trend: 'up', change: 22 },
  { name: '开放银行', count: 43, trend: 'down', change: 5 },
]

function getTrendIcon(trend: string) {
  if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />
  if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />
  return <Minus className="h-3 w-3 text-muted-foreground" />
}

function getTrendColor(trend: string) {
  if (trend === 'up') return 'text-green-500'
  if (trend === 'down') return 'text-red-500'
  return 'text-muted-foreground'
}

export function HotTags() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Hash className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">热门标签</h3>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {hotTags.map((tag, index) => (
            <button
              key={tag.name}
              className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <span className="text-xs font-medium text-muted-foreground">
                #{index + 1}
              </span>
              <span className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                {tag.name}
              </span>
              <span className="text-xs text-muted-foreground">{tag.count}</span>
              <div className="flex items-center gap-0.5">
                {getTrendIcon(tag.trend)}
                {tag.change > 0 && (
                  <span className={`text-xs ${getTrendColor(tag.trend)}`}>
                    {tag.trend === 'up' ? '+' : '-'}{tag.change}%
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
