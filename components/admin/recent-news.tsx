import { cn } from '@/lib/utils'
import { ExternalLink, Clock, Tag, AlertTriangle, Star } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  source: string
  category: string
  publishedAt: string
  isHighPriority?: boolean
  aiSummary?: string
}

const recentNews: NewsItem[] = [
  {
    id: '1',
    title: 'Visa 宣布推出新一代支付网关解决方案',
    source: 'TechCrunch',
    category: '支付网关',
    publishedAt: '10 分钟前',
    isHighPriority: true,
    aiSummary: 'Visa 推出新一代支付网关，支持实时交易处理和增强的安全功能...',
  },
  {
    id: '2',
    title: 'Square 推出面向中小企业的 AI 财务助手',
    source: 'Bloomberg',
    category: '支付 AI 科技',
    publishedAt: '25 分钟前',
    isHighPriority: true,
  },
  {
    id: '3',
    title: '央行发布跨境支付新规征求意见稿',
    source: '财经网',
    category: '支付监管与合规',
    publishedAt: '1 小时前',
    isHighPriority: false,
  },
  {
    id: '4',
    title: 'Stripe 完成新一轮融资，估值达 700 亿美元',
    source: 'Reuters',
    category: '支付 SaaS / ISV',
    publishedAt: '2 小时前',
    isHighPriority: false,
  },
  {
    id: '5',
    title: 'PayPal 将支持 USDC 稳定币支付',
    source: 'CoinDesk',
    category: 'Crypto / 稳定币',
    publishedAt: '3 小时前',
    isHighPriority: true,
  },
]

export function RecentNewsList() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h3 className="text-sm font-medium text-card-foreground">最新资讯</h3>
          <p className="text-xs text-muted-foreground">实时更新的支付行业动态</p>
        </div>
        <a
          href="/news"
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
        >
          查看全部
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="divide-y divide-border">
        {recentNews.map((news) => (
          <div
            key={news.id}
            className="group flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {news.isHighPriority && (
                  <Star className="h-3.5 w-3.5 text-[oklch(0.80_0.16_80)] fill-[oklch(0.80_0.16_80)]" />
                )}
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {news.source}
                </span>
              </div>
              <h4 className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                {news.title}
              </h4>
              {news.aiSummary && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {news.aiSummary}
                </p>
              )}
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <Tag className="h-3 w-3" />
                  {news.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {news.publishedAt}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info'
  message: string
  time: string
}

const systemAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'error',
    message: 'Reuters 抓取失败：连接超时',
    time: '5 分钟前',
  },
  {
    id: '2',
    type: 'warning',
    message: 'AI 摘要生成队列积压',
    time: '15 分钟前',
  },
  {
    id: '3',
    type: 'info',
    message: '飞书推送已完成 12 条消息',
    time: '30 分钟前',
  },
]

export function SystemAlerts() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h3 className="text-sm font-medium text-card-foreground">系统告警</h3>
        <p className="text-xs text-muted-foreground">近期系统状态通知</p>
      </div>
      <div className="divide-y divide-border">
        {systemAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-4">
            <div
              className={cn(
                'mt-0.5 flex h-6 w-6 items-center justify-center rounded-full',
                alert.type === 'error' && 'bg-destructive/10',
                alert.type === 'warning' && 'bg-[oklch(0.80_0.16_80)]/10',
                alert.type === 'info' && 'bg-[oklch(0.65_0.18_250)]/10'
              )}
            >
              <AlertTriangle
                className={cn(
                  'h-3.5 w-3.5',
                  alert.type === 'error' && 'text-destructive',
                  alert.type === 'warning' && 'text-[oklch(0.80_0.16_80)]',
                  alert.type === 'info' && 'text-[oklch(0.65_0.18_250)]'
                )}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-card-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
