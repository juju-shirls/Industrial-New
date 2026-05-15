import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { FeishuConfig } from '@/components/admin/feishu-config'
import { Button } from '@/components/ui/button'
import { Send, RefreshCw } from 'lucide-react'

export default function FeishuPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-60">
        <Header
          title="飞书配置"
          description="配置飞书机器人推送设置"
        />
        <div className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              测试连接
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="mr-2 h-4 w-4" />
              发送测试消息
            </Button>
          </div>
          <FeishuConfig />
        </div>
      </main>
    </div>
  )
}
