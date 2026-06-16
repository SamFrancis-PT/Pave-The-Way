'use client'

import { useState } from 'react'
import Image from 'next/image'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Transformations', href: '#transformations' },
  { label: 'Spotlight', href: '/spotlight' },
  { label: 'Contact', href: '#consultation' },
]

export default function Navigation() {
  const [activeLink, setActiveLink] = useState(0)

  return (
    <nav className="relative z-50 h-20 flex items-center justify-between" style={{
      paddingLeft: 'clamp(22px, 5vw, 72px)',
      paddingRight: 'clamp(22px, 5vw, 72px)',
    }}>
      {/* Brand */}
      <div className="flex items-center">
        <Image
          src="/images/Pavetheway_Final_White.png"
          alt="Pave The Way"
          width={160}
          height={60}
          className="object-contain"
          priority
        />
      </div>

      {/* Links - Hidden on mobile */}
      <div className="hidden md:flex gap-2 p-2 rounded-full bg-black/30 backdrop-blur-lg border border-white/10">
        {navLinks.map((link, idx) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setActiveLink(idx)}
            className={`text-xs px-3.5 py-2 rounded-full transition-all ${
              activeLink === idx
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* CTA Button */}
      <a
        href="https://calendly.com/pavethewayfit/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 text-xs rounded-full bg-white text-black font-semibold transition-all duration-300 hover:shadow-[0_0_34px_rgba(255,255,255,0.3)] hover:translate-y-[-2px]"
      >
        Book Consultation
      </a>
    </nav>
  )
}
