'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import transformations from '@/data/transformations'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
        style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '-0.065em' }}
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
        See the transformations of clients who committed to their goals and trusted the process. Click any card to read their full story.
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
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <Link
              href={`/transformations/${t.id}`}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] border border-white/10 hover:border-white/30 transition-all block"
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
                {t.result && <p className="text-sm text-white/80 font-semibold mb-1 leading-snug">{t.result}</p>}
              </div>
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono tracking-wider text-white/80 bg-black/50 px-2 py-1 rounded-full border border-white/20">
                  Read more →
                </span>
              </div>
            </Link>
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
