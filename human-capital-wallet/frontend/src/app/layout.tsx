import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'Human Capital Wallet — Build Your Future',
  description: 'A verified digital identity, reputation score, and opportunity discovery platform for professionals, students, and entrepreneurs.',
  keywords:    'career, opportunities, jobs, internships, scholarships, income, investments',
  openGraph: {
    title:       'Human Capital Wallet',
    description: 'Build your verified digital identity and discover opportunities.',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
