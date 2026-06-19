'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const PX = { paddingLeft: 'clamp(22px, 5vw, 72px)', paddingRight: 'clamp(22px, 5vw, 72px)' }

function FadeUp({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function PhotoLabel({ label }) {
  return (
    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 font-mono text-[10px] tracking-widest uppercase text-white/80">
      {label}
    </div>
  )
}

function CoachButton({ videoKey, activeVideo, onToggle }) {
  const isActive = activeVideo === videoKey
  return (
    <button
      onClick={() => onToggle(videoKey)}
      className={`absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all duration-200 ${
        isActive
          ? 'bg-white text-black border-white'
          : 'bg-black/60 text-white border-white/20 hover:bg-black/80 hover:border-white/40'
      }`}
    >
      {isActive ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
        </svg>
      )}
      {isActive ? 'Mute' : 'Hear me coach'}
    </button>
  )
}

export default function SpotlightPage() {
  const [activeVideo, setActiveVideo] = useState(null)
  const damoChestRef = useRef(null)
  const paulShoulderRef = useRef(null)
  const paulDeadliftRef = useRef(null)

  function toggleCoach(key) {
    const allRefs = {
      damoChest: damoChestRef,
      paulShoulder: paulShoulderRef,
      paulDeadlift: paulDeadliftRef,
    }
    const isActive = activeVideo === key
    Object.entries(allRefs).forEach(([k, ref]) => {
      if (ref.current) ref.current.muted = isActive ? true : k !== key
    })
    setActiveVideo(isActive ? null : key)
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── Navigation bar ── */}
      <div className="flex items-center justify-between h-20 border-b border-white/10" style={PX}>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>
        <Image
          src="/images/Pavetheway_Final_White.png"
          alt="Pave The Way"
          width={130}
          height={48}
          className="object-contain"
          priority
        />
        <a
          href="https://calendly.com/pavethewayfit/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block px-5 py-2.5 text-xs rounded-full bg-white text-black font-semibold transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] hover:translate-y-[-1px]"
        >
          Book Consultation
        </a>
      </div>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden text-center"
        style={{ ...PX, paddingTop: 'clamp(72px, 12vw, 160px)', paddingBottom: 'clamp(72px, 12vw, 160px)', minHeight: '100vh', background: '#000' }}
      >
        <style>{`
          @keyframes hudPulse {
            0%, 100% { opacity: 0.12; }
            50% { opacity: 0.28; }
          }
        `}</style>

        {/* Background image */}
        <Image
          src="/images/IMG_4492.JPG"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: 'brightness(0.55) contrast(1.1)', objectPosition: '50% 38%' }}
        />

        {/* Scanline grid overlay */}
        <div style={{
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 64px), repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 64px)',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Gradient overlay */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.9) 100%)',
          position: 'absolute',
          inset: 0,
          zIndex: 2,
        }} />

        {/* Radial vignette */}
        <div style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
          position: 'absolute',
          inset: 0,
          zIndex: 2,
        }} />

        {/* Pulsing top border line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(247,247,239,0.18)',
          zIndex: 5,
          animation: 'hudPulse 4s ease-in-out infinite',
        }} />

        {/* HUD corner labels */}
        <div style={{ position: 'absolute', top: '28px', left: 'clamp(24px,5vw,72px)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,247,239,0.35)', zIndex: 5 }}>
          Client Spotlight · Pave The Way
        </div>
        <div style={{ position: 'absolute', top: '28px', right: 'clamp(24px,5vw,72px)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,247,239,0.35)', zIndex: 5 }}>
          Est. 2014 · Sydney, Australia
        </div>
        <div style={{ position: 'absolute', bottom: '80px', left: 'clamp(24px,5vw,72px)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,247,239,0.35)', zIndex: 5 }}>
          Strong Body · Strong Mind
        </div>
        <div style={{ position: 'absolute', bottom: '80px', right: 'clamp(24px,5vw,72px)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(247,247,239,0.35)', zIndex: 5 }}>
          Sam Francis · Head Coach
        </div>

        {/* Hero text — sits above all overlays */}
        <div className="relative" style={{ zIndex: 6 }}>
          <FadeUp>
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-white/35 mb-6">
              Client Spotlight
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1
              className="font-black leading-[0.88] mx-auto mb-8"
              style={{ fontSize: 'clamp(60px, 11vw, 148px)', letterSpacing: '-0.06em', maxWidth: '14ch' }}
            >
              Fit into their 50s
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-lg md:text-xl text-white/55 leading-relaxed max-w-xl mx-auto">
              Two men. Two journeys. One decision that changed everything. This is what showing up, week after week, actually looks like.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Intro statement ── */}
      <FadeUp>
        <div
          className="border-t border-b border-white/10 py-14 text-center"
          style={PX}
        >
          <p
            className="font-black leading-tight mx-auto"
            style={{ fontSize: 'clamp(20px, 3.2vw, 40px)', letterSpacing: '-0.04em', maxWidth: '34ch' }}
          >
            No shortcuts. No quick fixes. Just two men who decided their best years{' '}
            <span style={{ color: 'rgba(255,255,255,0.38)', fontStyle: 'italic', fontWeight: 400 }}>were not behind them</span>
            {' '}and did the work to prove it.
          </p>
        </div>
      </FadeUp>

      {/* ════════════════════════════
          CHAPTER ONE — DAMO
      ════════════════════════════ */}
      <section style={{ ...PX, paddingTop: 'clamp(56px, 8vw, 112px)' }}>

        {/* Chapter heading with watermark */}
        <FadeUp className="relative mb-14">
          <span
            className="absolute -top-4 left-0 font-black text-white/[0.038] select-none pointer-events-none leading-none"
            style={{ fontSize: 'clamp(96px, 17vw, 210px)', letterSpacing: '-0.06em' }}
            aria-hidden="true"
          >
            01
          </span>
          <div className="relative z-10">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/35 mb-3">
              1-on-1 Personal Training · Fit Into His 50s
            </p>
            <h2
              className="font-black leading-none"
              style={{ fontSize: 'clamp(44px, 7vw, 92px)', letterSpacing: '-0.055em' }}
            >
              Damo
            </h2>
          </div>
        </FadeUp>

        {/* Split 1 — Before photo | Story text */}
        <FadeUp className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start mb-10 md:mb-14">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
            <PhotoLabel label="Before" />
            <Image
              src="/images/Damo before PT.PNG"
              alt="Damo before transformation"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center md:pt-10">
            <p className="drop-cap text-base md:text-lg text-white/60 leading-[1.8]">
              Damo knew something had to change. Post-covid weight had crept on and his body no longer reflected how he felt inside. He'd been active in his younger years, but somewhere along the way, between work and life, he'd lost the habit and the drive to prioritise himself. He reached out to me with no real expectations. He wanted to give it a few months and see how it went. I told him on that first call that I thought he'd love it and want to do more. I was right. Once the results started coming, the months flew by. What began as two or three sessions a week grew into a complete lifestyle shift, a dialled-in diet and a genuine love for living well. Damo hasn't looked back since.
            </p>
          </div>
        </FadeUp>

        {/* Split 2 — Story text | After photo */}
        <FadeUp className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start mb-10 md:mb-14">
          <div className="flex flex-col justify-center order-2 md:order-1 md:pt-10">
            <p className="text-base md:text-lg text-white/60 leading-[1.8]">
              Eighteen months on, Damo trains five days a week. Three weight sessions with me and two cardio sessions on his own. Training is no longer something he fits around life. It's part of it. What I love about working with Damo is watching how he embraces the hard moments. He doesn't shy away from the discomfort, he's learned to welcome it. That shift in mindset is what separates people who transform from people who just try.
            </p>
          </div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden order-1 md:order-2">
            <PhotoLabel label="Now" />
            <Image
              src="/images/Damo spotlight after.jpg"
              alt="Damo after transformation"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </FadeUp>

        {/* Damo video — full width */}
        <FadeUp className="mb-10 md:mb-14">
          <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(420px, 65vh, 760px)' }}>
          <video
            ref={damoChestRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/Damo_chest_press.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <CoachButton videoKey="damoChest" activeVideo={activeVideo} onToggle={toggleCoach} />
          </div>
        </FadeUp>

        {/* Damo pull quote */}
        <FadeUp
          className="pb-20 md:pb-28"
        >
          <blockquote className="pull-quote border-l-2 border-white/15 pl-8 max-w-3xl">
            <p
              className="font-black leading-snug mb-5 text-white/85"
              style={{ fontSize: 'clamp(20px, 2.8vw, 34px)', letterSpacing: '-0.03em' }}
            >
              "Once he started seeing results the months flew by. Training became a priority and then a non-negotiable part of who he is."
            </p>
            <cite className="font-mono text-xs tracking-[0.2em] uppercase text-white/35 not-italic">
              — Sam Francis
            </cite>
          </blockquote>
        </FadeUp>

      </section>

      {/* ── Angled chapter divider ── */}
      <div className="relative h-20 my-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-white/[0.028]"
          style={{ clipPath: 'polygon(0 15%, 100% 0%, 100% 85%, 0% 100%)' }}
        />
      </div>

      {/* ════════════════════════════
          CHAPTER TWO — PAUL
      ════════════════════════════ */}
      <section
        style={{
          ...PX,
          paddingTop: 'clamp(48px, 7vw, 96px)',
          paddingBottom: 'clamp(72px, 10vw, 128px)',
        }}
      >

        {/* Chapter heading with watermark */}
        <FadeUp className="relative mb-14">
          <span
            className="absolute -top-4 left-0 font-black text-white/[0.038] select-none pointer-events-none leading-none"
            style={{ fontSize: 'clamp(96px, 17vw, 210px)', letterSpacing: '-0.06em' }}
            aria-hidden="true"
          >
            02
          </span>
          <div className="relative z-10">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/35 mb-3">
              1-on-1 Personal Training · A Legacy Built in the Gym
            </p>
            <h2
              className="font-black leading-none"
              style={{ fontSize: 'clamp(44px, 7vw, 92px)', letterSpacing: '-0.055em' }}
            >
              Paul
            </h2>
          </div>
        </FadeUp>

        {/* Split — Before photo (rotated) | Story text */}
        <FadeUp className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start mb-10 md:mb-14">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
            <PhotoLabel label="Before" />
            <Image
              src="/images/paul_before.JPG"
              alt="Paul before transformation"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center md:pt-10">
            <p className="drop-cap text-base md:text-lg text-white/60 leading-[1.8]">
              Paul started training with me in August 2024 for a reason that had nothing to do with aesthetics. He'd watched his father age badly, becoming frail, weak and unable to do simple things on his own. That image stayed with him and eventually became the reason he picked up the phone. He came in as a complete beginner, stiff, achey and unsure of himself in the gym. My focus from day one was technique, learning to move properly before anything else. Paul committed to two sessions a week and never missed one. He'd often go home and practise the movements I'd shown him. The progress came slowly at first and then all at once. His body composition changed, his strength shot up and the movements that had once felt impossible became second nature. He cleaned up his diet, cut back on alcohol and arrived at every session ready to work. The sessions never got easier. He never asked them to.
            </p>
          </div>
        </FadeUp>

        {/* Two training videos side by side */}
        <FadeUp className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-14">
          {/* Shoulder press */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ height: 'clamp(360px, 55vh, 680px)' }}
          >
            <video
              ref={paulShoulderRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/Paul_Shoulder_press.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <CoachButton videoKey="paulShoulder" activeVideo={activeVideo} onToggle={toggleCoach} />
          </div>
          {/* Deadlift */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ height: 'clamp(360px, 55vh, 680px)' }}
          >
            <video
              ref={paulDeadliftRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/Paul_Deadlift.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <CoachButton videoKey="paulDeadlift" activeVideo={activeVideo} onToggle={toggleCoach} />
          </div>
        </FadeUp>

        {/* Paul pull quote */}
        <FadeUp>
          <blockquote className="pull-quote border-l-2 border-white/15 pl-8 max-w-3xl">
            <p
              className="font-black leading-snug mb-5 text-white/85"
              style={{ fontSize: 'clamp(20px, 2.8vw, 34px)', letterSpacing: '-0.03em' }}
            >
              "The sessions never got easier. But Paul never stopped coming. He walked out exhausted every single time and came back the next week ready to go again."
            </p>
            <cite className="font-mono text-xs tracking-[0.2em] uppercase text-white/35 not-italic">
              — Sam Francis
            </cite>
          </blockquote>
        </FadeUp>

      </section>

      {/* ── CTA ── */}
      <FadeUp>
        <section
          className="border-t border-white/10 text-center"
          style={{ ...PX, paddingTop: 'clamp(72px, 10vw, 128px)', paddingBottom: 'clamp(72px, 10vw, 128px)' }}
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/35 mb-6">
            Next Steps
          </p>
          <h2
            className="font-black leading-tight mx-auto mb-6"
            style={{ fontSize: 'clamp(36px, 6vw, 82px)', letterSpacing: '-0.055em', maxWidth: '16ch' }}
          >
            How can I help you?
          </h2>
          <p className="text-lg text-white/55 max-w-lg mx-auto mb-10 leading-relaxed">
            Take the 60-second quiz and I will point you to exactly the right place to start, wherever you are right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:translate-y-[-2px]"
            >
              Take the quiz
            </Link>
            <a
              href="https://calendly.com/pavethewayfit/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              Book a free consultation
            </a>
          </div>
        </section>
      </FadeUp>

    </main>
  )
}
