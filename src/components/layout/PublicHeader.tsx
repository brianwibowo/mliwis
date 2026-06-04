'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Waves, LogIn, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PublicHeaderProps {
  transparentByDefault?: boolean
}

export default function PublicHeader({ transparentByDefault = false }: PublicHeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!transparentByDefault) {
      setScrolled(true)
      return
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Set initial scroll state
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [transparentByDefault])

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Aneka Kuliner', href: '/kuliner' },
    { label: 'Berita Kegiatan', href: '/berita-kegiatan' },
    { label: 'Booking Tempat', href: '/booking' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={cn(
          'landing-navbar',
          scrolled && 'scrolled',
          mobileMenuOpen && 'mobile-open'
        )}
        id="main-header"
        style={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Link href="/" className="landing-logo" id="logo-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img
            src="/logo_mliwis.png"
            alt="Logo Pantai Mliwis"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
          <span style={{ color: scrolled ? 'var(--color-primary-900)' : 'white' }}>Pantai Mliwis</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="landing-nav-links" id="desktop-nav" style={{ display: 'flex', gap: '32px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'landing-nav-link',
                isActive(link.href) && 'active'
              )}
              style={{
                color: isActive(link.href)
                  ? 'var(--color-primary-600)'
                  : scrolled
                    ? 'var(--color-text-muted)'
                    : 'rgba(255, 255, 255, 0.85)',
                fontWeight: isActive(link.href) ? '600' : '400',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="landing-nav-actions" id="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm navbar-admin-btn"
            id="btn-login-admin"
            style={{
              borderColor: scrolled ? 'var(--color-primary-600)' : 'rgba(255, 255, 255, 0.4)',
              color: scrolled ? 'var(--color-primary-600)' : 'white',
            }}
          >
            <LogIn size={14} />
            <span>Login Admin</span>
          </Link>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: scrolled ? 'var(--color-primary-900)' : 'white',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-menu"
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            gap: '16px',
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'landing-nav-link',
                isActive(link.href) && 'active'
              )}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: isActive(link.href) ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                fontSize: '1.1rem',
                fontWeight: isActive(link.href) ? '600' : '500',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border-subtle)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            onClick={() => setMobileMenuOpen(false)}
            style={{ marginTop: '12px', justifyContent: 'center' }}
          >
            <LogIn size={16} />
            <span>Login Admin</span>
          </Link>
        </div>
      )}
    </>
  )
}
