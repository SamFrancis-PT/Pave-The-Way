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
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLinkClick(idx) {
    setActiveLink(idx)
    setMenuOpen(false)
  }

  return (
    <>
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

        {/* Links — desktop only */}
        <div className="hidden md:flex gap-2 p-2 rounded-full bg-black/30 backdrop-blur-lg border border-white/10">
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => handleLinkClick(idx)}
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

        {/* Right side: hamburger on mobile, CTA on all sizes */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-5 h-px bg-white transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-px bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-white transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>

          {/* CTA */}
          <a
            href="https://calendly.com/pavethewayfit/30min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => typeof window.gtag_report_conversion === 'function' && window.gtag_report_conversion('https://calendly.com/pavethewayfit/30min')}
            className="px-6 py-3 text-xs rounded-full bg-white text-black font-semibold transition-all duration-300 hover:shadow-[0_0_34px_rgba(255,255,255,0.3)] hover:translate-y-[-2px]"
          >
            Book Consultation
          </a>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 z-40 bg-black/95 backdrop-blur-lg border-b border-white/10">
          <div className="flex flex-col py-4" style={{ paddingLeft: 'clamp(22px, 5vw, 72px)', paddingRight: 'clamp(22px, 5vw, 72px)' }}>
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(idx)}
                className={`py-4 text-sm font-semibold border-b border-white/8 transition-colors ${
                  activeLink === idx ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
