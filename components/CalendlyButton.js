'use client'

const CALENDLY_URL = 'https://calendly.com/pavethewayfit/30min'

export default function CalendlyButton({ children, className }) {
  function handleClick() {
    if (typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion(CALENDLY_URL)
    }
  }

  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}
