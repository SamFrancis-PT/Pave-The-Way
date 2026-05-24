'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

const transformations = [
  {
    image: '/transformation-1.jpg',
    title: 'Client Transformation',
    result: 'Significant muscle gain & body composition improvement',
  },
  {
    image: '/transformation-2.jpg',
    title: 'Client Transformation',
    result: 'Impressive upper body development',
  },
  {
    image: '/transformation-3.jpg',
    title: 'Client Transformation',
    result: 'Complete body transformation with visible muscle gain',
  },
  {
    image: '/transformation-4.jpg',
    title: 'Client Transformation',
    result: 'Lean & defined physique achieved',
  },
  {
    image: '/transformation-5.jpg',
    title: 'Client Transformation',
    result: 'Muscle development & fat loss success',
  },
  {
    image: '/transformation-6.jpg',
    title: 'Client Transformation',
    result: 'Dramatic upper body transformation',
  },
  {
    image: '/transformation-7.jpg',
    title: 'Client Transformation',
    result: 'Full-body muscle building results',
  },
  {
    image: '/transformation-8.jpg',
    title: 'Client Transformation',
    result: 'Complete physique transformation',
  },
  {
    image: '/transformation-9.jpg',
    title: 'Client Transformation',
    result: 'Exceptional muscle gain & definition',
  },
  {
    image: '/transformation-10.jpg',
    title: 'Client Transformation',
    result: 'Outstanding body composition change',
  },
  {
    image: '/transformation-11.jpg',
    title: 'Client Transformation',
    result: 'Impressive strength & muscle development',
  },
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
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      id="transformations"
      className="bg-black/80 backdrop-blur py-24 md:py-32"
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
        {transformations.map((transformation, idx) => (
          <motion.div
            key={idx}
            className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-white/5 border border-white/10"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
            
            {/* Placeholder for image */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/50 flex items-center justify-center">
              <div className="text-center text-white/60">
                <div className="text-4xl mb-2">📸</div>
                <div className="text-sm">Transformation</div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <p className="text-sm text-white/80 font-semibold">{transformation.result}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}