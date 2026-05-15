'use client'

import { Sparkles, TrendingUp, AlertTriangle, Clock } from 'lucide-react'

export function TodaySummary() {
  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">今日摘要</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              AI 生成
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            今日支付行业动态活跃，共抓取 <span className="font-semibold text-foreground">1,284</span> 条资讯。
            <span className="font-semibold text-primary">央行数字货币</span>相关报道持续升温，
            <span className="font-semibold text-primary">跨境支付</span>领域出现多项政策利好。
            值得关注的是，<span className="font-semibold text-primary">Visa</span> 宣布新一轮亚太市场战略布局，
            预计将对区域支付格局产生深远影响。
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span>热度上升 <span className="font-medium text-foreground">23%</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>重要事件 <span className="font-medium text-foreground">5</span> 条</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>更新于 10 分钟前</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
