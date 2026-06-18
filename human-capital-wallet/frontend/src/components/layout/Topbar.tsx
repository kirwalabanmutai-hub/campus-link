'use client'
import { Bell, Search, ChevronDown } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-surface-border bg-bg-2/80 backdrop-blur-sm sticky top-0 z-40">
      {/* Search */}
      <div className="relative hidden sm:flex items-center w-72">
        <Search size={16} className="absolute left-3 text-slate-600 pointer-events-none" />
        <input
          type="text"
          placeholder="Search opportunities, skills…"
          className="input pl-9 py-2 text-sm h-9"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg
          border border-surface-border text-slate-400 hover:text-white hover:bg-surface transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-bg-2" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg
          hover:bg-surface transition-all border border-transparent hover:border-surface-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm
            flex items-center justify-center">
            B
          </div>
          <span className="text-sm font-semibold text-white hidden sm:block">Brian</span>
          <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
        </button>
      </div>
    </header>
  )
}
