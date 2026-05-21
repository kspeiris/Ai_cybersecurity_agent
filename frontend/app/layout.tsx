import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Cybersecurity Dashboard',
  description: 'SOC-style threat intelligence platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-dark text-slate-100">
          <Sidebar />
          <main className="min-h-screen p-4 md:ml-64 md:p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
