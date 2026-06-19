import { Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-ibm-plex-mono' })

export const metadata = {
  title: 'Pave The Way | Personal Training for Busy Professionals',
  description: 'Expert 1-on-1 personal training for men aged 35-50. Build a stronger body and stronger mind with Sam Francis. 10+ years of experience, 100s of transformations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${ibmPlexMono.variable} bg-black text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
