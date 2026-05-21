'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AlertTriangle,
  BarChart3,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Threat Feed', href: '/threat-feed', icon: AlertTriangle },
  { name: 'Research', href: '/research', icon: Search },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-x-0 top-0 z-20 border-b border-slate-800 bg-card/95 px-3 py-3 backdrop-blur md:inset-y-0 md:left-0 md:h-screen md:w-64 md:border-b-0 md:border-r md:p-4">
      <div className="mb-3 flex items-center justify-between md:mb-8">
        <div className="flex items-center gap-2 text-xl font-bold text-accent md:text-2xl">
          <AlertTriangle className="h-6 w-6" />
          <span>CyberAgent</span>
        </div>
        <Settings className="h-5 w-5 text-slate-500 md:hidden" />
      </div>
      <nav className="flex gap-2 overflow-x-auto md:block md:space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors md:px-4 ${
                isActive
                  ? 'bg-accent/20 text-accent'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-8 hidden rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:block">
        <p className="text-xs uppercase tracking-wider text-slate-500">System State</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-low">
          <span className="h-2 w-2 rounded-full bg-low shadow-glow" />
          FastAPI link ready
        </div>
      </div>
    </aside>
  )
}
