'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const transformations = [
  {
    id: 1,
    src: '/images/Damo.jpg',
    title: 'Damo',
    tag: 'FIT INTO HIS 50S',
    result: 'Body recomposition — fat loss, muscle & lasting fitness habit.',
    story: 'After 6 months of group fitness, Damo was ready to level up. With 3 weight sessions per week, a dialled-in diet, and a couch-to-5km running program, he didn\'t just look better — he found a passion that reshaped his entire life. He now trains consistently, eats well, and balances resistance training with cardio as a permanent lifestyle.',
  },
  {
    id: 2,
    src: '/images/Jem.jpg',
    title: 'Jem',
    tag: '16-WEEK TRANSFORMATION',
    result: 'Dramatic recomposition — lean muscle built, body fat stripped.',
    story: 'A focused 16-week dieting phase that completely reshaped Jem\'s physique. Training 5 days a week with strict discipline in the gym and the kitchen, Jem committed fully to the process — and the results speak for themselves.',
  },
  {
    id: 3,
    src: '/images/Liam.jpg',
    title: 'Liam',
    tag: '10-WEEK · FLAT TO FIT',
    result: 'Lean muscle built, definition revealed — complete physique upgrade.',
    story: 'In just 10 weeks Liam went from flat to genuinely fit through structured training and dialled-in nutrition.',
  },
  {
    id: 4,
    src: '/images/John.jpg',
    title: 'John',
    tag: '10-WEEK · FLAT TO FIT',
    result: 'Six-pack revealed — exceptional definition and muscle separation achieved.',
    story: '10 weeks of focused work produced jaw-dropping results. Proof of what\'s possible when you commit completely to the process.',
  },
  {
    id: 5,
    src: '/images/Tyler.jpg',
    title: 'Tyler',
    tag: 'TRANSFORMATION',
    result: 'Strength built, body composition improved.',
    story: '',
  },
  {
    id: 6,
    src: '/images/George_B.jpg',
    title: 'George B',
    tag: 'BODY RECOMPOSITION',
    result: 'Increased muscle mass, reduced body fat and visible abs year round.',
    story: 'George came to me wanting the classic physique — six pack, well-proportioned upper body, the full package. His biggest challenge was balancing his social life with his training, knowing the weekends were holding back his progress. Once he committed to prioritising training and dialling in his nutrition, the changes came consistently. That momentum pushed him to train harder, lift heavier and show up with real intensity. What started as a goal is now George\'s new normal — increased muscle mass, reduced body fat, and visible abs year round.',
  },
  {
    id: 7,
    src: '/images/Andalib.JPG',
    title: 'Andalib',
    tag: 'LIFESTYLE TRANSFORMATION',
    result: 'Muscle gained, body fat lost and energy levels transformed.',
    story: 'Andalib came to me as a busy father of two running his own business — training had slipped down the priority list and he was feeling weak, low on energy and disconnected from his health. We started with two full body sessions a week and locked in his nutrition using an intermittent fasting protocol, ensuring he hit high protein targets to support muscle growth and recovery. As the progress came, so did the momentum. Andalib built real strength, shed body fat and gained the energy he had been missing. What started as getting back to basics has since expanded beyond the gym — Andalib now trains jiu-jitsu, a testament to what happens when fitness becomes a lifestyle again.',
  },
  {
    id: 8,
    src: '/images/Barton.JPG',
    title: 'Barton',
    tag: 'TRANSFORMATION',
    result: '',
    story: '',
  },
  {
    id: 9,
    src: '/images/George.JPG',
    title: 'George',
    tag: 'TRANSFORMATION',
    result: '',
    story: '',
  },
  {
    id: 10,
    src: '/images/Leo.jpg',
    title: 'Leo',
    tag: 'TRANSFORMATION',
    result: '',
    story: '',
  },
  {
    id: 11,
    src: '/images/MINI.JPG',
    title: 'MINI',
    tag: 'TRANSFORMATION',
    result: '',
    story: '',
  },
  {
    id: 12,
    src: '/images/Munib.jpg',
    title: 'Munib',
    tag: 'TRANSFORMATION',
    result: '',
    story: '',
  },
  {
    id: 13,
    src: '/images/Rob.jpg',
    title: 'Rob',
    tag: 'TRANSFORMATION',
    result: '',
    story: '',
  },
  {
    id: 14,
    src: '/images/Rizly.jpg',
    title: 'Rizly',
    tag: 'TRANSFORMATION',
    result: '',
    story: '',
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
              alt={t.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
              <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase mb-1 block">{t.tag}</span>
              <h3 className="text-xl font-black text-white mb-1">{t.title}</h3>
              <p className="text-sm text-white/80 font-semibold mb-2 leading-snug">{t.result}</p>
              <p className="text-xs text-white/55 leading-relaxed line-clamp-3">{t.story}</p>
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
