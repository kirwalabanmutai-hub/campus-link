import { Shield } from 'lucide-react'
import Link from 'next/link'

const ADMIN_NAV = [
  { href: '/admin',           label: 'Overview' },
  { href: '/admin/users',     label: 'Users' },
  { href: '/admin/opportunities', label: 'Opportunities' },
  { href: '/admin/payments',  label: 'Payments' },
  { href: '/admin/reports',   label: 'Reports' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="h-14 bg-red-950/30 border-b border-red-900/40 flex items-center px-6 gap-4">
        <div className="flex items-center gap-2 text-red-400 font-bold">
          <Shield size={18} /> Admin Panel
        </div>
        <nav className="flex items-center gap-1 ml-6">
          {ADMIN_NAV.map(({ href, label }) => (
            <Link key={href} href={href}
              className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-surface rounded-lg transition-all">
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/dashboard" className="ml-auto text-sm text-slate-400 hover:text-white transition-colors">
          ← Back to App
        </Link>
      </header>
      <main className="p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
