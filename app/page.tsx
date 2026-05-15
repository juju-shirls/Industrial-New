import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { TodaySummary } from '@/components/admin/home/today-summary'
import { MainNewsList } from '@/components/admin/home/main-news'
import { HotTags } from '@/components/admin/home/hot-tags'
import { IndustryNews } from '@/components/admin/home/industry-news'
import { RecommendedReading } from '@/components/admin/home/recommended'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-60">
        <Header
          title="WiseVision"
          description="See Smarter. Decide Faster."
        />
        <div className="p-6 space-y-6">
          {/* 今日摘要 - 置顶 */}
          <TodaySummary />

          {/* 主内容区：左侧主榜单，右侧快讯 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MainNewsList />
            </div>
            <div>
              <IndustryNews />
            </div>
          </div>

          {/* 热门标签 */}
          <HotTags />

          {/* 推荐阅读 */}
          <RecommendedReading />
        </div>
      </main>
    </div>
  )
}
