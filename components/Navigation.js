'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const navLinks = ['Home', 'Health', 'Insights', 'Pricing']

export default function Navigation() {
  const [activeLink, setActiveLink] = motion.useState(0)

  return (
    <nav className="relative z-50 h-88 flex items-center justify-between px-clamp(22px,5vw,72px)" style={{
      paddingLeft: 'clamp(22px, 5vw, 72px)',
      paddingRight: 'clamp(22px, 5vw, 72px)',
    }}>
      {/* Brand */}
      <div className="text-2xl font-black tracking-tight">
        Exploration
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

      {/* Auth Buttons */}
      <div className="flex gap-2.5">
        <Link
          href="#"
          className="hidden md:inline-flex px-5 py-3 text-xs rounded-full border border-white/15 bg-black/25 backdrop-blur-lg text-white hover:text-accent-blue transition-all duration-300 hover:shadow-[0_0_34px_rgba(59,184,255,0.18)] hover:translate-y-[-2px]"
        >
          Sign in
        </Link>
        <Link
          href="#"
          className="px-5 py-3 text-xs rounded-full bg-white text-dark-900 font-semibold transition-all duration-300 hover:shadow-[0_0_34px_rgba(59,184,255,0.18)] hover:translate-y-[-2px]"
        >
          Join Now
        </Link>
      </div>
    </nav>
  )
}
