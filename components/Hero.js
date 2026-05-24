'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay Gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 72% 44%, rgba(255,255,255,.08), transparent 24%), radial-gradient(circle at 58% 64%, rgba(255,255,255,.05), transparent 20%)',
        }}
      />

      {/* Content */}
      <div className="relative z-20 min-h-[calc(100vh-88px)] grid grid-cols-1 lg:grid-cols-2 items-center gap-8 py-16 lg:py-0" style={{
        paddingLeft: 'clamp(22px, 5vw, 72px)',
        paddingRight: 'clamp(22px, 5vw, 72px)',
        paddingTop: 'clamp(28px, 6vw, 86px)',
        paddingBottom: '150px',
      }}>
        <motion.div
          className="max-w-2xl"
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={shouldReduceMotion ? {} : itemVariants}
            className="font-mono text-xs font-semibold tracking-widest uppercase text-white/60 mb-4"
          >
            Personal Training for Busy Professionals
          </motion.div>

          <motion.h1
            variants={shouldReduceMotion ? {} : itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6"
            style={{
              fontSize: 'clamp(52px, 8vw, 120px)',
              letterSpacing: '-0.05em',
            }}
          >
            Pave The Way to a Stronger You
          </motion.h1>

          <motion.p
            variants={shouldReduceMotion ? {} : itemVariants}
            className="max-w-xl text-lg text-white/70 leading-[1.65] mb-8"
          >
            Build a stronger body and stronger mind through expert 1-on-1 coaching. Designed for ambitious men aged 35-50 ready to transform their lives through strength training, nutrition, and disciplined consistency.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={shouldReduceMotion ? {} : itemVariants}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link
              href="#consultation"
              className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:translate-y-[-2px]"
            >
              Book Free Consultation
            </Link>
            <Link
              href="#services"
              className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-lg text-white text-sm transition-all duration-300 hover:bg-white/10"
            >
              View Services
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={shouldReduceMotion ? {} : itemVariants}
            className="flex gap-8 text-white/80 font-semibold text-sm"
          >
            <div>
              <div className="text-2xl font-black text-white">10+</div>
              <div>Years Experience</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">100s</div>
              <div>Clients Transformed</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}