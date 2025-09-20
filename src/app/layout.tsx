import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CN-GPT Mentor',
  description: 'Your 24/7 Trading AI Mentor by Cardic Nexus',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

function GalaxyBg() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep space base */}
      <div className="absolute inset-0 bg-black" />

      {/* Nebula 1 (top-center) */}
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 h-[110vh] w-[140vw] rounded-full opacity-70 blur-3xl"
        style={{ background: 'radial-gradient(50% 40% at 50% 35%, rgba(20,40,90,0.95) 0%, rgba(0,0,0,0) 65%)' }}
      />

      {/* Nebula 2 (bottom-left) */}
      <div
        className="absolute bottom-[-25%] left-[-10%] h-[100vh] w-[90vw] rounded-full opacity-55 blur-3xl animate-[drift_38s_ease-in-out_infinite_alternate]"
        style={{ background: 'radial-gradient(50% 40% at 20% 70%, rgba(0,120,255,0.35) 0%, rgba(0,0,0,0) 60%)' }}
      />

      {/* Nebula 3 (bottom-right) */}
      <div
        className="absolute bottom-[-20%] right-[-10%] h-[95vh] w-[90vw] rounded-full opacity-50 blur-3xl animate-[drift2_46s_ease-in-out_infinite_alternate]"
        style={{ background: 'radial-gradient(45% 35% at 80% 70%, rgba(10,180,255,0.28) 0%, rgba(0,0,0,0) 60%)' }}
      />

      {/* Starfield (tiny dots) */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)',
          backgroundSize: '2px 2px',
        }}
      />
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GalaxyBg />
        {/* Keep content centered so the galaxy shows on the sides */}
        <div className="mx-auto max-w-4xl p-4 md:p-6">{children}</div>
      </body>
    </html>
  )
}
