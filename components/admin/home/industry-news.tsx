'use client'

import { Zap, Clock, ArrowRight } from 'lucide-react'

const industryNews = [
  {
    time: '10:32',
    title: '银联国际与泰国央行签署跨境支付合作备忘录',
    category: '跨境支付',
  },
  {
    time: '10:15',
    title: '拉卡拉：第三季度净利润同比增长 18.5%',
    category: '财报',
  },
  {
    time: '09:48',
    title: '香港金管局：虚拟银行存款总额突破 500 亿港元',
    category: '市场数据',
  },
  {
    time: '09:22',
    title: '万事达卡推出新一代生物识别支付解决方案',
    category: '技术创新',
  },
  {
    time: '09:05',
    title: '日本央行：将继续推进数字日元研发工作',
    category: 'CBDC',
  },
  {
    time: '08:45',
    title: '美联储官员：即时支付系统 FedNow 用户数突破 800 家',
    category: '即时支付',
  },
  {
    time: '08:30',
    title: '韩国金融委员会：加强第三方支付机构监管',
    category: '政策监管',
  },
  {
    time: '08:12',
    title: 'Stripe 完成新一轮融资，估值达 650 亿美元',
    category: '融资动态',
  },
]

export function IndustryNews() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-card-foreground">行业快讯</h3>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
          <span>更多快讯</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="divide-y divide-border">
        {industryNews.map((news, index) => (
          <div
            key={index}
            className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-0.5">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{news.time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                {news.title}
              </p>
            </div>
            <span className="flex-shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              {news.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
