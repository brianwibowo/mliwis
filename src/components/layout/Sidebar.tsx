'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Mail,
  CalendarCheck,
  Wallet,
  Users,
  FileText,
  Settings,
  Waves,
  ChevronDown,
  LogOut,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/(auth)/actions'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard,
  Mail,
  CalendarCheck,
  Wallet,
  Users,
  FileText,
  Settings,
  ClipboardList,
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user: {
    namaLengkap: string
    role: string
    username: string
    foto?: string | null
  }
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Sidebar({ isOpen, onClose, user, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    )
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // Auto-expand menus that have active sub-items
  const getIsExpanded = (item: typeof NAV_ITEMS[number]) => {
    if (expandedMenus.includes(item.label)) return true
    if (item.subItems) {
      return item.subItems.some((sub) => isActive(sub.href))
    }
    return false
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn('sidebar-overlay', isOpen && 'visible')}
        onClick={onClose}
      />

      <aside className={cn('sidebar', isOpen && 'open', isCollapsed && 'collapsed')}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            <img 
              src="/logo_mliwis.png" 
              alt="Logo" 
              className="sidebar-logo-img" 
              style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0 }} 
            />
            {!isCollapsed && (
              <div className="sidebar-logo-text" style={{ whiteSpace: 'nowrap' }}>
                <h2>SI-Mliwis</h2>
                <p>Pantai Mliwis</p>
              </div>
            )}
          </div>
          {/* Collapse Button for desktop */}
          <button 
            type="button" 
            className="sidebar-collapse-btn" 
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu Utama</div>

          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon]
            const expanded = getIsExpanded(item)

            if (item.subItems) {
              return (
                <div key={item.label}>
                  <button
                    className={cn(
                      'sidebar-menu-item',
                      item.subItems.some((sub) => isActive(sub.href)) && 'active'
                    )}
                    onClick={() => toggleMenu(item.label)}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {Icon && <Icon size={20} />}
                    <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                    <ChevronDown
                      size={16}
                      className="chevron-icon"
                      style={{
                        transition: 'transform 200ms ease',
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                        opacity: 0.5,
                      }}
                    />
                  </button>

                  {expanded && (
                    <div className="sidebar-submenu">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            'sidebar-menu-item',
                            isActive(sub.href) && 'active'
                          )}
                          onClick={onClose}
                        >
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  'sidebar-menu-item',
                  isActive(item.href!) && 'active'
                )}
                onClick={onClose}
                title={isCollapsed ? item.label : undefined}
              >
                {Icon && <Icon size={20} />}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <Link href="/profil" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="sidebar-user" style={{ cursor: 'pointer' }}>
              <div className="sidebar-user-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.foto ? (
                  <img src={user.foto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.namaLengkap.charAt(0).toUpperCase()
                )}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.namaLengkap}</div>
                <div className="sidebar-user-role">{user.role}</div>
              </div>
            </div>
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="sidebar-menu-item" style={{ marginTop: 8 }} title={isCollapsed ? "Keluar" : undefined}>
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
