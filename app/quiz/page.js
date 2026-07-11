'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// ─── Data ──────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'challenge',
    text: 'What is your biggest challenge right now?',
    options: [
      "I don't have enough time",
      "I don't know where to start",
      "I start and stop repeatedly",
      "I'm not seeing results despite training",
    ],
  },
  {
    id: 'background',
    text: 'Which best describes you?',
    options: [
      "I used to train but lost the habit",
      "I've never had a consistent routine",
      "I train but need more structure",
      "I'm completely new to weight training",
    ],
  },
  {
    id: 'goal',
    text: 'What is your main goal?',
    options: [
      'Lose body fat and get lean',
      'Build muscle and strength',
      'Improve energy and performance',
      'Complete body transformation',
    ],
  },
  {
    id: 'days',
    text: 'How many days can you realistically train per week?',
    options: ['2 days', '3 days', '4 days', '5 or more days'],
  },
  {
    id: 'holdback',
    text: 'What has held you back before?',
    options: [
      'Too much conflicting advice',
      'Lack of accountability',
      'No personalised plan',
      'Injury or physical limitations',
    ],
  },
]

const TOTAL_STEPS = 6 // 5 questions + 1 form

const PROGRAMS = {
  pt: {
    name: '1-on-1 Personal Training',
    price: '$100 / week',
    cta: 'Start 1-on-1 Training',
    link: 'https://www.trainerize.me/profile/francisfit/?planGUID=de81efb4d16f4b729760a146eed6726e',
  },
  online: {
    name: 'Online Program',
    price: '$27.95 / week',
    cta: 'Get My Program',
    link: 'https://www.trainerize.me/profile/francisfit/?planGUID=5d2767f1cb5a46e29a535e7a882a81ef',
  },
}

// ─── Logic ─────────────────────────────────────────────────────────────────

function getRecommendation(answers) {
  const { challenge, background, days, holdback } = answers
  const isPT =
    challenge === "I start and stop repeatedly" ||
    (challenge === "I'm not seeing results despite training" &&
      ['3 days', '4 days', '5 or more days'].includes(days)) ||
    background === "I used to train but lost the habit" ||
    days === '5 or more days' ||
    holdback === 'Injury or physical limitations'
  return isPT ? 'pt' : 'online'
}

function getExplanation(answers, rec) {
  const { challenge, holdback, background } = answers
  if (rec === 'pt') {
    if (holdback === 'Injury or physical limitations')
      return "With physical limitations to manage, having Sam's expert eye on every session isn't optional — it's essential. He'll design a program that works around your body, keeps you safe, and makes sure every rep is moving you forward."
    if (challenge === "I start and stop repeatedly")
      return "Your history of starting and stopping tells us one thing: accountability is the missing piece. Regular sessions with Sam mean you show up, you stay consistent, and you finally build the habit that's always slipped away before."
    if (background === "I used to train but lost the habit")
      return "You already know what consistency feels like — you just need the right structure to get back there. Sam will rebuild your routine around your life as it is now, and you'll surprise yourself with how quickly momentum returns."
    if (challenge === "I'm not seeing results despite training")
      return "You're putting in the work but not seeing the return — which means something in your approach needs adjusting. Sam will identify exactly what's holding you back and build a plan that finally makes your effort count."
    return "Based on your answers, you'll get the most from direct, hands-on coaching. Sam will design every session around your specific goal and adapt your program as you grow stronger."
  }
  if (challenge === "I don't know where to start")
    return "If you're not sure where to start, the Online Program cuts through all the noise. You get one clear, structured plan built for your goal — no more overwhelm, just consistent progress week after week."
  if (holdback === 'Too much conflicting advice')
    return "Too much advice is as bad as none at all. The Online Program gives you one definitive plan, built specifically for you — no more second-guessing, just structured, measurable progress."
  if (holdback === 'No personalised plan')
    return "A generic program won't move the needle for you. Your Online Program is built around your goal, your schedule, and your training background — giving you the personalised structure you've been missing."
  if (holdback === 'Lack of accountability')
    return "The Online Program pairs a structured training plan with regular check-ins from Sam — so you always know what to do next and you're never left to figure it out alone."
  return "Based on your answers, you're a great fit for the Online Program. You'll get a fully structured, personalised training plan with the flexibility to train wherever and whenever works for you."
}

// ─── Animation ─────────────────────────────────────────────────────────────

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 56 : -56 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -56 : 56, transition: { duration: 0.22, ease: 'easeIn' } }),
}

// ─── Sub-components ────────────────────────────────────────────────────────

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-white/35 hover:text-white/70 text-sm mb-10 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  )
}

