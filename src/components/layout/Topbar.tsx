'use client'

import { Menu } from 'lucide-react'

interface TopbarProps {
  title: string
  onMenuToggle: () => void
}

export default function Topbar({ title, onMenuToggle }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        {/* Slot for future features like notifications */}
      </div>
    </header>
  )
}
