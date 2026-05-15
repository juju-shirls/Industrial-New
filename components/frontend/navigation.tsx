'use client'

import { useState } from 'react'
import { Search, Menu, X, TrendingUp, Globe, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

const categories = [
  { name: '全部', href: '/', active: true },
  { name: '支付终端', href: '/category/payment-terminal' },
  { name: '支付网关', href: '/category/payment-gateway' },
  { name: '支付SaaS', href: '/category/payment-saas' },
  { name: 'AI科技', href: '/category/ai-tech' },
  { name: '加密货币', href: '/category/crypto' },
  { name: '监管合规', href: '/category/regulation' },
  { name: '跨境支付', href: '/category/cross-border' },
  { name: '公司动态', href: '/category/company-news' },
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality would go here
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">PaymentNews</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">支付行业资讯聚合</p>
              </div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索支付行业资讯..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground lg:block font-mono">
                ⌘K
              </kbd>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-sm">中文</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-t border-border/40">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-6 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-primary ${
                  category.active
                    ? 'text-primary border-b-2 border-primary pb-3'
                    : 'text-muted-foreground'
                }`}
              >
                {category.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="border-t border-border/40 bg-card p-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索支付行业资讯..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </form>

            {/* Mobile Categories */}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className={`p-3 text-sm font-medium rounded-lg transition-colors ${
                    category.active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  {category.name}
                </a>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button variant="outline" size="sm" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                中文
              </Button>
              <Button variant="outline" size="sm" className="flex items-center relative">
                <Bell className="h-4 w-4 mr-2" />
                通知
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}