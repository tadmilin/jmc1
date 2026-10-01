import React from 'react'

type IconProps = React.SVGProps<SVGSVGElement>

/** LINE speech-bubble glyph. The bubble takes `currentColor`; the lettering uses `letterColor`. */
export function LineIcon({ letterColor = '#06C755', ...props }: IconProps & { letterColor?: string }) {
  return (
    <svg viewBox="30 28 136 126" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M97.5 33.15c-35.6 0-64.35 23.4-64.35 52.35 0 26 20.8 48.45 49.4 51.9l19.5 12.35c1.95 1.3 4.55.65 5.2-1.3l3.9-15.6c35.1-5.85 61.35-31.85 61.35-47.35 0-28.95-28.75-52.35-64.35-52.35"
      />
      <g fill={letterColor}>
        <path d="M129.87 102.53c1.11 0 2.01-.9 2.01-2.01V79.34c0-1.11-.9-2.01-2.01-2.01s-2.01.9-2.01 2.01v19.16l-14.22-20.24c-.44-.63-1.16-1.01-1.93-1.01-1.11 0-2.01.9-2.01 2.01v21.18c0 1.11.9 2.01 2.01 2.01s2.01-.9 2.01-2.01V81.28l14.27 20.29c.45.64 1.17 1.01 1.94 1.01" />
        <path d="M156.19 77.33c-1.11 0-2.01.9-2.01 2.01v17.18h-11.67c-1.11 0-2.01.9-2.01 2.01s.9 2.01 2.01 2.01h13.68c1.11 0 2.01-.9 2.01-2.01V79.34c0-1.11-.9-2.01-2.01-2.01" />
        <path d="M73.56 77.33c-1.11 0-2.01.9-2.01 2.01v17.18H59.88c-1.11 0-2.01.9-2.01 2.01s.9 2.01 2.01 2.01h13.68c1.11 0 2.01-.9 2.01-2.01V79.34c0-1.11-.9-2.01-2.01-2.01" />
        <path d="M97.5 77.33c-1.11 0-2.01.9-2.01 2.01v21.18c0 1.11.9 2.01 2.01 2.01s2.01-.9 2.01-2.01V79.34c0-1.11-.9-2.01-2.01-2.01" />
      </g>
    </svg>
  )
}

/**
 * Shop mark: a roof line over brick courses, one brick in navy on the blue tile.
 * Drawn to echo the house-and-bricks mark the shop uses on its posters.
 */
export function BrandMark({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className} {...props}>
      <rect width="40" height="40" rx="11" fill="#2A54DF" />
      <path
        d="M8.5 18.5 20 9l11.5 9.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="11" y="21" width="8" height="4" rx="1" fill="#FFFFFF" />
      <rect x="21" y="21" width="8" height="4" rx="1" fill="#0F1938" />
      <rect x="11" y="27" width="3" height="4" rx="1" fill="#FFFFFF" />
      <rect x="16" y="27" width="8" height="4" rx="1" fill="#FFFFFF" />
      <rect x="26" y="27" width="3" height="4" rx="1" fill="#FFFFFF" />
    </svg>
  )
}
