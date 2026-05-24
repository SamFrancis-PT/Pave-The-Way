'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Features from '@/components/Features'

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Features />
    </main>
  )
}
