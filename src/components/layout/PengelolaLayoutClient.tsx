'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PengelolaLayoutClientProps {
  children: React.ReactNode
  user: {
    namaLengkap: string
    role: string
    username: string
    foto?: string | null
  }
}

function getPageTitle(pathname: string): string {
  for (const item of NAV_ITEMS) {
    if (item.href && pathname === item.href) return item.label
    if (item.subItems) {
      for (const sub of item.subItems) {
        if (pathname === sub.href || pathname.startsWith(sub.href + '/')) return sub.label
      }
    }
  }
  return 'Dashboard'
}

export default function PengelolaLayoutClient({ children, user }: PengelolaLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored === 'true') {
      setSidebarCollapsed(true)
    }
  }, [])

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className={cn('main-content', sidebarCollapsed && 'collapsed')}>
        <Topbar
          title={title}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}
