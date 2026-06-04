'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

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
  const [muted, setMuted] = useState(true)
  const videoRef = useRef(null)

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setMuted(videoRef.current.muted)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/hero-reel.mp4" type="video/mp4" />
        <source src="/hero-reel.MOV" type="video/quicktime" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />

      {/* Content */}
      <div
        className="relative z-20 min-h-[calc(100vh-88px)] grid grid-cols-1 lg:grid-cols-2 items-center gap-8"
        style={{
          paddingLeft: 'clamp(22px, 5vw, 72px)',
          paddingRight: 'clamp(22px, 5vw, 72px)',
          paddingTop: 'clamp(28px, 6vw, 86px)',
          paddingBottom: '150px',
        }}
      >
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
            className="font-black leading-[0.9] tracking-tight mb-6"
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

      {/* Mute / unmute button */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-8 right-8 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:border-white/40"
      >
        {muted ? (
          // Speaker muted icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
          </svg>
        ) : (
          // Speaker with sound icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
          </svg>
        )}
      </button>
    </section>
  )
}
