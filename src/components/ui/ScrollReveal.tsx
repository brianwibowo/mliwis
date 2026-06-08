'use client'

import React, { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  variant?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out'
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  style?: React.CSSProperties
  id?: string
}

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 650,
  threshold = 0.1,
  className = '',
  style = {},
  id,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element fully enters to feel responsive
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  const combinedStyle: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    ...style,
  }

  return (
    <div
      ref={ref}
      id={id}
      className={`scroll-reveal scroll-reveal-${variant} ${isVisible ? 'scroll-reveal-visible' : ''} ${className}`}
      style={combinedStyle}
    >
      {children}
    </div>
  )
}
