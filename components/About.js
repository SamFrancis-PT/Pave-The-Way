'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function About() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      className="bg-black/50 backdrop-blur py-24 md:py-32"
      style={{
        paddingLeft: 'clamp(22px, 5vw, 72px)',
        paddingRight: 'clamp(22px, 5vw, 72px)',
        paddingTop: 'clamp(58px, 8vw, 112px)',
        paddingBottom: 'clamp(58px, 8vw, 112px)',
      }}
    >
      <div className="max-w-4xl">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={itemVariants}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tight" style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            letterSpacing: '-0.065em',
          }}>
            Meet Sam Francis
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={itemVariants}
          className="text-lg text-white/80 leading-relaxed space-y-6"
        >
          <p>
            With over 10 years of experience as a personal trainer, I've had the privilege of helping hundreds of clients completely transform their lives. What I've witnessed time and time again is this powerful truth: building a strong body through discipline, consistency, and hard work doesn't just change your physique — it transforms your entire life.
          </p>
          <p>
            The discipline you develop in the gym flows into your career, relationships, and mental resilience. The consistency required to build muscle teaches you how to show up for yourself. This is the philosophy behind <strong>Pave The Way</strong>.
          </p>
          <p>
            I specialize in working with busy professionals and dedicated men aged 35-50 who are ready to take their health seriously. Whether you're new to structured training or looking to level up, I remove the guesswork and provide expert guidance on how to approach strength training optimally for muscle building.
          </p>
          <p className="text-white font-semibold text-xl">
            <strong>Strong Body | Strong Mind</strong>
          </p>
        </motion.div>
      </div>
    </section>
  )
}