import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { SourcesManagement } from '@/components/admin/sources-management'

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-60">
        <Header
          title="新闻源管理"
          description="配置和管理资讯来源"
        />
        <div className="p-6">
          <SourcesManagement />
        </div>
      </main>
    </div>
  )
}
