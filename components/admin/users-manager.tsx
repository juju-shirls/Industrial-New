'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Shield,
  User,
  Clock,
  Check,
} from 'lucide-react'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'editor'
  lastLogin: string
  status: 'active' | 'inactive'
}

const users: AdminUser[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'super_admin',
    lastLogin: '2024-01-15 14:30',
    status: 'active',
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: 'admin',
    lastLogin: '2024-01-15 12:00',
    status: 'active',
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: 'editor',
    lastLogin: '2024-01-14 18:00',
    status: 'active',
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'editor',
    lastLogin: '2024-01-10 09:00',
    status: 'inactive',
  },
]

const roleLabels: Record<string, string> = {
  super_admin: '超级管理员',
  admin: '管理员',
  editor: '编辑',
}

const roleColors: Record<string, string> = {
  super_admin: 'bg-primary/10 text-primary',
  admin: 'bg-[oklch(0.65_0.18_250)]/10 text-[oklch(0.65_0.18_250)]',
  editor: 'bg-muted text-muted-foreground',
}

const permissions = [
  { id: 'news_read', name: '查看资讯', super_admin: true, admin: true, editor: true },
  { id: 'news_edit', name: '编辑资讯', super_admin: true, admin: true, editor: true },
  { id: 'news_publish', name: '发布资讯', super_admin: true, admin: true, editor: false },
  { id: 'news_delete', name: '删除资讯', super_admin: true, admin: true, editor: false },
  { id: 'source_manage', name: '管理新闻源', super_admin: true, admin: true, editor: false },
  { id: 'category_manage', name: '管理分类', super_admin: true, admin: true, editor: false },
  { id: 'feishu_config', name: '飞书配置', super_admin: true, admin: false, editor: false },
  { id: 'user_manage', name: '用户管理', super_admin: true, admin: false, editor: false },
  { id: 'system_config', name: '系统设置', super_admin: true, admin: false, editor: false },
]

export function UsersManager() {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions'>('users')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-muted/30 p-1 w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-4 w-4" />
          用户列表
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'permissions'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="h-4 w-4" />
          角色权限
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索用户..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-64 rounded-lg border border-border bg-input pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              添加用户
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    用户
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    角色
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    最近登录
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    状态
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn('inline-flex rounded-md px-2 py-1 text-xs font-medium', roleColors[user.role])}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {user.lastLogin}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                          user.status === 'active'
                            ? 'bg-[oklch(0.72_0.19_160)]/10 text-[oklch(0.72_0.19_160)]'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {user.status === 'active' ? '活跃' : '停用'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  权限
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  超级管理员
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  管理员
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  编辑
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm text-card-foreground">
                    {perm.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.super_admin && (
                      <Check className="h-4 w-4 text-[oklch(0.72_0.19_160)] mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.admin && (
                      <Check className="h-4 w-4 text-[oklch(0.72_0.19_160)] mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.editor && (
                      <Check className="h-4 w-4 text-[oklch(0.72_0.19_160)] mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
