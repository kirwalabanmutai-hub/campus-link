'use client'
import { useState } from 'react'
import {
  Search, Briefcase, GraduationCap, Award, DollarSign,
  Trophy, FileText, Zap, Bookmark, ExternalLink, Filter,
} from 'lucide-react'

const TYPES = [
  { id: 'all',         label: 'All',          icon: Briefcase },
  { id: 'job',         label: 'Jobs',          icon: Briefcase },
  { id: 'internship',  label: 'Internships',   icon: GraduationCap },
  { id: 'scholarship', label: 'Scholarships',  icon: Award },
  { id: 'grant',       label: 'Grants',        icon: DollarSign },
  { id: 'competition', label: 'Competitions',  icon: Trophy },
  { id: 'tender',      label: 'Tenders',       icon: FileText },
  { id: 'gig',         label: 'Freelance Gigs', icon: Zap },
]

const OPPORTUNITIES = [
  { id:'1', title:'Data Analyst',                   type:'job',         provider:'Safaricom PLC',       location:'Nairobi, KE', deadline:'Jun 30, 2024', compensation:'KSh 80K–120K/mo', tags:['Python','SQL','Tableau'],     saved:false, applied:false },
  { id:'2', title:'Google Africa Scholarship 2024',  type:'scholarship', provider:'Google',              location:'Remote',      deadline:'Jul 15, 2024', compensation:'$5,000',            tags:['Computer Science','STEM'],    saved:true,  applied:false },
  { id:'3', title:'Frontend Developer Intern',       type:'internship',  provider:'StartupHub KE',       location:'Nairobi, KE', deadline:'Jun 25, 2024', compensation:'KSh 25K/mo',        tags:['React','TypeScript','UI'],    saved:false, applied:true  },
  { id:'4', title:'AWS Build On Africa Hackathon',   type:'competition', provider:'Amazon Web Services', location:'Virtual',     deadline:'Jul 1, 2024',  compensation:'$10,000 prize',      tags:['Cloud','AI','Serverless'],   saved:true,  applied:false },
  { id:'5', title:'SME Digital Transformation Grant',type:'grant',       provider:'USAID Kenya',         location:'Kenya',       deadline:'Aug 10, 2024', compensation:'KSh 500K',           tags:['Business','Digital','SME'],  saved:false, applied:false },
  { id:'6', title:'UI/UX Design Gig',               type:'gig',         provider:'FinTech Startup',     location:'Remote',      deadline:'Jun 20, 2024', compensation:'KSh 40K',            tags:['Figma','UI/UX','Design'],    saved:false, applied:false },
]

const TYPE_ICONS: Record<string, typeof Briefcase> = {
  job: Briefcase, internship: GraduationCap, scholarship: Award,
  grant: DollarSign, competition: Trophy, tender: FileText, gig: Zap,
}
const TYPE_BADGE: Record<string, string> = {
  job: 'badge-primary', internship: 'badge-accent', scholarship: 'badge-warning',
  grant: 'badge-success', competition: 'badge-danger', tender: 'badge-primary', gig: 'badge-warning',
}

export default function OpportunitiesPage() {
  const [query, setQuery]         = useState('')
  const [activeType, setActiveType] = useState('all')
  const [saved, setSaved]         = useState<Set<string>>(
    new Set(OPPORTUNITIES.filter(o => o.saved).map(o => o.id))
  )

  const filtered = OPPORTUNITIES.filter(o => {
    const matchType = activeType === 'all' || o.type === activeType
    const matchQ    = o.title.toLowerCase().includes(query.toLowerCase()) ||
                      o.provider.toLowerCase().includes(query.toLowerCase())
    return matchType && matchQ
  })

  const toggleSave = (id: string) =>
    setSaved(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="section-title">Opportunity Radar</h1>
          <p className="text-slate-400 mt-1">Discover jobs, scholarships, grants, and more</p>
        </div>
        <button className="btn-ghost text-sm py-2"><Filter size={15} /> Filters</button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          className="input pl-11 py-3 text-sm" placeholder="Search opportunities…" />
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap">
        {TYPES.map(({ id, label, icon: Icon }) => (
          <button key={id}
            onClick={() => setActiveType(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
              border transition-all cursor-pointer
              ${activeType === id
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-surface border-surface-border text-slate-400 hover:text-white hover:border-surface-border2'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-600">{filtered.length} opportunities found</p>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(opp => {
          const Icon = TYPE_ICONS[opp.type]
          const isSaved = saved.has(opp.id)
          return (
            <div key={opp.id} className="card card-hover flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{opp.title}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{opp.provider}</p>
                  </div>
                </div>
                <button onClick={() => toggleSave(opp.id)}
                  className={`p-2 rounded-lg transition-all flex-shrink-0
                    ${isSaved ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-primary hover:bg-primary/10'}`}>
                  <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span>{opp.location}</span>
                <span>·</span>
                <span>Deadline: {opp.deadline}</span>
                <span>·</span>
                <span className="text-primary font-semibold">{opp.compensation}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className={TYPE_BADGE[opp.type]}>{opp.type}</span>
                {opp.tags.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-surface
                    border border-surface-border text-slate-500">{t}</span>
                ))}
              </div>

              <div className="flex gap-2 mt-auto pt-2 border-t border-surface-border">
                {opp.applied
                  ? <span className="badge-success text-sm py-1.5 px-4">✓ Applied</span>
                  : <button className="btn-primary text-sm py-2 flex-1">Apply Now</button>}
                <button className="btn-ghost text-sm py-2 px-3">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
