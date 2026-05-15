'use client'

import { Trophy, Clock, ExternalLink, Flame, TrendingUp } from 'lucide-react'

const mainNews = [
  {
    rank: 1,
    title: '央行：数字人民币试点范围将进一步扩大至更多城市',
    source: '中国人民银行',
    time: '2 小时前',
    heat: 9823,
    isHot: true,
    category: '政策监管',
  },
  {
    rank: 2,
    title: 'Visa 宣布 2024 亚太战略：重点布局东南亚数字支付市场',
    source: 'Visa 官方',
    time: '3 小时前',
    heat: 8456,
    isHot: true,
    category: '行业动态',
  },
  {
    rank: 3,
    title: '支付宝国际版与新加坡 GrabPay 达成战略合作',
    source: '蚂蚁集团',
    time: '4 小时前',
    heat: 7234,
    isHot: false,
    category: '企业新闻',
  },
  {
    rank: 4,
    title: '欧盟新规：跨境支付手续费上限将进一步下调',
    source: '欧盟委员会',
    time: '5 小时前',
    heat: 6890,
    isHot: false,
    category: '政策监管',
  },
  {
    rank: 5,
    title: 'PayPal 第三季度财报超预期，数字钱包用户突破 4.5 亿',
    source: 'PayPal',
    time: '6 小时前',
    heat: 5678,
    isHot: false,
    category: '财报分析',
  },
  {
    rank: 6,
    title: '微信支付推出商户分账 2.0，支持更灵活的资金结算方案',
    source: '腾讯金融',
    time: '7 小时前',
    heat: 4532,
    isHot: false,
    category: '产品更新',
  },
  {
    rank: 7,
    title: '印度 UPI 交易量再创新高，单月突破 100 亿笔',
    source: 'NPCI',
    time: '8 小时前',
    heat: 3987,
    isHot: false,
    category: '市场数据',
  },
]

function getRankStyle(rank: number) {
  if (rank === 1) return 'bg-amber-500 text-white'
  if (rank === 2) return 'bg-slate-400 text-white'
  if (rank === 3) return 'bg-amber-700 text-white'
  return 'bg-muted text-muted-foreground'
}

export function MainNewsList() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-card-foreground">今日重点新闻</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            主榜单
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
          <span>查看全部</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
      <div className="divide-y divide-border">
        {mainNews.map((news) => (
          <div
            key={news.rank}
            className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer group"
          >
            <div
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold ${getRankStyle(news.rank)}`}
            >
              {news.rank}
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-start gap-2">
                <h4 className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {news.title}
                </h4>
                {news.isHot && (
                  <Flame className="h-4 w-4 flex-shrink-0 text-orange-500" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded bg-muted px-1.5 py-0.5">{news.category}</span>
                <span>{news.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {news.time}
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <TrendingUp className="h-3 w-3" />
                  {news.heat.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
