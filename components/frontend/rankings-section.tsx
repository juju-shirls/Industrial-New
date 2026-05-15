'use client'

import { useState } from 'react'
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award, Clock, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data for rankings
const hotNewsRanking = [
  {
    rank: 1,
    title: '央行数字货币试点范围扩大至16个城市',
    heat: 12458,
    change: '+234',
    changeType: 'up',
    source: '央行',
    category: '政策监管',
    publishTime: '2小时前'
  },
  {
    rank: 2,
    title: 'Visa与Mastercard联合推出Web3支付基础设施',
    heat: 11203,
    change: '+189',
    changeType: 'up',
    source: 'Visa官方',
    category: '行业动态',
    publishTime: '4小时前'
  },
  {
    rank: 3,
    title: 'PayPal第三季度财报超预期，用户突破4.5亿',
    heat: 9876,
    change: '+156',
    changeType: 'up',
    source: 'PayPal',
    category: '财报分析',
    publishTime: '1小时前'
  },
  {
    rank: 4,
    title: '支付宝国际版与新加坡GrabPay达成战略合作',
    heat: 8934,
    change: '-45',
    changeType: 'down',
    source: '蚂蚁集团',
    category: '企业新闻',
    publishTime: '6小时前'
  },
  {
    rank: 5,
    title: '欧盟新规：跨境支付手续费上限下调至0.2%',
    heat: 7823,
    change: '+98',
    changeType: 'up',
    source: '欧盟委员会',
    category: '政策监管',
    publishTime: '2小时前'
  },
  {
    rank: 6,
    title: 'Square推出新一代智能POS终端，集成AI反欺诈',
    heat: 6754,
    change: '0',
    changeType: 'stable',
    source: 'Square',
    category: '产品发布',
    publishTime: '5小时前'
  },
  {
    rank: 7,
    title: 'Ripple与日本三大银行达成跨境支付合作',
    heat: 5643,
    change: '+67',
    changeType: 'up',
    source: 'Ripple',
    category: '企业合作',
    publishTime: '6小时前'
  },
  {
    rank: 8,
    title: '微信支付推出商户分账2.0功能',
    heat: 4532,
    change: '-23',
    changeType: 'down',
    source: '腾讯',
    category: '产品更新',
    publishTime: '3小时前'
  },
  {
    rank: 9,
    title: '印度UPI交易量单月突破100亿笔',
    heat: 3987,
    change: '+45',
    changeType: 'up',
    source: 'NPCI',
    category: '市场数据',
    publishTime: '4小时前'
  },
  {
    rank: 10,
    title: 'Apple Pay中国市场份额首次突破15%',
    heat: 3456,
    change: '+34',
    changeType: 'up',
    source: '艾瑞咨询',
    category: '市场分析',
    publishTime: '7小时前'
  }
]

const companyRanking = [
  {
    rank: 1,
    name: 'Visa',
    mentionCount: 234,
    sentiment: 'positive',
    change: '+12',
    changeType: 'up'
  },
  {
    rank: 2,
    name: 'PayPal',
    mentionCount: 189,
    sentiment: 'positive',
    change: '+8',
    changeType: 'up'
  },
  {
    rank: 3,
    name: 'Mastercard',
    mentionCount: 156,
    sentiment: 'positive',
    change: '+5',
    changeType: 'up'
  },
  {
    rank: 4,
    name: '支付宝',
    mentionCount: 142,
    sentiment: 'positive',
    change: '-2',
    changeType: 'down'
  },
  {
    rank: 5,
    name: 'Square',
    mentionCount: 98,
    sentiment: 'positive',
    change: '+15',
    changeType: 'up'
  }
]

const keywordRanking = [
  { rank: 1, keyword: 'CBDC', count: 567, change: '+23%' },
  { rank: 2, keyword: 'Web3支付', count: 432, change: '+18%' },
  { rank: 3, keyword: 'AI反欺诈', count: 298, change: '+45%' },
  { rank: 4, keyword: '跨境支付', count: 234, change: '+12%' },
  { rank: 5, keyword: 'PCI DSS', count: 189, change: '+8%' }
]

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
  return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
}

function getChangeIcon(changeType: string) {
  switch (changeType) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-green-400" />
    case 'down':
      return <TrendingDown className="h-3 w-3 text-red-400" />
    default:
      return <Minus className="h-3 w-3 text-muted-foreground" />
  }
}

