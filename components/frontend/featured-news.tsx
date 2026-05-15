'use client'

import { Clock, ArrowRight, Flame, TrendingUp, Star, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data for featured news
const featuredNews = [
  {
    id: '1',
    title: '央行数字货币试点范围扩大：16个城市正式纳入DCEP推广计划',
    summary: '央行数字货币试点范围进一步扩大，新增北京、上海等一线城市。这标志着中国在央行数字货币领域的发展步入新阶段，将对全球数字支付格局产生深远影响。',
    category: '政策监管',
    source: '中国人民银行',
    publishTime: '2 小时前',
    readTime: '3分钟',
    heat: 9823,
    image: '/api/placeholder/600/400',
    tags: ['央行数字货币', 'DCEP', '数字支付', '政策'],
    featured: true,
    trending: true,
  },
  {
    id: '2',
    title: 'Visa与Mastercard联合推出Web3支付基础设施，支持多链数字资产交易',
    summary: '全球两大支付巨头Visa和Mastercard宣布合作开发Web3支付基础设施，将为消费者提供无缝的数字资产支付体验，支持比特币、以太坊等主流加密货币。',
    category: '行业动态', 
    source: 'Visa官方',
    publishTime: '4 小时前',
    readTime: '5分钟',
    heat: 8456,
    image: '/api/placeholder/600/400',
    tags: ['Visa', 'Mastercard', 'Web3', '加密货币'],
    featured: true,
    trending: false,
  },
  {
    id: '3',
    title: '支付宝国际版与新加坡GrabPay达成战略合作，打造东南亚统一支付生态',
    summary: '阿里巴巴旗下支付宝国际版宣布与新加坡超级应用Grab的支付业务GrabPay建立深度合作关系，将在东南亚6个国家推出统一的跨境支付解决方案。',
    category: '企业新闻',
    source: '蚂蚁集团',
    publishTime: '6 小时前', 
    readTime: '4分钟',
    heat: 7234,
    image: '/api/placeholder/600/400',
    tags: ['支付宝', 'Grab', '跨境支付', '东南亚'],
    featured: false,
    trending: true,
  }
]

export function FeaturedNews() {
  const mainFeatured = featuredNews[0]
  const secondaryFeatured = featuredNews.slice(1)

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-foreground">今日重点</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              AI 精选
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            查看全部 <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured News */}
          <div className="lg:col-span-2">
            <div className="group relative overflow-hidden rounded-xl financial-card p-0 hover:scale-[1.02] transition-all duration-300">
              {/* Hero Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="space-y-3">
                    {/* Tags & Category */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="category-regulation">
                        {mainFeatured.category}
                      </Badge>
                      {mainFeatured.trending && (
                        <Badge className="tag-trending">
                          <Flame className="h-3 w-3 mr-1" />
                          热门
                        </Badge>
                      )}
                      <Badge className="tag-new">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {mainFeatured.heat.toLocaleString()} 热度
                      </Badge>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-2 group-hover:text-blue-100 transition-colors">
                      {mainFeatured.title}
                    </h3>
                    
                    {/* Summary */}
                    <p className="text-gray-200 text-sm line-clamp-2">
                      {mainFeatured.summary}
                    </p>
                    
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mainFeatured.publishTime}
                      </span>
                      <span>{mainFeatured.source}</span>
                      <span>{mainFeatured.readTime}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto text-white hover:text-blue-100 hover:bg-white/10"
                      >
                        阅读全文 <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Featured News */}
          <div className="space-y-4">
            {secondaryFeatured.map((news, index) => (
              <div key={news.id} className="news-card rounded-xl p-4 group cursor-pointer">
                <div className="space-y-3">
                  {/* Category & Tags */}
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary"
                      className={`text-xs ${
                        news.category === '行业动态' ? 'category-fintech' :
                        news.category === '企业新闻' ? 'category-enterprise' :
                        'category-regulation'
                      }`}
                    >
                      {news.category}
                    </Badge>
                    {news.trending && (
                      <Badge className="tag-trending text-xs">
                        <Flame className="h-2.5 w-2.5 mr-1" />
                        热门
                      </Badge>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {news.title}
                  </h4>
                  
                  {/* Summary */}
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {news.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {news.publishTime}
                      </span>
                      <span>{news.source}</span>
                    </div>
                    <span className="flex items-center gap-1 text-primary">
                      <TrendingUp className="h-3 w-3" />
                      {news.heat.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* View More Button */}
            <Button 
              variant="outline" 
              className="w-full mt-4 border-dashed hover:bg-primary/5 hover:border-primary/30"
            >
              查看更多重点新闻 <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}