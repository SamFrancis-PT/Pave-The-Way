'use client'

const items = [
  'STRONG BODY',
  'STRONG MIND',
  'PAVE THE WAY',
  'STRONGER YOU',
  'BUILT FOR LIFE',
  '10+ YEARS EXPERIENCE',
  '100+ CLIENTS TRANSFORMED',
]

const separator = <span className="mx-6 text-white/30">·</span>

const track = items.map((item, i) => (
  <span key={i} className="inline-flex items-center whitespace-nowrap">
    {item}
    {separator}
  </span>
))

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden bg-black border-y border-white/10 py-4">
      <div className="flex animate-marquee">
        {/* Render twice so the loop is seamless */}
        <span className="flex items-center font-black text-sm tracking-widest text-white uppercase">
          {track}
        </span>
        <span className="flex items-center font-black text-sm tracking-widest text-white uppercase" aria-hidden>
          {track}
        </span>
      </div>
    </div>
  )
}
