import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { EnhancedDashboard } from '@/components/admin/enhanced-dashboard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-60">
        <Header
          title="数据概览"
          description="支付行业资讯管理系统运行状态"
        />
        <div className="p-6">
          <EnhancedDashboard />
        </div>
      </main>
    </div>
  )
}