function QuestionStep({ question, selected, onSelect, onBack, direction }) {
  return (
    <motion.div custom={direction} variants={slide} initial="enter" animate="center" exit="exit">
      {onBack && <BackButton onClick={onBack} />}

      <h1
        className="font-black leading-[1.05] tracking-tight mb-10"
        style={{ fontSize: 'clamp(30px, 5vw, 52px)', letterSpacing: '-0.04em' }}
      >
        {question.text}
      </h1>

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`w-full text-left px-6 py-5 rounded-2xl border text-base font-medium transition-all duration-200 ${
              selected === opt
                ? 'border-white bg-white text-black'
                : 'border-white/15 bg-white/[0.03] text-white hover:border-white/35 hover:bg-white/[0.06]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function FormStep({ name, email, setName, setEmail, onSubmit, onBack, submitting, direction }) {
  const inputCls =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors'

  return (
    <motion.div custom={direction} variants={slide} initial="enter" animate="center" exit="exit">
      <BackButton onClick={onBack} />

      <div className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Almost there</div>
      <h1
        className="font-black leading-[1.05] tracking-tight mb-3"
        style={{ fontSize: 'clamp(30px, 5vw, 52px)', letterSpacing: '-0.04em' }}
      >
        Where should we send your result?
      </h1>
      <p className="text-white/45 text-base mb-10">
        Sam will personally reach out to discuss your program.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="First name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Loading…' : 'Show my result →'}
        </button>
      </form>
    </motion.div>
  )
}

function ResultStep({ name, rec, program, explanation, direction }) {
  const firstName = name.trim().split(' ')[0]

  return (
    <motion.div custom={direction} variants={slide} initial="enter" animate="center" exit="exit">
      <div className="font-mono text-xs text-white/35 uppercase tracking-widest mb-6">Your result</div>

      {firstName && (
        <p className="text-white/50 text-lg mb-2">Hi {firstName},</p>
      )}

      <h1
        className="font-black leading-[0.95] tracking-tight mb-4"
        style={{ fontSize: 'clamp(36px, 7vw, 72px)', letterSpacing: '-0.05em' }}
      >
        {program.name}
      </h1>

      <div className="font-mono text-sm text-white/40 uppercase tracking-widest mb-8">{program.price}</div>

      <p className="text-white/70 text-lg leading-[1.7] mb-10 max-w-xl">{explanation}</p>

      <a
        href={program.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full sm:w-auto text-center px-10 py-4 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:translate-y-[-2px]"
      >
        {program.cta}
      </a>

      <div className="border-t border-white/10 my-12" />

      {/* 12 Week option */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
        <div className="font-mono text-xs text-white/35 uppercase tracking-widest mb-3">
          Not sure yet? Start here
        </div>
        <h3
          className="font-black tracking-tight mb-1"
          style={{ fontSize: 'clamp(22px, 3vw, 28px)', letterSpacing: '-0.03em' }}
        >
          12 Week Coaching Introduction
        </h3>
        <div className="font-mono text-sm text-white/35 uppercase tracking-widest mb-5">$199 one-off</div>
        <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
          A focused 12-week block to establish your foundation, build the habit, and prove to yourself what consistent training can do.
        </p>
        <a
          href="https://calendly.com/pavethewayfit/30min"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => typeof window.gtag_report_conversion === 'function' && window.gtag_report_conversion('https://calendly.com/pavethewayfit/30min')}
          className="inline-block px-8 py-3 rounded-full border border-white/20 bg-white/5 text-white text-sm font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/35"
        >
          Book a Free Call
        </a>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="text-white/25 text-sm hover:text-white/55 transition-colors">
          ← Back to Pave The Way
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [step, setStep] = useState(0)       // 0–4: questions, 5: form, 6: result
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function advance() {
    setDirection(1)
    setStep((s) => s + 1)
  }

  function goBack() {
    setDirection(-1)
    setStep((s) => Math.max(0, s - 1))
  }

  function selectOption(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    advance()
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const rec = getRecommendation(answers)
    try {
      const body = new FormData()
      body.append('First Name', name)
      body.append('Email', email)
      body.append('_replyto', email)
      body.append('Biggest Challenge', answers.challenge || '')
      body.append('Training Background', answers.background || '')
      body.append('Main Goal', answers.goal || '')
      body.append('Days Per Week', answers.days || '')
      body.append('Held Back By', answers.holdback || '')
      body.append('Recommended Program', rec === 'pt' ? '1-on-1 Personal Training' : 'Online Program')
      body.append('Source', 'Quiz Funnel')
      await fetch('https://formspree.io/f/xykqkqer', {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })
    } catch {
      // proceed to result regardless
    }
    setSubmitting(false)
    advance()
  }

  const isResult = step === 6
  const rec = isResult ? getRecommendation(answers) : null
  const program = rec ? PROGRAMS[rec] : null
  const progressPct = Math.min(((step + 1) / TOTAL_STEPS) * 100, 100)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Header */}
      <header
        className="flex items-center justify-between h-20 shrink-0"
        style={{ paddingLeft: 'clamp(22px, 5vw, 72px)', paddingRight: 'clamp(22px, 5vw, 72px)' }}
      >
        <Link href="/">
          <Image
            src="/images/Pavetheway_Final_White.png"
            alt="Pave The Way"
            width={140}
            height={52}
            className="object-contain"
            priority
          />
        </Link>
        {!isResult && (
          <span className="font-mono text-xs text-white/35 uppercase tracking-widest">
            {step < 5 ? `Question ${step + 1} of ${TOTAL_STEPS}` : 'Final step'}
          </span>
        )}
      </header>

      {/* Progress bar */}
      {!isResult && (
        <div className="h-px bg-white/10 shrink-0">
          <motion.div
            className="h-full bg-white"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            {step < 5 && (
              <QuestionStep
                key={step}
                direction={direction}
                question={QUESTIONS[step]}
                selected={answers[QUESTIONS[step].id]}
                onSelect={(val) => selectOption(QUESTIONS[step].id, val)}
                onBack={step > 0 ? goBack : null}
              />
            )}

            {step === 5 && (
              <FormStep
                key="form"
                direction={direction}
                name={name}
                email={email}
                setName={setName}
                setEmail={setEmail}
                onSubmit={handleFormSubmit}
                onBack={goBack}
                submitting={submitting}
              />
            )}

            {step === 6 && (
              <ResultStep
                key="result"
                direction={direction}
                name={name}
                rec={rec}
                program={program}
                explanation={getExplanation(answers, rec)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
