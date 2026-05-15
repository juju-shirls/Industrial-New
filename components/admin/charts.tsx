'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

const crawlData = [
  { time: '00:00', count: 45 },
  { time: '04:00', count: 32 },
  { time: '08:00', count: 78 },
  { time: '12:00', count: 156 },
  { time: '16:00', count: 189 },
  { time: '20:00', count: 134 },
  { time: '24:00', count: 67 },
]

const categoryData = [
  { name: '支付终端', count: 45 },
  { name: '支付网关', count: 38 },
  { name: '支付SaaS', count: 52 },
  { name: '支付AI', count: 28 },
  { name: 'Crypto', count: 35 },
  { name: '监管合规', count: 22 },
  { name: '跨境支付', count: 41 },
]

export function CrawlTrendChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-card-foreground">抓取趋势</h3>
        <p className="text-xs text-muted-foreground">今日各时段抓取数量</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={crawlData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.72 0.19 160)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.72 0.19 160)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 260)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="oklch(0.60 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.60 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.14 0.01 260)',
                border: '1px solid oklch(0.24 0.01 260)',
                borderRadius: '8px',
                color: 'oklch(0.95 0 0)',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="oklch(0.72 0.19 160)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function CategoryChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-card-foreground">分类统计</h3>
        <p className="text-xs text-muted-foreground">各分类资讯数量</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 260)" horizontal={false} />
            <XAxis
              type="number"
              stroke="oklch(0.60 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="oklch(0.60 0 0)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.14 0.01 260)',
                border: '1px solid oklch(0.24 0.01 260)',
                borderRadius: '8px',
                color: 'oklch(0.95 0 0)',
              }}
            />
            <Bar
              dataKey="count"
              fill="oklch(0.72 0.19 160)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
