'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const navLinks = ['About', 'Services', 'Transformations', 'Contact']

export default function Navigation() {
  const [activeLink, setActiveLink] = motion.useState(0)

  return (
    <nav className="relative z-50 h-20 flex items-center justify-between" style={{
      paddingLeft: 'clamp(22px, 5vw, 72px)',
      paddingRight: 'clamp(22px, 5vw, 72px)',
    }}>
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-black font-black text-sm">PTW</span>
        </div>
        <div className="text-xl font-black tracking-tight">Pave The Way</div>
      </div>

      {/* Links - Hidden on mobile */}
      <div className="hidden md:flex gap-2 p-2 rounded-full bg-black/30 backdrop-blur-lg border border-white/10">
        {navLinks.map((link, idx) => (
          <button
            key={link}
            onClick={() => setActiveLink(idx)}
            className={`text-xs px-3.5 py-2 rounded-full transition-all ${
              activeLink === idx
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {link}
          </button>
        ))}
      </div>

      {/* CTA Button */}
      <Link
        href="#consultation"
        className="px-6 py-3 text-xs rounded-full bg-white text-black font-semibold transition-all duration-300 hover:shadow-[0_0_34px_rgba(255,255,255,0.3)] hover:translate-y-[-2px]"
      >
        Book Consultation
      </Link>
    </nav>
  )
}