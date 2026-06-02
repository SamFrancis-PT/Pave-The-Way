'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const transformations = [
  { id: 1, src: '/images/transformation-01.jpg', result: 'Significant muscle gain & body composition improvement' },
  { id: 2, src: '/images/transformation-02.jpg', result: 'Impressive upper body development' },
  { id: 3, src: '/images/transformation-03.jpg', result: 'Complete body transformation with visible muscle gain' },
  { id: 4, src: '/images/transformation-04.jpg', result: 'Lean & defined physique achieved' },
  { id: 5, src: '/images/transformation-05.jpg', result: 'Muscle development & fat loss success' },
  { id: 6, src: '/images/transformation-06.jpg', result: 'Dramatic upper body transformation' },
  { id: 7, src: '/images/transformation-07.jpg', result: 'Full-body muscle building results' },
  { id: 8, src: '/images/transformation-08.jpg', result: 'Complete physique transformation' },
  { id: 9, src: '/images/transformation-09.jpg', result: 'Exceptional muscle gain & definition' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function Transformations() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      ref={ref}
      id="transformations"
      className="bg-black/80 backdrop-blur"
      style={{
        paddingLeft: 'clamp(22px, 5vw, 72px)',
        paddingRight: 'clamp(22px, 5vw, 72px)',
        paddingTop: 'clamp(58px, 8vw, 112px)',
        paddingBottom: 'clamp(58px, 8vw, 112px)',
      }}
    >
      <motion.h2
        className="font-black leading-[0.9] tracking-tight mb-4 max-w-4xl"
        style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          letterSpacing: '-0.065em',
        }}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        Real Results from Real Clients
      </motion.h2>

      <motion.p
        className="text-white/60 text-lg mb-16 max-w-2xl"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        See the transformations of clients who committed to their goals and trusted the process. These are the results of proper training, nutrition, and mindset.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {transformations.map((t) => (
          <motion.div
            key={t.id}
            className="group relative overflow-hidden rounded-xl aspect-[3/4] border border-white/10 hover:border-white/20 transition-all"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src={t.src}
              alt={t.result}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <p className="text-sm text-white/90 font-semibold leading-tight">{t.result}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-16 text-center"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        <p className="text-white/70 text-lg">
          These are just some of the 100s of transformations I've helped create. <strong>Your transformation starts here.</strong>
        </p>
      </motion.div>
    </section>
  )
}
