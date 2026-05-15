import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { UsersManager } from '@/components/admin/users-manager'

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-60">
        <Header
          title="用户权限"
          description="管理系统用户和角色权限"
        />
        <div className="p-6">
          <UsersManager />
        </div>
      </main>
    </div>
  )
}
