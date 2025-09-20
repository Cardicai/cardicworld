import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CN‑GPT Mentor',
  description: 'Your 24/7 Trading AI Mentor by Cardic Nexus',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh">
        <div className="mx-auto max-w-4xl p-4 md:p-6">{children}</div>
      </body>
    </html>
  )
}