function getCategoryStyle(category: string) {
  const styles: { [key: string]: string } = {
    '政策监管': 'category-regulation',
    '财报分析': 'category-fintech',
    '产品更新': 'category-enterprise',
    '市场数据': 'category-fintech',
    '企业合作': 'category-enterprise',
    '产品发布': 'category-fintech',
    '市场分析': 'category-enterprise',
    '行业动态': 'category-fintech',
    '企业新闻': 'category-enterprise'
  }
  return styles[category] || 'bg-muted/50 text-muted-foreground'
}

export function RankingsSection() {
  const [selectedTab, setSelectedTab] = useState('热门')
  
  const tabs = ['热门', '公司', '关键词']

  return (
    <section className="py-8 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-foreground">实时榜单</h2>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
              <Trophy className="h-3 w-3 mr-1" />
              排行榜
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            每10分钟更新一次
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hot News Ranking */}
          <div className="lg:col-span-2">
            <div className="financial-card rounded-xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-border/50">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-6 py-4 text-sm font-medium transition-all relative ${
                      selectedTab === tab
                        ? 'text-primary bg-primary/5 border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                  >
                    {tab}榜单
                  </button>
                ))}
              </div>

              {/* Hot News List */}
              {selectedTab === '热门' && (
                <div className="divide-y divide-border/50">
                  {hotNewsRanking.slice(0, 8).map((news) => (
                    <div key={news.rank} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors group cursor-pointer">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                        {getRankIcon(news.rank)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs">
                          <Badge className={getCategoryStyle(news.category)}>
                            {news.category}
                          </Badge>
                          <span className="text-muted-foreground">{news.source}</span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {news.publishTime}
                          </span>
                        </div>
                      </div>

                      {/* Heat & Change */}
                      <div className="text-right space-y-1 flex-shrink-0">
                        <div className="text-sm font-semibold text-primary">
                          {news.heat.toLocaleString()}
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${
                          news.changeType === 'up' ? 'text-green-400' :
                          news.changeType === 'down' ? 'text-red-400' : 'text-muted-foreground'
                        }`}>
                          {getChangeIcon(news.changeType)}
                          {news.change}
                        </div>
                      </div>

                      {/* Action */}
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Company Ranking */}
              {selectedTab === '公司' && (
                <div className="divide-y divide-border/50">
                  {companyRanking.map((company) => (
                    <div key={company.rank} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors group cursor-pointer">
                      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                        {getRankIcon(company.rank)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {company.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {company.mentionCount} 条提及
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            company.sentiment === 'positive' ? 'bg-green-500/10 text-green-500' : 
                            company.sentiment === 'negative' ? 'bg-red-500/10 text-red-500' :
                            'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {company.sentiment === 'positive' ? '正面' : 
                           company.sentiment === 'negative' ? '负面' : '中性'}
                        </Badge>
                        <div className={`flex items-center gap-1 text-xs ${
                          company.changeType === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {getChangeIcon(company.changeType)}
                          {company.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Keyword Ranking */}
              {selectedTab === '关键词' && (
                <div className="divide-y divide-border/50">
                  {keywordRanking.map((keyword) => (
                    <div key={keyword.rank} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors group cursor-pointer">
                      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                        {getRankIcon(keyword.rank)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          #{keyword.keyword}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {keyword.count} 条相关
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-400">
                          {keyword.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View More */}
              <div className="p-4 border-t border-border/50 bg-muted/20">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary">
                  查看完整{selectedTab}榜单
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <div className="financial-card rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                今日概览
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">总热度</span>
                  <span className="text-xl font-bold text-primary">2.4M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">新增资讯</span>
                  <span className="font-semibold text-foreground">248</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">上榜企业</span>
                  <span className="font-semibold text-foreground">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">热门标签</span>
                  <span className="font-semibold text-foreground">89</span>
                </div>
              </div>
            </div>

            {/* Rising Fast */}
            <div className="financial-card rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                快速上升
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#CBDC央行数字货币</span>
                  <span className="text-xs text-green-400">+45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#AI反欺诈</span>
                  <span className="text-xs text-green-400">+38%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#NFT支付</span>
                  <span className="text-xs text-green-400">+25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#Web3支付</span>
                  <span className="text-xs text-green-400">+18%</span>
                </div>
              </div>
            </div>

            {/* Live Activity */}
            <div className="financial-card rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-3" />
                实时动态
              </h3>
              <div className="space-y-3 text-sm">
                <div className="text-muted-foreground">
                  <span className="text-primary">PayPal</span> 热度上升至第3位
                </div>
                <div className="text-muted-foreground">
                  新增标签 <span className="text-primary">#生物识别支付</span>
                </div>
                <div className="text-muted-foreground">
                  <span className="text-primary">央行数字货币</span> 讨论激增
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}