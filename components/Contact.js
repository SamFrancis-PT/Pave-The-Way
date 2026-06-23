'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors'

const selectClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer'

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'success' | 'error'

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('https://formspree.io/f/xkolgnyk', {
        method: 'POST',
        body: new FormData(e.target),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        e.target.reset()
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      ref={ref}
      id="contact"
      style={{
        paddingLeft: 'clamp(22px, 5vw, 72px)',
        paddingRight: 'clamp(22px, 5vw, 72px)',
        paddingTop: 'clamp(58px, 8vw, 112px)',
        paddingBottom: 'clamp(58px, 8vw, 112px)',
      }}
    >
      <motion.h2
        className="font-black leading-[0.9] tracking-tight mb-4 max-w-2xl"
        style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '-0.065em' }}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        Start Your Journey
      </motion.h2>

      <motion.p
        className="text-white/60 text-lg mb-12 max-w-xl"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        Fill in your details below and Sam will be in touch to discuss your goals and how we can work together.
      </motion.p>

      {status === 'success' ? (
        <motion.p
          className="text-white text-lg max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Thanks for reaching out. Sam will be in touch shortly.
        </motion.p>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-2xl space-y-4"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={itemVariants}
        >
          <input type="hidden" name="_replyto" value={email} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              required
              className={inputClass}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              required
              className={inputClass}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className={inputClass}
          />

          <div className="relative">
            <select name="goal" required className={selectClass} defaultValue="">
              <option value="" disabled className="bg-black">Goal</option>
              <option value="Lose Body Fat" className="bg-black">Lose Body Fat</option>
              <option value="Build Muscle" className="bg-black">Build Muscle</option>
              <option value="Improve Fitness" className="bg-black">Improve Fitness</option>
              <option value="General Health" className="bg-black">General Health</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select name="training_experience" required className={selectClass} defaultValue="">
              <option value="" disabled className="bg-black">Training Experience</option>
              <option value="Beginner" className="bg-black">Beginner</option>
              <option value="Intermediate" className="bg-black">Intermediate</option>
              <option value="Advanced" className="bg-black">Advanced</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-sm">
              Something went wrong. Please email{' '}
              <a href="mailto:sam@pavethewayfit.com" className="underline">
                sam@pavethewayfit.com
              </a>{' '}
              directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Sending…' : 'Send Enquiry'}
          </button>
        </motion.form>
      )}
    </section>
  )
}
