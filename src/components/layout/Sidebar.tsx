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
  Newspaper,
} from 'lucide-react'
import { useState } from 'react'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/(auth)/actions'
import Modal from '@/components/ui/Modal'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard,
  Mail,
  CalendarCheck,
  Wallet,
  Users,
  FileText,
  Settings,
  ClipboardList,
  Newspaper,
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
  const [showLogoutModal, setShowLogoutModal] = useState(false)

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
              src="/logo_mliwis.jpg" 
              alt="Logo" 
              className="sidebar-logo-img" 
              style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0 }} 
            />
            <div className="sidebar-logo-text" style={{ whiteSpace: 'nowrap' }}>
              <h2>SI-Mliwis</h2>
              <p>Pantai Mliwis</p>
            </div>
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
                    onClick={() => {
                      if (isCollapsed && onToggleCollapse) {
                        onToggleCollapse()
                        if (!expandedMenus.includes(item.label)) {
                          toggleMenu(item.label)
                        }
                      } else {
                        toggleMenu(item.label)
                      }
                    }}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {Icon && <Icon size={20} className="menu-icon" />}
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
                {Icon && <Icon size={20} className="menu-icon" />}
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
          <button
            type="button"
            className="sidebar-menu-item"
            style={{ marginTop: 8, width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
            title={isCollapsed ? "Keluar" : undefined}
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={18} className="menu-icon" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Konfirmasi Keluar"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => setShowLogoutModal(false)}
              type="button"
            >
              Batal
            </button>
            <form action={logoutAction} style={{ margin: 0 }}>
              <button 
                className="btn btn-danger btn-sm" 
                type="submit"
                style={{ backgroundColor: 'var(--color-danger)', color: 'white', border: 'none' }}
              >
                Keluar
              </button>
            </form>
          </div>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
          Apakah Anda yakin ingin keluar dari sistem SI-Mliwis? Anda harus masuk kembali untuk mengelola data operasional pantai.
        </p>
      </Modal>
    </>
  )
}
