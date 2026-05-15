'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Send,
  Clock,
  Bell,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react'

interface WebhookConfig {
  id: string
  name: string
  url: string
  isEnabled: boolean
  lastPush: string
  lastPushStatus: 'success' | 'failed'
}

const webhooks: WebhookConfig[] = [
  {
    id: '1',
    name: '支付行业群',
    url: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxx1',
    isEnabled: true,
    lastPush: '2024-01-15 14:30',
    lastPushStatus: 'success',
  },
  {
    id: '2',
    name: '高优先级预警群',
    url: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxx2',
    isEnabled: true,
    lastPush: '2024-01-15 14:25',
    lastPushStatus: 'success',
  },
  {
    id: '3',
    name: 'Crypto 资讯群',
    url: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxx3',
    isEnabled: false,
    lastPush: '2024-01-15 12:00',
    lastPushStatus: 'failed',
  },
]

const pushSchedule = [
  { time: '08:00', enabled: true },
  { time: '12:00', enabled: true },
  { time: '18:00', enabled: true },
  { time: '22:00', enabled: false },
]

export function FeishuConfig() {
  const [activeTab, setActiveTab] = useState<'webhooks' | 'schedule' | 'template'>('webhooks')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-muted/30 p-1 w-fit">
        {[
          { id: 'webhooks', label: 'Webhook 配置', icon: MessageSquare },
          { id: 'schedule', label: '推送时间', icon: Clock },
          { id: 'template', label: '消息模板', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              配置飞书机器人 Webhook 地址，支持多个推送群
            </p>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              添加 Webhook
            </Button>
          </div>

          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-card-foreground">{webhook.name}</h4>
                      <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                        {webhook.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Send className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {webhook.lastPushStatus === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-[oklch(0.72_0.19_160)]" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        最近推送: {webhook.lastPush}
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={webhook.isEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            设置每日定时推送时间点
          </p>

          <div className="rounded-xl border border-border bg-card p-5">
            <h4 className="font-medium text-card-foreground mb-4">每日推送时间</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {pushSchedule.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-card-foreground">
                      {schedule.time}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={schedule.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              添加时间点
            </Button>
          </div>
        </div>
      )}

      {/* Template Tab */}
      {activeTab === 'template' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            自定义飞书消息推送模板
          </p>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-card-foreground">消息模板</h4>
              <Button size="sm" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                预览
              </Button>
            </div>
            <textarea
              className="w-full h-48 rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              defaultValue={`{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": {
        "tag": "plain_text",
        "content": "{{title}}"
      },
      "template": "blue"
    },
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "{{summary}}"
        }
      }
    ]
  }
}`}
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                支持变量: {'{{title}}'}, {'{{summary}}'}, {'{{category}}'}, {'{{source}}'}, {'{{url}}'}
              </p>
              <Button size="sm">保存模板</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
