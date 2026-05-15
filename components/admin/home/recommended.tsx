'use client'

import { BookOpen, Star, Clock, Eye } from 'lucide-react'

const recommendedArticles = [
  {
    title: '深度解读：2024 全球支付行业十大趋势预测',
    description: '从数字货币到嵌入式金融，全面分析支付行业未来发展方向...',
    source: '支付产业网',
    time: '昨天',
    views: 12834,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=120&fit=crop',
  },
  {
    title: '央行数字货币 CBDC：各国进展与技术路线对比',
    description: '深入分析中国、欧盟、美国等主要经济体的 CBDC 发展现状...',
    source: '金融科技研究院',
    time: '2 天前',
    views: 9876,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=120&fit=crop',
  },
  {
    title: '跨境支付新格局：SWIFT 替代方案深度比较',
    description: '探讨 CIPS、SPFS、INSTEX 等系统的技术特点和应用场景...',
    source: '国际金融报',
    time: '3 天前',
    views: 8543,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&h=120&fit=crop',
  },
]

export function RecommendedReading() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">推荐阅读</h3>
      </div>
      <div className="divide-y divide-border">
        {recommendedArticles.map((article, index) => (
          <div
            key={index}
            className="flex gap-4 p-5 hover:bg-muted/30 transition-colors cursor-pointer group"
          >
            <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <h4 className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                {article.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {article.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{article.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.time}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500" />
                  {article.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
