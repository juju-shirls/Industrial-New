'use client'

import { TrendingUp, Trophy, Hash, Zap, Clock, ExternalLink, Flame, Star, Crown, Medal, Award } from 'lucide-react'

export default function SimpleDemoPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">PaymentNews</h1>
                <p className="text-xs text-slate-400">支付行业资讯聚合</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
              <input
                type="text"
                placeholder="搜索支付行业资讯..."
                className="w-full h-10 px-4 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        
        {/* Category Navigation */}
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-6 py-3">
              {['全部', '支付终端', '支付网关', '支付SaaS', 'AI科技', '加密货币', '监管合规', '跨境支付'].map((category, index) => (
                <a
                  key={category}
                  href="#"
                  className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-blue-400 ${
                    index === 0
                      ? 'text-blue-400 border-b-2 border-blue-400 pb-3'
                      : 'text-slate-400'
                  }`}
                >
                  {category}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Featured News Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-3 mb-6">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-white">今日重点</h2>
              <span className="rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-1 text-xs">
                AI 精选
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Featured News */}
              <div className="lg:col-span-2">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/20 rounded text-xs">
                          政策监管
                        </span>
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded text-xs flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          热门
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white leading-tight">
                        央行数字货币试点范围扩大至16个城市，DCEP推广计划正式启动
                      </h3>
                      
                      <p className="text-slate-300 text-sm leading-relaxed">
                        央行数字货币试点范围进一步扩大，新增北京、上海等一线城市。这标志着中国在央行数字货币领域的发展步入新阶段，将对全球数字支付格局产生深远影响。
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          2小时前
                        </span>
                        <span>中国人民银行</span>
                        <span>3分钟阅读</span>
                        <span className="flex items-center gap-1 text-blue-400">
                          <TrendingUp className="h-3 w-3" />
                          12,458 热度
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Featured News */}
              <div className="space-y-4">
                {[
                  {
                    title: 'Visa与Mastercard联合推出Web3支付基础设施',
                    summary: '全球两大支付巨头宣布合作开发Web3支付基础设施，支持多链数字资产交易。',
                    category: '行业动态',
                    source: 'Visa官方',
                    time: '4小时前',
                    heat: 11203
                  },
                  {
                    title: 'PayPal第三季度财报超预期，用户突破4.5亿',
                    summary: 'PayPal公布第三季度财报，营收增长11%，数字钱包业务成为主要增长驱动力。',
                    category: '财报分析',
                    source: 'PayPal',
                    time: '1小时前',
                    heat: 9876
                  }
                ].map((news, index) => (
                  <div key={index} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded border ${
                          news.category === '行业动态' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' :
                          'bg-green-500/20 text-green-400 border-green-500/20'
                        }`}>
                          {news.category}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-white text-sm leading-snug">
                        {news.title}
                      </h4>
                      
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {news.summary}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {news.time}
                          </span>
                          <span>{news.source}</span>
                        </div>
                        <span className="flex items-center gap-1 text-blue-400">
                          <TrendingUp className="h-3 w-3" />
                          {news.heat.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hot Tags Section */}
        <section className="py-8 bg-slate-800/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-3 mb-6">
              <Hash className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-white">热门标签</h2>
              <span className="rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-1 text-xs flex items-center gap-1">
                <Flame className="h-3 w-3" />
                实时更新
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: 'CBDC央行数字货币', count: 567, change: '+23%' },
                { name: 'Web3支付', count: 432, change: '+18%' },
                { name: 'AI反欺诈', count: 298, change: '+45%' },
                { name: '跨境支付', count: 234, change: '+12%' },
                { name: 'PCI DSS', count: 189, change: '+8%' },
                { name: 'SoftPOS', count: 156, change: '+5%' },
                { name: 'NFT支付', count: 143, change: '+25%' },
                { name: '开放银行', count: 98, change: '+10%' },
                { name: '生物识别', count: 87, change: '+17%' },
                { name: 'B2B支付', count: 65, change: '+3%' }
              ].map((tag, index) => (
                <div key={index} className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-blue-500/50 hover:scale-105 transition-all cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white text-sm">#{tag.name}</span>
                      {index < 3 && <Flame className="h-3 w-3 text-orange-500" />}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{tag.count} 条</span>
                      <span className="text-green-400 font-medium">{tag.change}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-1 rounded-full transition-all"
                        style={{ width: `${Math.min((tag.count / 600) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rankings Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hot News Ranking */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <h3 className="font-semibold text-white">实时榜单</h3>
                      <span className="rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-1 text-xs">
                        热门榜
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-700">
                    {[
                      { rank: 1, title: '央行数字货币试点范围扩大至16个城市', heat: 12458, change: '+234', icon: Crown },
                      { rank: 2, title: 'Visa与Mastercard联合推出Web3支付基础设施', heat: 11203, change: '+189', icon: Medal },
                      { rank: 3, title: 'PayPal第三季度财报超预期，用户突破4.5亿', heat: 9876, change: '+156', icon: Award },
                      { rank: 4, title: '支付宝国际版与新加坡GrabPay达成战略合作', heat: 8934, change: '-45' },
                      { rank: 5, title: '欧盟新规：跨境支付手续费上限下调至0.2%', heat: 7823, change: '+98' }
                    ].map((news) => {
                      const IconComponent = news.icon || (() => <span className="text-sm font-bold text-slate-400">#{news.rank}</span>)
                      return (
                        <div key={news.rank} className="flex items-center gap-4 p-4 hover:bg-slate-700/50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-center w-8 h-8">
                            {news.icon ? (
                              <IconComponent className={`h-5 w-5 ${
                                news.rank === 1 ? 'text-yellow-500' :
                                news.rank === 2 ? 'text-gray-400' : 'text-amber-600'
                              }`} />
                            ) : (
                              <span className="text-sm font-bold text-slate-400">#{news.rank}</span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm leading-snug line-clamp-2">
                              {news.title}
                            </h4>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <div className="text-sm font-semibold text-blue-400">
                              {news.heat.toLocaleString()}
                            </div>
                            <div className={`flex items-center gap-1 text-xs ${
                              news.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                            }`}>
                              <TrendingUp className="h-3 w-3" />
                              {news.change}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="font-semibold text-white mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-500" />
                    实时统计
                    <div className="ml-2 h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">今日新增</span>
                      <span className="text-xl font-bold text-white">248</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">总热度</span>
                      <span className="font-semibold text-blue-400">2.4M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">活跃用户</span>
                      <span className="font-semibold text-green-400">12.8K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">信息源</span>
                      <span className="font-semibold text-white">156</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="font-semibold text-white mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    快速更新
                  </h3>
                  <div className="space-y-3">
                    {[
                      { time: '刚刚', content: 'Visa发布Q3财报，营收增长7%', category: '财报' },
                      { time: '5分钟前', content: '央行数字货币试点城市新增3个', category: '政策' },
                      { time: '12分钟前', content: 'PayPal推出加密货币结算服务', category: '产品' }
                    ].map((update, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 hover:bg-slate-700/30 rounded transition-colors cursor-pointer">
                        <div className="h-2 w-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{update.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded text-xs">
                              {update.category}
                            </span>
                            <span className="text-xs text-slate-400">{update.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © 2024 PaymentNews. All rights reserved. | 支付行业资讯聚合平台演示版
          </p>
        </div>
      </footer>
    </div>
  )
}