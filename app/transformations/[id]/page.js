import Image from 'next/image'
import Link from 'next/link'
import transformations from '@/data/transformations'
import { notFound } from 'next/navigation'
import CalendlyButton from '@/components/CalendlyButton'

export function generateStaticParams() {
  return transformations.map((t) => ({ id: t.id }))
}

export function generateMetadata({ params }) {
  const t = transformations.find((t) => t.id === params.id)
  if (!t) return {}
  return {
    title: `${t.title} — Pave The Way`,
    description: t.result || 'Client transformation — Pave The Way Personal Training',
  }
}

export default function TransformationPage({ params }) {
  const t = transformations.find((t) => t.id === params.id)
  if (!t) notFound()

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Back nav */}
      <div
        className="flex items-center gap-4 border-b border-white/10"
        style={{ paddingLeft: 'clamp(22px, 5vw, 72px)', paddingRight: 'clamp(22px, 5vw, 72px)', paddingTop: '20px', paddingBottom: '20px' }}
      >
        <Link
          href="/#transformations"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to transformations
        </Link>
      </div>

      {/* Content */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start"
        style={{
          paddingLeft: 'clamp(22px, 5vw, 72px)',
          paddingRight: 'clamp(22px, 5vw, 72px)',
          paddingTop: 'clamp(48px, 6vw, 96px)',
          paddingBottom: 'clamp(48px, 6vw, 96px)',
        }}
      >
        {/* Photo */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0 aspect-[3/4] rounded-2xl overflow-hidden">
          <Image
            src={t.src}
            alt={t.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Story */}
        <div className="flex flex-col justify-center">
          <span className="text-xs font-mono tracking-widest text-white/40 uppercase mb-4">{t.tag}</span>

          <h1
            className="font-black leading-[0.9] tracking-tight mb-6"
            style={{ fontSize: 'clamp(48px, 7vw, 96px)', letterSpacing: '-0.05em' }}
          >
            {t.title}
          </h1>

          {t.result && (
            <p className="text-xl text-white/80 font-semibold leading-snug mb-8 max-w-lg">
              {t.result}
            </p>
          )}

          {t.story ? (
            <p className="text-base text-white/60 leading-relaxed max-w-lg mb-12">
              {t.story}
            </p>
          ) : (
            <p className="text-base text-white/30 italic mb-12">Story coming soon.</p>
          )}

          <CalendlyButton className="self-start px-8 py-4 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:translate-y-[-2px]">
            Start Your Transformation
          </CalendlyButton>
        </div>
      </div>
    </main>
  )
}
