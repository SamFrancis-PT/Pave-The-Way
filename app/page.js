'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Transformations from '@/components/Transformations'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Transformations />
      <CTA />
    </main>
  )
}