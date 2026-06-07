import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import About from '@/components/About'
import Services from '@/components/Services'
import Transformations from '@/components/Transformations'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Transformations />
      <Testimonials />
      <Contact />
      <CTA />
    </main>
  )
}
