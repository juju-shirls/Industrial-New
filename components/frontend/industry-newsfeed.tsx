'use client'

import { useState } from 'react'
import { Clock, ExternalLink, MessageCircle, Heart, Share, Filter, RefreshCw, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data for industry news feed
const industryNews = [
  {
    id: '1',
    title: 'PayPal第三季度财报超预期，数字钱包用户突破4.5亿',
    summary: 'PayPal公布第三季度财报，营收增长11%，用户增长率达到8%，数字钱包业务成为主要增长驱动力。',
    content: 'PayPal Holdings Inc.今日发布2024年第三季度财报，显示该公司在数字支付领域持续强劲增长...',
    category: '财报分析',
    source: 'PayPal官方',
    author: '财报编辑部',
    publishTime: '1 小时前',
    readTime: '3分钟',
    tags: ['PayPal', '财报', '数字钱包', '用户增长'],
    importance: 'high',
    views: 2340,
    likes: 156,
    comments: 23,
    heat: 8890,
    verified: true,
  },
  {
    id: '2',
    title: '欧盟新规：跨境支付手续费上限将进一步下调至0.2%',
    summary: '欧盟委员会通过新的跨境支付监管法案，将手续费上限从0.3%下调至0.2%，预计2024年Q4生效。',
    content: '欧盟委员会今日正式通过了新的跨境支付监管法案...',
    category: '政策监管',
    source: '欧盟委员会',
    author: '监管动态',
    publishTime: '2 小时前', 
    readTime: '4分钟',
    tags: ['欧盟', '跨境支付', '手续费', '监管'],
    importance: 'high',
    views: 1890,
    likes: 142,
    comments: 31,
    heat: 7650,
    verified: true,
  },
  {
    id: '3',
    title: '微信支付推出商户分账2.0，支持更灵活的资金结算方案',
    summary: '腾讯微信支付宣布升级商户分账功能，新版本支持实时分账、延迟分账等多种结算模式。',
    content: '腾讯微信支付今日宣布推出商户分账2.0功能...',
    category: '产品更新',
    source: '腾讯金融',
    author: '产品团队',
    publishTime: '3 小时前',
    readTime: '2分钟', 
    tags: ['微信支付', '分账', '商户', '结算'],
    importance: 'medium',
    views: 1456,
    likes: 89,
    comments: 12,
    heat: 5430,
    verified: true,
  },
  {
    id: '4',
    title: '印度UPI交易量再创新高，单月突破100亿笔交易',
    summary: 'NPCI数据显示，10月份UPI交易量达到103亿笔，交易金额超过15万亿卢比，同比增长45%。',
    content: 'NPCI（国家支付公司印度）发布的最新数据显示...',
    category: '市场数据',
    source: 'NPCI',
    author: '数据中心',
    publishTime: '4 小时前',
    readTime: '3分钟',
    tags: ['UPI', '印度', '交易量', '移动支付'],
    importance: 'medium',
    views: 1234,
    likes: 67,
    comments: 8,
    heat: 4320,
    verified: true,
  },
  {
    id: '5',
    title: 'Square推出新一代智能POS终端，集成AI反欺诈检测',
    summary: 'Square发布最新款智能POS终端，内置AI芯片，可实时检测欺诈交易，准确率达到99.7%。',
    content: 'Square公司今日发布了新一代智能POS终端...',
    category: '产品发布',
    source: 'Square',
    author: '硬件团队',
    publishTime: '5 小时前',
    readTime: '4分钟',
    tags: ['Square', 'POS', 'AI', '反欺诈'],
    importance: 'medium',
    views: 987,
    likes: 45,
    comments: 15,
    heat: 3210,
    verified: false,
  },
  {
    id: '6',
    title: '加密货币支付公司Ripple与日本三大银行达成合作协议',
    summary: 'Ripple宣布与三菱UFJ、瑞穗银行、三井住友银行签署战略合作协议，推进跨境支付数字化。',
    content: 'Ripple公司今日宣布与日本三大银行签署战略合作协议...',
    category: '企业合作',
    source: 'Ripple',
    author: '商务拓展部',
    publishTime: '6 小时前',
    readTime: '5分钟',
    tags: ['Ripple', '日本银行', '跨境支付', '加密货币'],
    importance: 'high',
    views: 2100,
    likes: 178,
    comments: 42,
    heat: 6540,
    verified: true,
  },
  {
    id: '7',
    title: 'Apple Pay在中国市场份额首次突破15%，增长势头强劲',
    summary: '第三方机构数据显示，Apple Pay在中国移动支付市场份额达到15.2%，年同比增长3.5%。',
    content: '根据第三方支付研究机构发布的最新报告...',
    category: '市场分析',
    source: '艾瑞咨询',
    author: '市场研究部',
    publishTime: '7 小时前',
    readTime: '3分钟',
    tags: ['Apple Pay', '中国市场', '市场份额', '移动支付'],
    importance: 'medium',
    views: 1567,
    likes: 92,
    comments: 18,
    heat: 4890,
    verified: true,
  },
  {
    id: '8',
    title: 'Stripe推出全球税务自动化平台，简化跨境电商税务处理',
    summary: 'Stripe发布全新税务自动化平台，支持190个国家的税务合规，电商企业可一键处理全球税务。',
    content: 'Stripe今日发布全新的税务自动化平台...',
    category: '产品更新',
    source: 'Stripe',
    author: '产品发布',
    publishTime: '8 小时前',
    readTime: '4分钟',
    tags: ['Stripe', '税务自动化', '跨境电商', '合规'],
    importance: 'medium',
    views: 1345,
    likes: 78,
    comments: 11,
    heat: 4120,
    verified: true,
  }
]

const categories = ['全部', '政策监管', '产品更新', '财报分析', '市场数据', '企业合作', '产品发布', '市场分析']

function getCategoryStyle(category: string) {
  const styles: { [key: string]: string } = {
    '政策监管': 'category-regulation',
    '财报分析': 'category-fintech', 
    '产品更新': 'category-enterprise',
    '市场数据': 'category-fintech',
    '企业合作': 'category-enterprise',
    '产品发布': 'category-fintech',
    '市场分析': 'category-enterprise'
  }
  return styles[category] || 'bg-muted/50 text-muted-foreground'
}

function getImportanceColor(importance: string) {
  switch (importance) {
    case 'high': return 'text-red-500'
    case 'medium': return 'text-yellow-500'
    case 'low': return 'text-green-500'
    default: return 'text-muted-foreground'
  }
}

export function IndustryNewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const filteredNews = selectedCategory === '全部' 
    ? industryNews 
    : industryNews.filter(news => news.category === selectedCategory)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main News Feed */}
          <div className="lg:col-span-3">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">行业快讯</h2>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                  实时更新
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="hover:bg-primary/5"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                刷新
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap ${
                    selectedCategory === category 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* News List */}
            <div className="space-y-6">
              {filteredNews.map((news) => (
                <article key={news.id} className="group news-card rounded-xl p-6 cursor-pointer">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge className={getCategoryStyle(news.category)}>
                          {news.category}
                        </Badge>
                        {news.verified && (
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                            ✓ 官方
                          </Badge>
                        )}
                        <div className={`h-2 w-2 rounded-full ${getImportanceColor(news.importance)}`} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {news.publishTime}
                      </div>
                    </div>

                    {/* Title & Summary */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed line-clamp-2">
                        {news.summary}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {news.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{news.readTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span>{news.heat.toLocaleString()} 热度</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <Heart className="h-4 w-4 mr-1" />
                          {news.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {news.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                size="lg"
                className="border-dashed hover:bg-primary/5 hover:border-primary/30"
              >
                加载更多资讯
              </Button>
            </div>
          </div>

          {/* Sidebar will be added in next component */}
          <div className="lg:col-span-1">
            {/* Placeholder for sidebar */}
            <div className="space-y-6">
              <div className="financial-card rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">实时统计</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">今日新增</span>
                    <span className="font-medium text-foreground">248</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">总热度</span>
                    <span className="font-medium text-primary">2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">活跃用户</span>
                    <span className="font-medium text-green-400">12.8K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}