import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { EnhancedNewsTable } from '@/components/admin/enhanced-news-table'

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-60">
        <Header
          title="资讯管理"
          description="管理支付行业资讯内容"
        />
        <div className="p-6">
          <EnhancedNewsTable />
        </div>
      </main>
    </div>
  )
}
