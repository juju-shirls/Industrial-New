import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { CategoriesManagement } from '@/components/admin/categories-management'

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-60">
        <Header
          title="分类标签管理"
          description="管理资讯分类和标签体系"
        />
        <div className="p-6">
          <CategoriesManagement />
        </div>
      </main>
    </div>
  )
}
