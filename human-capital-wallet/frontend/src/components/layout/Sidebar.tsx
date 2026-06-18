'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, User, Briefcase, Brain, DollarSign,
  TrendingUp, Star, Bell, Settings, LogOut, ChevronRight,
} from 'lucide-react'
import { logout } from '@/lib/auth'

const NAV = [
  { href: '/dashboard',      label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/profile',        label: 'My Profile',        icon: User },
  { href: '/opportunities',  label: 'Opportunities',     icon: Briefcase },
  { href: '/career',         label: 'AI Career Coach',   icon: Brain },
  { href: '/income',         label: 'Income Tracker',    icon: DollarSign },
  { href: '/investments',    label: 'Investments',       icon: TrendingUp },
  { href: '/reputation',     label: 'Reputation',        icon: Star },
  { href: '/notifications',  label: 'Notifications',     icon: Bell },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-bg-2 border-r border-surface-border flex-shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-surface-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs">HCW</div>
        <span className="font-bold text-base text-white tracking-tight">
          Human Capital <span className="text-primary">Wallet</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 group
                ${active
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-slate-400 hover:bg-surface hover:text-white'}`}>
              <Icon size={18} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-surface-border space-y-0.5">
        <Link href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-400 hover:bg-surface hover:text-white transition-all">
          <Settings size={18} /> Settings
        </Link>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
