import { Navigation } from '@/components/frontend/navigation'
import { FeaturedNews } from '@/components/frontend/featured-news'
import { TrendingTags } from '@/components/frontend/trending-tags'
import { IndustryNewsFeed } from '@/components/frontend/industry-newsfeed'
import { RankingsSection } from '@/components/frontend/rankings-section'
import { SidebarInfo } from '@/components/frontend/sidebar-info'

export default function FrontendHomePage() {
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
                {/* Industry News Feed */}
                <IndustryNewsFeed />
                
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">PaymentNews</h3>
              <p className="text-sm text-muted-foreground">
                专业的支付行业资讯聚合平台，为金融科技从业者提供最新、最全面的行业动态。
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">分类导航</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">支付终端</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">支付网关</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">数字货币</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">监管政策</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">热门标签</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">CBDC</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Web3支付</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">AI反欺诈</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">跨境支付</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">关于我们</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">广告合作</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">隐私政策</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">使用条款</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 PaymentNews. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                服务条款
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                隐私政策
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}