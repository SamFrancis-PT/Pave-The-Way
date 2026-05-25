'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const services = [
  {
    title: '1-on-1 Personal Training',
    price: '$100/week',
    description: 'In-person coaching with expert form correction and personalized guidance.',
    features: [
      'Weekly in-person PT session',
      'Customized training programs',
      'Pave The Way app access',
      'Nutritional guidance included',
      'Progress tracking & photos',
      'Personal best notifications',
    ],
    highlight: true,
  },
  {
    title: 'Online Coaching',
    price: '$75/week',
    description: 'Flexible remote coaching with weekly check-ins and app support.',
    features: [
      'Weekly 20-min check-in call',
      'Training & mindset discussion',
      'Reflective improvement questions',
      'Habit building guidance',
      'Nutrition dial-in support',
      'Full app access with data tracking',
    ],
    highlight: false,
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
    description: 'Integrated nutrition coaching to optimize your results.',
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
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

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
        Choose the coaching style that fits your lifestyle. Both programs include access to the Pave The Way app with exercise videos, nutrition guidance, and progress tracking.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className={`rounded-2xl p-8 border transition-all duration-300 ${
              service.highlight
                ? 'border-white/30 bg-white/8 backdrop-blur-sm scale-105 md:scale-100'
                : 'border-white/10 bg-white/3'
            }`}
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-black mb-2">{service.title}</h3>
              <div className="text-3xl font-black text-white mb-3">{service.price}</div>
              <p className="text-white/60">{service.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {service.features.map((feature, fidx) => (
                <li key={fidx} className="flex gap-3 text-sm text-white/80">
                  <span className="text-white/60">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-3 rounded-lg bg-white text-black font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
              Get Started
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
