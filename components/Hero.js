'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'

const partnerLogos = ['WHOOP', 'OURA', 'STRAVA']
const features = [
  { num: '01', label: 'Personal insight' },
  { num: '02', label: 'Daily readiness' },
  { num: '03', label: 'Guided recovery' },
  { num: '04', label: 'Adaptive plans' },
]

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
        backgroundImage: 'url(https://playground.bravebrand.com/assets/backgrounds/orb-wellness-partner-background.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay Gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(5,5,5,.88), rgba(5,5,5,.46) 44%, rgba(5,5,5,.22)), linear-gradient(180deg, rgba(5,5,5,.58), transparent 52%, rgba(5,5,5,.82))',
        }}
      />

      {/* Radial Glow Accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 72% 44%, rgba(59,184,255,.18), transparent 24%), radial-gradient(circle at 58% 64%, rgba(255,115,55,.18), transparent 20%)',
        }}
      />

      {/* Content */}
      <div className="relative z-20 min-h-[calc(100vh-88px)] grid grid-cols-1 lg:grid-cols-2 items-center gap-8 px-clamp(22px,5vw,72px) py-16 lg:py-0" style={{
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
            className="font-mono text-xs font-semibold tracking-widest uppercase text-accent-yellow mb-4"
          >
            Personal wellness intelligence
          </motion.div>

          <motion.h1
            variants={shouldReduceMotion ? {} : itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.86] tracking-tight mb-6"
            style={{
              fontSize: 'clamp(58px, 8vw, 128px)',
              letterSpacing: '-0.07em',
            }}
          >
            Meet your new wellness partner
          </motion.h1>

          <motion.p
            variants={shouldReduceMotion ? {} : itemVariants}
            className="max-w-lg text-lg text-text-muted leading-[1.65] mb-8"
          >
            A cinematic health-tech experience that turns daily signals into calm, useful guidance for recovery, readiness and long-term performance.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={shouldReduceMotion ? {} : itemVariants}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link
              href="#"
              className="px-6 py-4 rounded-full bg-white text-dark-900 font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_34px_rgba(59,184,255,0.18)] hover:translate-y-[-2px]"
            >
              Join Now
            </Link>
            <Link
              href="#"
              className="px-6 py-4 rounded-full border border-white/15 bg-black/25 backdrop-blur-lg text-white text-sm transition-all duration-300 hover:shadow-[0_0_34px_rgba(59,184,255,0.18)] hover:translate-y-[-2px]"
            >
              View Insights
            </Link>
          </motion.div>

          {/* Partner Logos */}
          <motion.div
            variants={shouldReduceMotion ? {} : itemVariants}
            className="flex gap-8 text-text-muted font-black text-xs tracking-widest uppercase"
          >
            {partnerLogos.map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Feature Rail */}
      <motion.div
        className="absolute bottom-7 left-clamp(22px,5vw,72px) right-clamp(22px,5vw,72px) z-30 grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-white/20 pt-4"
        style={{
          left: 'clamp(22px, 5vw, 72px)',
          right: 'clamp(22px, 5vw, 72px)',
        }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.5,
            },
          },
        }}
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            className="text-xs text-text-muted"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6 },
              },
            }}
          >
            <div className="font-black text-accent-yellow mb-1">{feature.num}</div>
            <div>{feature.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
