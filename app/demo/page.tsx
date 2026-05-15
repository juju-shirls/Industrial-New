'use client'

import { Navigation } from '@/components/frontend/navigation'
import { FeaturedNews } from '@/components/frontend/featured-news'
import { TrendingTags } from '@/components/frontend/trending-tags'
import { IndustryNewsFeed } from '@/components/frontend/industry-newsfeed'
import { RankingsSection } from '@/components/frontend/rankings-section'
import { SidebarInfo } from '@/components/frontend/sidebar-info'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background dark">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        {/* Featured News Section */}
        <FeaturedNews />
        
        {/* Trending Tags Section */}
        <TrendingTags />
        
        {/* Main Content Area with Sidebar */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="xl:col-span-3 space-y-8">
                {/* Industry News Feed (without embedded sidebar) */}
                <div className="py-8">
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                      <div className="lg:col-span-1">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="h-6 w-6 text-primary">⚡</div>
                            <h2 className="text-2xl font-bold text-foreground">行业快讯</h2>
                            <span className="rounded-full bg-green-500/10 text-green-500 border-green-500/20 px-2 py-1 text-xs">
                              实时更新
                            </span>
                          </div>
                        </div>
                        
                        {/* Industry News Content will be here */}
                        <div className="space-y-6">
                          {/* Mock news items */}
                          <div className="news-card rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              PayPal第三季度财报超预期，数字钱包用户突破4.5亿
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              PayPal公布第三季度财报，营收增长11%，用户增长率达到8%，数字钱包业务成为主要增长驱动力。
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="category-fintech px-2 py-1 rounded">财报分析</span>
                              <span>PayPal官方</span>
                              <span>1小时前</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Rankings Section */}
                <RankingsSection />
              </div>
              
              {/* Sidebar */}
              <div className="xl:col-span-1">
                <div className="sticky top-24">
                  <SidebarInfo />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 PaymentNews. All rights reserved. | 支付行业资讯聚合平台演示版
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}