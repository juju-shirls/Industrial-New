'use client'

import { Calendar, TrendingUp, Users, Globe, Zap, Clock, ExternalLink, Star, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import { Progress } from '@/components/ui/progress'

// Mock data for sidebar
const todayStats = {
  totalNews: 248,
  totalHeat: '2.4M',
  activeUsers: '12.8K',
  sources: 156
}

const quickUpdates = [
  {
    id: '1',
    time: '刚刚',
    content: 'Visa发布Q3财报，营收增长7%',
    category: '财报',
    priority: 'high'
  },
  {
    id: '2', 
    time: '5分钟前',
    content: '央行数字货币试点城市新增3个',
    category: '政策',
    priority: 'high'
  },
  {
    id: '3',
    time: '12分钟前',
    content: 'PayPal推出加密货币结算服务',
    category: '产品',
    priority: 'medium'
  },
  {
    id: '4',
    time: '25分钟前',
    content: '欧盟通过新支付监管法案',
    category: '监管',
    priority: 'high'
  },
  {
    id: '5',
    time: '1小时前',
    content: 'Square智能POS销量突破100万台',
    category: '市场',
    priority: 'medium'
  }
]

const topSources = [
  {
    name: '央行官网',
    count: 23,
    growth: '+15%',
    verified: true,
    category: 'official'
  },
  {
    name: 'Visa官方',
    count: 18,
    growth: '+8%',
    verified: true,
    category: 'official'
  },
  {
    name: 'PaymentJournal',
    count: 15,
    growth: '+12%',
    verified: true,
    category: 'media'
  },
  {
    name: '36氪金融',
    count: 12,
    growth: '+22%',
    verified: true,
    category: 'media'
  },
  {
    name: 'TechCrunch',
    count: 9,
    growth: '+5%',
    verified: true,
    category: 'media'
  }
]

const weeklyTrends = [
  {
    day: '周一',
    value: 85,
    news: 198
  },
  {
    day: '周二', 
    value: 92,
    news: 234
  },
  {
    day: '周三',
    value: 78,
    news: 187
  },
  {
    day: '周四',
    value: 100,
    news: 248
  },
  {
    day: '周五',
    value: 88,
    news: 212
  },
  {
    day: '周六',
    value: 65,
    news: 156
  },
  {
    day: '周日',
    value: 58,
    news: 134
  }
]

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'text-red-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-green-400'
    default: return 'text-muted-foreground'
  }
}

function getCategoryColor(category: string) {
  const colors: { [key: string]: string } = {
    '财报': 'bg-blue-500/10 text-blue-400',
    '政策': 'bg-red-500/10 text-red-400',
    '产品': 'bg-green-500/10 text-green-400',
    '监管': 'bg-purple-500/10 text-purple-400',
    '市场': 'bg-orange-500/10 text-orange-400'
  }
  return colors[category] || 'bg-muted/50 text-muted-foreground'
}

function getSourceIcon(category: string) {
  switch (category) {
    case 'official': return '🏛️'
    case 'media': return '📰'
    case 'blog': return '📝'
    default: return '🌐'
  }
}

export function SidebarInfo() {
  return (
    <aside className="space-y-6">
      {/* Real-time Stats */}
      <div className="financial-card rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-primary" />
          实时统计
          <div className="ml-2 h-2 w-2 bg-green-400 rounded-full animate-pulse" />
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">今日新增</span>
            <span className="text-xl font-bold text-foreground">{todayStats.totalNews}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">总热度</span>
            <span className="font-semibold text-primary">{todayStats.totalHeat}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">活跃用户</span>
            <span className="font-semibold text-green-400">{todayStats.activeUsers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">信息源</span>
            <span className="font-semibold text-foreground">{todayStats.sources}</span>
          </div>
        </div>
        
        {/* Mini Chart */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">本周趋势</span>
            <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400">
              <TrendingUp className="h-2.5 w-2.5 mr-1" />
              +12%
            </Badge>
          </div>
          <div className="flex items-end justify-between h-12 gap-1">
            {weeklyTrends.map((trend, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group cursor-pointer">
                <div 
                  className="w-full bg-primary/20 hover:bg-primary/40 transition-colors rounded-sm"
                  style={{ height: `${(trend.value / 100) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">
                  {trend.day.slice(-1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Updates */}
      <div className="financial-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            快速更新
          </h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
            查看全部 <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {quickUpdates.map((update) => (
            <div key={update.id} className="group cursor-pointer">
              <div className="flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 mt-2 ${getPriorityColor(update.priority)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {update.content}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getCategoryColor(update.category)}>
                      {update.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{update.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Sources */}
      <div className="financial-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary" />
            热门信息源
          </h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-3">
          {topSources.map((source, index) => (
            <div key={source.name} className="flex items-center justify-between group cursor-pointer hover:bg-muted/20 p-2 -m-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm">{getSourceIcon(source.category)}</span>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {source.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    今日 {source.count} 条
                  </p>
                </div>
                {source.verified && (
                  <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                    ✓
                  </Badge>
                )}
              </div>
              <span className="text-xs text-green-400 font-medium">
                {source.growth}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Calendar */}
      <div className="financial-card rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          行业日历
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">G20峰会</span>
              <Badge variant="secondary" className="text-xs">明天</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              数字货币监管讨论
            </p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">PCI DSS 4.0</span>
              <Badge variant="secondary" className="text-xs">3天后</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              新标准正式实施
            </p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Money 20/20</span>
              <Badge variant="secondary" className="text-xs">下周</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              全球金融科技大会
            </p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-4 text-sm border-dashed hover:bg-primary/5">
          <Calendar className="h-4 w-4 mr-2" />
          查看完整日历
        </Button>
      </div>

      {/* Weekly Summary */}
      <div className="financial-card rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Star className="h-5 w-5 mr-2 text-primary" />
          本周精选
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">最热话题</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              央行数字货币政策持续升温，多个国家加快CBDC研发进程
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">重要事件</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Visa与Mastercard宣布Web3支付基础设施合作计划
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">市场动向</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              移动支付市场增速放缓，数字钱包竞争加剧
            </p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-4 text-sm border-dashed hover:bg-primary/5">
          获取周报详情
        </Button>
      </div>
    </aside>
  )
}