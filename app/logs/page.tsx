import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { LogsTable } from '@/components/admin/logs-table'

export default function LogsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-60">
        <Header
          title="任务日志"
          description="查看系统运行日志和错误详情"
        />
        <div className="p-6">
          <LogsTable />
        </div>
      </main>
    </div>
  )
}
