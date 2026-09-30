import Link from 'next/link'
import React from 'react'

import { Reveal } from '@/components/site/Reveal'
import { offsetFromShop, serviceAreas } from '@/content/areas'

const R = 170 // px radius of the 10 km ring
const MAX_KM = 10
const RINGS = [1, 3, 6, 10]

/** sqrt radial scale spreads out the areas close to the shop while keeping true directions. */
function project(km: { x: number; y: number }) {
  const d = Math.hypot(km.x, km.y)
  if (d === 0) return { x: 0, y: 0, d }
  const r = R * Math.sqrt(Math.min(d, MAX_KM) / MAX_KM)
  return { x: (km.x / d) * r, y: -(km.y / d) * r, d }
}

/** Per-area label nudges so neighbouring names don't collide. */
const labelNudge: Record<string, { dx?: number; dy?: number; anchor?: 'start' | 'end' | 'middle' }> = {
  talingchan: { dx: -8, dy: 16, anchor: 'end' },
  bangkunnon: { dx: 8, dy: -6 },
  bangkoknoi: { dx: 8, dy: 12 },
  jaran: { dx: 8, dy: 6 },
  borom: { dx: -8, dy: 15, anchor: 'end' },
  suanphak: { dx: -8, dy: -7, anchor: 'end' },
  thawiwatthana: { dx: -8, dy: 4, anchor: 'end' },
  bangkruai: { dx: 8, dy: -4 },
  rama5: { dx: 8, dy: 4 },
  bangphlat: { dx: 8, dy: 4 },
  pinklao: { dx: 8, dy: 4 },
  thonburi: { dx: 8, dy: 4 },
}

export function ServiceMap({ highlight, className }: { highlight?: string; className?: string }) {
  const points = serviceAreas.map((a) => ({ area: a, ...project(offsetFromShop(a.lat, a.lng)) }))

  return (
    <Reveal bare className={className}>
      <svg
        viewBox="-210 -210 420 420"
        role="img"
        aria-label="แผนที่พื้นที่จัดส่งรอบร้านจงมีชัยค้าวัสดุ ตลิ่งชัน"
        className="h-full w-full select-none font-sans"
      >
        <defs>
          <radialGradient id="map-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(190)">
            <stop offset="0" stopColor="#FF5A1F" stopOpacity="0.18" />
            <stop offset="1" stopColor="#FF5A1F" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle r={R + 20} fill="url(#map-glow)" />

        {/* compass cross-hair */}
        <g stroke="#F7F6F2" strokeOpacity="0.08">
          <line x1={-R - 30} x2={R + 30} y1="0" y2="0" />
          <line y1={-R - 30} y2={R + 30} x1="0" x2="0" />
        </g>

        {RINGS.map((km) => {
          const r = R * Math.sqrt(km / MAX_KM)
          return (
            <g key={km}>
              <circle
                r={r}
                fill="none"
                stroke="#F7F6F2"
                strokeOpacity={km === MAX_KM ? 0.28 : 0.12}
                strokeDasharray={km === MAX_KM ? '0' : '2 5'}
              />
              <text x={r * 0.707 + 4} y={-r * 0.707 - 4} fill="#F7F6F2" fillOpacity="0.4" fontSize="9" className="font-mono">
                {km} กม.
              </text>
            </g>
          )
        })}

        {[0, 1500, 3000].map((d) => (
          <circle
            key={d}
            r={R + 20}
            fill="none"
            stroke="#FF5A1F"
            strokeWidth="1.5"
            className="map-pulse"
            style={{ ['--d' as string]: `${d}ms` }}
          />
        ))}

        {points.map(({ area, x, y }, i) => {
          const len = Math.hypot(x, y)
          const active = highlight === area.slug
          return (
            <path
              key={`route-${area.slug}`}
              d={`M0 0 L${x.toFixed(1)} ${y.toFixed(1)}`}
              stroke={active ? '#FF5A1F' : '#F7F6F2'}
              strokeOpacity={active ? 0.9 : 0.22}
              strokeWidth={active ? 1.6 : 1}
              className="map-route"
              style={{ ['--len' as string]: `${len.toFixed(0)}`, ['--d' as string]: `${200 + i * 90}ms` }}
            />
          )
        })}

        {points.map(({ area, x, y }, i) => {
          const n = labelNudge[area.slug] ?? {}
          const anchor = n.anchor ?? 'start'
          const active = highlight === area.slug
          return (
            <Link key={area.slug} href={`/service-areas/${area.slug}`} aria-label={`วัสดุก่อสร้าง ${area.name}`}>
              <g className="map-node group cursor-pointer" style={{ ['--d' as string]: `${700 + i * 90}ms` }}>
                <circle cx={x} cy={y} r="14" fill="transparent" />
                <circle
                  cx={x}
                  cy={y}
                  r={active ? 5.5 : 4}
                  fill={active ? '#FF5A1F' : '#F7F6F2'}
                  className="transition-[fill] duration-300 group-hover:fill-[#FF5A1F]"
                />
                <text
                  x={x + (n.dx ?? 8)}
                  y={y + (n.dy ?? 4)}
                  textAnchor={anchor}
                  fontSize="11.5"
                  fontWeight={active ? 700 : 500}
                  fill={active ? '#FF5A1F' : '#F7F6F2'}
                  fillOpacity={active ? 1 : 0.82}
                  className="transition-[fill-opacity] duration-300 group-hover:fill-opacity-100"
                >
                  {area.name}
                </text>
              </g>
            </Link>
          )
        })}

        {/* the shop */}
        <circle r="18" fill="#FF5A1F" fillOpacity="0.18" className="map-pulse" style={{ ['--d' as string]: '400ms' }} />
        <circle r="7.5" fill="#FF5A1F" stroke="#0B0D10" strokeWidth="3" />
        <text y="-16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FF5A1F">
          จงมีชัย · ชักพระ 6
        </text>
      </svg>
    </Reveal>
  )
}
