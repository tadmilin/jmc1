'use client'

import React, { useEffect, useRef, useState } from 'react'

type RevealProps = {
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  children?: React.ReactNode
  /** Delay in ms before this element animates in. */
  delay?: number
  /**
   * `bare` only toggles `data-shown` (for sections that animate their own children,
   * e.g. map routes or step lines) without the default fade-up on the element itself.
   */
  bare?: boolean
  id?: string
  style?: React.CSSProperties
}

/** Marks its element `data-shown="true"` the first time it scrolls into view; globals.css does the animating. */
export function Reveal({ as = 'div', className, children, delay, bare, id, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Tag = as as React.ElementType
  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      data-reveal={bare ? undefined : ''}
      data-shown={shown ? 'true' : 'false'}
      style={delay ? { ...style, ['--reveal-delay' as string]: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  )
}
