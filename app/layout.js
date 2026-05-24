import './globals.css'

export const metadata = {
  title: 'Exploration - Meet Your New Wellness Partner',
  description: 'A premium health-tech experience designed to make personal insight feel cinematic, human, and quietly futuristic.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-900 text-text-primary font-archivo overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
