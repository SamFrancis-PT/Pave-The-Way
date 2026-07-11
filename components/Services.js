'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const services = [
  {
    title: '1-on-1 Personal Training',
    price: '$100/week',
    description: 'In-person coaching with expert form correction and personalised guidance.',
    features: [
      'Weekly in-person PT session',
      'Customised training programs',
      'Pave The Way app access',
      'Nutritional guidance included',
      'Progress tracking & photos',
      'Personal best notifications',
    ],
    highlight: true,
    url: 'https://www.trainerize.me/profile/pavethewaypt/?planGUID=de81efb4d16f4b729760a146eed6726e',
  },
  {
    title: 'Online Program',
    price: '$27.95/week',
    description: 'A fully customised training program built around your schedule, goals and experience level. These are the exact programs that have produced the transformations you see on this page.',
    features: [
      '3, 4 or 5 day weight training programs to suit your schedule',
      'Sessions 45–60 minutes',
      'Beginner to advanced programs',
      'Pave The Way app access',
      'Exercise video library',
      'Nutritional guidance included',
      'Progress tracking & personal bests',
      'Accountability tools to keep you on track',
      'Direct feedback on your training',
    ],
    highlight: false,
    url: 'https://www.trainerize.me/profile/pavethewaypt/?planGUID=7d3bd9e29b7149a0820dcfd21d66c7d2',
  },
  {
    title: '12 Week Coaching Introduction',
    price: '$199',
    tag: 'Best Value · Save 40%',
    description: 'Work online with Sam, with access to the Pave The Way app built on the same programming methods that produced every transformation you see on this page. Remove the guesswork utilising a method that is proven to work. Commit to 12 weeks across four progressive blocks, each one building on the last. This is where foundations are built and journeys begin.',
    features: [
      'Fully customised 12 week progressive training program',
      'Structured to build volume, intensity and training days across each block',
      'Sessions 45 to 60 minutes — built for busy professionals',
      'Pave The Way app access with exercise video library',
      'Nutritional guidance and high protein framework',
      'Progress tracking and personal bests',
      'In-app feedback from Sam',
      'Accountability tools throughout the 12 weeks',
    ],
    savingsNote: 'Save 40% compared to the weekly rate — that is $136 off',
    guarantee: 'Show up to every session and follow the nutrition guidance for 6 weeks. If you\'re not seeing progress, contact me in the app and I will give you a complete refund.',
    bestValue: true,
    ctaText: 'Start Your 12 Weeks',
    url: 'https://www.trainerize.me/profile/pavethewaypt/?planGUID=c6fb36b0afe84f229806168a480832f8',
  },
]

const appFeatures = [
  {
    title: 'Exercise Videos',
    description: 'Detailed video demonstrations for every exercise in your program.',
  },
  {
    title: 'Progress Tracking',
    description: 'Real-time data collection tracking your improvements and personal bests.',
  },
  {
    title: 'Personal Bests',
    description: 'Automatic notifications celebrating your achievements and PRs.',
  },
  {
    title: 'Nutrition Guidance',
    description: 'Integrated nutrition coaching to optimise your results.',
  },
  {
    title: 'Accountability',
    description: 'Stay on track with built-in accountability tools to keep you consistent.',
  },
  {
    title: 'In-App Feedback',
    description: 'Receive direct feedback on your training from Sam to ensure you are always progressing.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function Services() {
  const ref = useRef(null)
  // Use 'some' so the reveal fires as soon as any part of the section enters
  // the viewport. A percentage threshold (e.g. 0.2) can never be met on mobile
  // where the stacked cards make the section taller than the viewport, which
  // would leave the whole section stuck at opacity 0 (invisible).
  const inView = useInView(ref, { once: true, amount: 'some' })

  return (
    <section
      ref={ref}
      id="services"
      className="bg-gradient-to-b from-black/50 to-black py-24 md:py-32"
      style={{
        paddingLeft: 'clamp(22px, 5vw, 72px)',
        paddingRight: 'clamp(22px, 5vw, 72px)',
        paddingTop: 'clamp(58px, 8vw, 112px)',
        paddingBottom: 'clamp(58px, 8vw, 112px)',
      }}
    >
      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tight mb-4 max-w-4xl"
        style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          letterSpacing: '-0.065em',
        }}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        Coaching Services
      </motion.h2>

      <motion.p
        className="text-white/60 text-lg mb-16 max-w-2xl"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        Choose the coaching style that fits your lifestyle. All programs include access to the Pave The Way app with exercise videos, nutrition guidance, and progress tracking.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className={`relative rounded-2xl p-8 border transition-all duration-300 ${
              service.bestValue
                ? 'border-amber-400/60 bg-white/8 backdrop-blur-sm'
                : service.highlight
                ? 'border-white/30 bg-white/8 backdrop-blur-sm'
                : 'border-white/10 bg-white/3'
            }`}
            style={
              service.bestValue
                ? { boxShadow: '0 0 0 1px rgba(251,191,36,0.2), 0 8px 32px rgba(251,191,36,0.08)' }
                : undefined
            }
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            {service.tag && (
              <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-400/15 text-amber-300 border border-amber-400/30">
                {service.tag}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-black mb-2">{service.title}</h3>
              <div className="text-3xl font-black text-white mb-3">{service.price}</div>
              <p className="text-white/60">{service.description}</p>
            </div>

            <ul className="space-y-3 mb-6">
              {service.features.map((feature, fidx) => (
                <li key={fidx} className="flex gap-3 text-sm text-white/80">
                  <span className="text-white/60">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {service.savingsNote && (
              <p className="text-sm font-semibold text-amber-300/90 mb-6 border-t border-amber-400/20 pt-4">
                {service.savingsNote}
              </p>
            )}

            {service.guarantee && (
              <p
                className="text-xs italic mb-6 pt-4 border-t border-white/10"
                style={{ color: 'rgba(247,247,239,0.55)' }}
              >
                🛡️ {service.guarantee}
              </p>
            )}

            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={service.url === 'https://calendly.com/pavethewayfit/30min' ? () => typeof window.gtag_report_conversion === 'function' && window.gtag_report_conversion('https://calendly.com/pavethewayfit/30min') : undefined}
              className={`block w-full py-3 rounded-lg font-semibold text-sm text-center transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
                service.bestValue
                  ? 'bg-amber-400 text-black hover:bg-amber-300'
                  : 'bg-white text-black'
              }`}
            >
              {service.ctaText || 'Get Started'}
            </a>
          </motion.div>
        ))}
      </motion.div>

      {/* App Features */}
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
        className="mb-12"
      >
        <h3 className="text-3xl font-black mb-8">Pave The Way App Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-xl border border-white/10 bg-white/3 hover:bg-white/5 transition-all"
              variants={itemVariants}
            >
              <h4 className="font-black mb-2">{feature.title}</h4>
              <p className="text-sm text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
