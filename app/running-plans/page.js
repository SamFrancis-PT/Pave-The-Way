import RunningPlanClient from './RunningPlanClient';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Free Running Plan | Pave The Way Fitness',
  description: 'Get a personalised running plan built around your goal, your fitness and your schedule. Free from Pave The Way Fitness.',
};

export default function RunningPlansPage() {
  return (
    <main className="min-h-screen bg-[#070707]">
      <nav className="h-16 flex items-center justify-between px-6 md:px-12 border-b border-white/5">
        <Link href="/">
          <Image
            src="/images/Pavetheway_Final_White.png"
            alt="Pave The Way"
            width={120}
            height={45}
            className="object-contain"
            priority
          />
        </Link>
        <a
          href="https://calendly.com/pavethewayfit/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 text-xs rounded-full bg-white text-black font-semibold transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
        >
          Book Consultation
        </a>
      </nav>

      <RunningPlanClient />
    </main>
  );
}
