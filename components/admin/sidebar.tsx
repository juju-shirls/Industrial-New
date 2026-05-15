'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Home,
  BarChart3,
  Rss,
  Tags,
  MessageSquare,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronDown,
  Newspaper,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { name: string; href: string }[]
}

const navigation: NavItem[] = [
  { 
    name: '首页', 
    href: '/', 
    icon: Home,
    children: [
      { name: '资讯详情', href: '/news' },
    ]
  },
  { name: '数据概览', href: '/dashboard', icon: BarChart3 },
  { name: '新闻源管理', href: '/sources', icon: Rss },
  { name: '分类标签', href: '/categories', icon: Tags },
  { name: '飞书配置', href: '/feishu', icon: MessageSquare },
  { name: '任务日志', href: '/logs', icon: FileText },
  { name: '用户权限', href: '/users', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['首页'])

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="WiseVision Logo" 
              width={32} 
              height={32}
              className="rounded-lg"
            />
            {!collapsed && (
              <span className="text-lg font-semibold text-sidebar-foreground">
                WiseVision
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const isChildActive = item.children?.some(child => pathname === child.href)
            const isExpanded = expandedItems.includes(item.name)
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.name}>
                {hasChildren ? (
                  <>
                    <div
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        isActive || isChildActive
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3 flex-1">
                        <item.icon className={cn('h-5 w-5 flex-shrink-0', (isActive || isChildActive) && 'text-sidebar-primary')} />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                      {!collapsed && (
                        <button
                          onClick={() => toggleExpand(item.name)}
                          className="p-1 rounded hover:bg-sidebar-accent"
                        >
                          <ChevronDown 
                            className={cn(
                              'h-4 w-4 transition-transform',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </button>
                      )}
                    </div>
                    {!collapsed && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                        {item.children.map((child) => {
                          const isChildItemActive = pathname === child.href
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                                isChildItemActive
                                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                              )}
                            >
                              <Newspaper className="h-4 w-4" />
                              <span>{child.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-primary'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-sidebar-primary')} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all"
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>系统设置</span>}
          </Link>
        </div>
      </div>
    </aside>
  )
}
