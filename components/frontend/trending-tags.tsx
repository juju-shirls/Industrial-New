'use client'

import { Hash, TrendingUp, Flame, ArrowRight, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data for trending tags
const trendingTags = [
  {
    id: '1',
    name: 'CBDC央行数字货币',
    count: 234,
    growth: '+23%',
    category: 'regulation',
    hot: true,
    trending: 'up'
  },
  {
    id: '2', 
    name: 'Web3支付',
    count: 189,
    growth: '+18%',
    category: 'fintech',
    hot: true,
    trending: 'up'
  },
  {
    id: '3',
    name: 'Visa战略',
    count: 156,
    growth: '+15%', 
    category: 'enterprise',
    hot: false,
    trending: 'up'
  },
  {
    id: '4',
    name: '跨境支付',
    count: 142,
    growth: '+12%',
    category: 'fintech',
    hot: false,
    trending: 'up'
  },
  {
    id: '5',
    name: 'PCI DSS',
    count: 128,
    growth: '+8%',
    category: 'regulation', 
    hot: false,
    trending: 'stable'
  },
  {
    id: '6',
    name: 'AI反欺诈',
    count: 115,
    growth: '+22%',
    category: 'fintech',
    hot: true,
    trending: 'up'
  },
  {
    id: '7',
    name: 'SoftPOS',
    count: 98,
    growth: '+5%',
    category: 'fintech',
    hot: false,
    trending: 'stable'
  },
  {
    id: '8',
    name: '支付合规',
    count: 87,
    growth: '+7%',
    category: 'regulation',
    hot: false,
    trending: 'up'
  },
  {
    id: '9',
    name: 'NFT支付',
    count: 76,
    growth: '+25%',
    category: 'crypto',
    hot: true,
    trending: 'up'
  },
  {
    id: '10',
    name: '开放银行',
    count: 65,
    growth: '+10%',
    category: 'fintech', 
    hot: false,
    trending: 'up'
  },
  {
    id: '11',
    name: '生物识别支付',
    count: 54,
    growth: '+17%',
    category: 'fintech',
    hot: false,
    trending: 'up'
  },
  {
    id: '12',
    name: 'B2B支付',
    count: 43,
    growth: '+3%',
    category: 'enterprise',
    hot: false,
    trending: 'stable'
  }
]

function getCategoryStyle(category: string) {
  switch (category) {
    case 'regulation':
      return 'category-regulation'
    case 'fintech': 
      return 'category-fintech'
    case 'crypto':
      return 'category-crypto'
    case 'enterprise':
      return 'category-enterprise'
    default:
      return 'bg-muted/50 text-muted-foreground'
  }
}

function getTrendIcon(trending: string) {
  switch (trending) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-green-400" />
    case 'stable':
      return <div className="h-3 w-3 rounded-full bg-yellow-400" />
    default:
      return null
  }
}

export function TrendingTags() {
  const hotTags = trendingTags.filter(tag => tag.hot).slice(0, 3)
  const allTags = trendingTags.slice(0, 12)

  return (
    <section className="py-8 bg-card/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Hash className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">热门标签</h2>
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
              <Flame className="h-3 w-3 mr-1" />
              实时更新
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            查看全部 <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Hot Tags Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {hotTags.map((tag, index) => (
            <div key={tag.id} className="group relative overflow-hidden rounded-xl financial-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="absolute top-4 right-4">
                <Badge className="tag-hot">
                  <Flame className="h-3 w-3 mr-1" />
                  HOT
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {tag.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tag.count} 条相关资讯
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(tag.trending)}
                    <span className="text-sm font-medium text-green-400">
                      {tag.growth}
                    </span>
                  </div>
                  
                  <Badge className={getCategoryStyle(tag.category)}>
                    {tag.category === 'regulation' ? '监管' : 
                     tag.category === 'fintech' ? '金融科技' :
                     tag.category === 'crypto' ? '加密货币' : '企业'}
                  </Badge>
                </div>
                
                <div className="heat-indicator rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-1000"
                    style={{ width: `${Math.min((tag.count / 250) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All Tags Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            全部热门标签
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allTags.map((tag) => (
              <div key={tag.id} className="group">
                <div className="news-card rounded-lg p-3 hover:scale-105 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                      #{tag.name}
                    </span>
                    {tag.hot && (
                      <Flame className="h-3 w-3 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {tag.count} 条
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(tag.trending)}
                      <span className="text-green-400 font-medium">
                        {tag.growth}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 heat-indicator rounded-full h-1 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary/60 to-blue-400/60 transition-all duration-500"
                      style={{ width: `${Math.min((tag.count / 250) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* View More Section */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            className="border-dashed hover:bg-primary/5 hover:border-primary/30"
          >
            探索更多标签 <Hash className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}