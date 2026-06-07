'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function CTA() {
  return (
    <section
      id="consultation"
      className="relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-black to-black/50"
      style={{
        paddingLeft: 'clamp(22px, 5vw, 72px)',
        paddingRight: 'clamp(22px, 5vw, 72px)',
        paddingTop: 'clamp(80px, 10vw, 140px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
      }}
    >
      {/* Watermark logo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative w-[120%] max-w-5xl aspect-[3/1]" style={{ opacity: 0.15 }}>
          <Image
            src="/images/Pavetheway_Final_White.png"
            alt=""
            fill
            className="object-contain"
            sizes="100vw"
            aria-hidden
          />
        </div>
      </div>

      <motion.div
        className="relative z-10 max-w-3xl text-center"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2
          className="font-black leading-[0.9] tracking-tight mb-6"
          style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '-0.065em' }}
        >
          Ready to Transform?
        </h2>

        <p className="text-lg text-white/70 mb-8 leading-relaxed">
          Schedule your free consultation call with Sam. We'll discuss your goals, answer any questions, and create a personalised plan to pave your way to a stronger body and mind.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <a
            href="https://calendly.com/pavethewayfit/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-white text-black font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:translate-y-[-2px]"
          >
            Book Free Consultation
          </a>
          <Link
            href="mailto:sam@pavetheway.fit"
            className="px-8 py-4 rounded-full border border-white/30 bg-white/5 backdrop-blur text-white font-semibold transition-all duration-300 hover:bg-white/10"
          >
            Get in Touch
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/10 text-white/40 text-sm"
          variants={itemVariants}
        >
          <p className="mb-2">Sam Francis | Personal Trainer | 10+ Years Experience</p>
          <p>Helping busy professionals build stronger bodies and stronger minds</p>
        </motion.div>
      </motion.div>
    </section>
  )
}
