'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const featureCards = [
  {
    tag: 'READINESS',
    title: 'Know when to push',
    description: 'Blend sleep, training load and recovery signals into a simple daily recommendation.',
  },
  {
    tag: 'RECOVERY',
    title: 'Protect your baseline',
    description: 'Spot early warning signs before stress becomes a setback.',
  },
  {
    tag: 'COACHING',
    title: 'Plans that adapt',
    description: 'Guidance shifts with your body, not an arbitrary calendar.',
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

export default function Features() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      className="bg-dark-900 py-24 md:py-32 px-clamp(22px,5vw,72px)"
      style={{
        paddingLeft: 'clamp(22px, 5vw, 72px)',
        paddingRight: 'clamp(22px, 5vw, 72px)',
        paddingTop: 'clamp(58px, 8vw, 112px)',
        paddingBottom: 'clamp(58px, 8vw, 112px)',
      }}
    >
      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.88] tracking-tight mb-12 max-w-4xl"
        style={{
          fontSize: 'clamp(42px, 6vw, 92px)',
          letterSpacing: '-0.065em',
        }}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        All your signals, turned into one clear next step.
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {featureCards.map((card, idx) => (
          <motion.div
            key={idx}
            className="min-h-64 border border-white/10 rounded-3xl bg-gradient-to-b from-white/7 to-white/2 p-6 flex flex-col"
            variants={itemVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-mono text-xs font-semibold tracking-wider text-accent-blue mb-8">
              {card.tag}
            </span>
            <h3 className="text-2xl font-black tracking-tight mt-auto mb-3">
              {card.title}
            </h3>
            <p className="text-sm leading-[1.55] text-text-dim">
              {card.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
