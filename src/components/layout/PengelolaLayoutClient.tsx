'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { NAV_ITEMS } from '@/lib/constants'

interface PengelolaLayoutClientProps {
  children: React.ReactNode
  user: {
    namaLengkap: string
    role: string
    username: string
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
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      <div className="main-content">
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
