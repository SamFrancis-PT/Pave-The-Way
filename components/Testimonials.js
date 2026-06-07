'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const testimonials = [
  {
    name: 'Liam',
    photo: '/images/Liam.jpg',
    quote: 'Leaned out, stronger and fitter in a short time. The structure, accountability and nutrition have been unreal — Sammy is so clued in with natural progression and it shows from his studies. Still hitting targets.',
  },
  {
    name: 'Tyler',
    photo: '/images/Tyler.jpg',
    quote: "After a couple of years training solo my progress had stalled. Sammy's programming helped me break through the plateau, correct my form and build lean muscle. Sammy's training app has been great — keeping me accountable by linking my nutrition, progress photos, weight and workouts.",
  },
  {
    name: 'Jem',
    photo: '/images/Jem.jpg',
    quote: "Training with Sammy has been a genuinely great experience. He builds programmes that are both tailored and sustainable. I've been able to lose body fat, build lean muscle and stay consistent thanks to the structure and accountability through the fitness app.",
  },
  {
    name: 'Munib',
    photo: '/images/Munib.jpg',
    quote: "I've had a great time training with Sammy and seen incredible results — better than I expected. The programmes and nutrition guidance have been very helpful throughout my journey. Looking forward to more progress and results.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      ref={ref}
      id="testimonials"
      style={{
        paddingLeft: 'clamp(22px, 5vw, 72px)',
        paddingRight: 'clamp(22px, 5vw, 72px)',
        paddingTop: 'clamp(58px, 8vw, 112px)',
        paddingBottom: 'clamp(58px, 8vw, 112px)',
      }}
    >
      <motion.h2
        className="font-black leading-[0.9] tracking-tight mb-4"
        style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '-0.065em' }}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        What Clients Say
      </motion.h2>

      <motion.p
        className="text-white/60 text-lg mb-16 max-w-2xl"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        Real words from real people who committed to the process.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-8 hover:border-white/20 transition-all"
            variants={itemVariants}
          >
            {/* Quote mark */}
            <span className="text-5xl font-black text-white/15 leading-none select-none">&ldquo;</span>

            {/* Quote */}
            <p className="text-white/80 text-base leading-relaxed flex-1 -mt-4">
              {t.quote}
            </p>

            {/* Client */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={t.photo}
                  alt={t.name}
                  fill
                  className="object-cover object-top"
                  sizes="48px"
                />
              </div>
              <div>
                <div className="font-black text-white">{t.name}</div>
                <div className="text-xs text-white/40 font-mono tracking-widest uppercase">Pave The Way Client</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
