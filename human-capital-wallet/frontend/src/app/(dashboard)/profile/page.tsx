'use client'
import { useState } from 'react'
import {
  User, MapPin, Globe, Plus, Pencil, CheckCircle,
  Briefcase, BookOpen, Award, Code, Shield,
} from 'lucide-react'

const TABS = ['Overview', 'Skills', 'Experience', 'Education', 'Certifications', 'Projects']

const SKILLS = [
  { name: 'Python',        category: 'Tech',     verified: true,  endorsements: 12 },
  { name: 'Data Analysis', category: 'Data',     verified: true,  endorsements: 8  },
  { name: 'SQL',           category: 'Data',     verified: false, endorsements: 6  },
  { name: 'React',         category: 'Tech',     verified: false, endorsements: 5  },
  { name: 'Leadership',    category: 'Soft',     verified: true,  endorsements: 9  },
  { name: 'Figma',         category: 'Design',   verified: false, endorsements: 4  },
]

const EXPERIENCE = [
  { company: 'Safaricom PLC', title: 'Junior Data Analyst', start: 'Jan 2024', end: 'Present', current: true },
  { company: 'StartupHub KE', title: 'Frontend Developer (Intern)', start: 'Jun 2023', end: 'Dec 2023', current: false },
]

const EDUCATION = [
  { institution: 'University of Nairobi', degree: 'BSc Computer Science', field: 'Computer Science', start: 2020, end: 2024, current: false },
]

const CERTS = [
  { name: 'Google Data Analytics', issuer: 'Google / Coursera', date: 'Mar 2024', verified: true },
  { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: 'Jan 2024', verified: true },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Cover + Avatar */}
      <div className="card p-0 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-primary/30 via-accent/20 to-purple-500/20 relative">
          <button className="absolute bottom-3 right-3 btn-ghost text-xs py-1.5 px-3">
            <Pencil size={13} /> Edit Cover
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl border-4 border-bg-2 bg-primary/20 text-primary
              flex items-center justify-center text-3xl font-black">
              B
            </div>
            <button className="btn-outline text-sm py-2">
              <Pencil size={14} /> Edit Profile
            </button>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Brian Mutai</h1>
          <p className="text-slate-400 mt-1">Data Analyst &amp; Full-Stack Developer</p>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} /> Nairobi, Kenya</span>
            <span className="flex items-center gap-1 text-sm text-slate-500"><Globe size={14} /> brian.dev</span>
            <span className="badge-success flex items-center gap-1"><Shield size={12} /> Verified Profile</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${activeTab === tab
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-slate-400 hover:text-white hover:bg-surface'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <h3 className="font-bold text-lg text-white mb-3">About</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Passionate Data Analyst and Full-Stack Developer with 2+ years of experience building
                scalable web applications and extracting insights from complex datasets. Currently working
                at Safaricom PLC, driving data-informed decisions across the product team.
              </p>
            </div>
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white">Top Skills</h3>
                <button className="btn-ghost text-xs py-1.5 px-3"><Plus size={13} /> Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILLS.slice(0, 4).map(s => (
                  <span key={s.name}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold
                      border ${s.verified
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-surface-border bg-surface text-slate-400'}`}>
                    {s.verified && <CheckCircle size={12} />}
                    {s.name}
                    <span className="text-xs opacity-60">({s.endorsements})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-base text-white mb-3">Profile Strength</h3>
              <div className="relative h-3 bg-surface rounded-full mb-2">
                <div className="absolute inset-y-0 left-0 w-[78%] bg-primary rounded-full" />
              </div>
              <p className="text-sm text-slate-400">78% complete — <span className="text-primary">Add certifications</span></p>
            </div>
            <div className="card">
              <h3 className="font-bold text-base text-white mb-3">Trust Score</h3>
              <p className="text-3xl font-black text-primary mb-1">87<span className="text-slate-500 text-base">/100</span></p>
              <p className="text-xs text-slate-500">Top 15% of professionals</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Skills' && (
        <div className="card">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg text-white">Skills &amp; Expertise</h3>
            <button className="btn-primary text-sm py-2"><Plus size={15} /> Add Skill</button>
          </div>
          <div className="space-y-3">
            {SKILLS.map(s => (
              <div key={s.name} className="flex items-center justify-between p-4 rounded-xl
                bg-bg-2 border border-surface-border hover:border-surface-border2 transition-all">
                <div className="flex items-center gap-3">
                  {s.verified
                    ? <CheckCircle size={18} className="text-primary" />
                    : <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-600" />}
                  <div>
                    <p className="font-semibold text-white">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.category} · {s.endorsements} endorsements</p>
                  </div>
                </div>
                <span className={s.verified ? 'badge-success' : 'badge-warning'}>
                  {s.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Experience' && (
        <div className="card">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg text-white">Work Experience</h3>
            <button className="btn-primary text-sm py-2"><Plus size={15} /> Add</button>
          </div>
          <div className="space-y-4">
            {EXPERIENCE.map(e => (
              <div key={e.title} className="flex gap-4 p-4 rounded-xl bg-bg-2 border border-surface-border">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                  <Briefcase size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-white">{e.title}</p>
                  <p className="text-sm text-slate-400">{e.company}</p>
                  <p className="text-xs text-slate-600 mt-1">{e.start} — {e.end}</p>
                </div>
                {e.current && <span className="badge-success ml-auto self-start">Current</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Education' && (
        <div className="card">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg text-white">Education</h3>
            <button className="btn-primary text-sm py-2"><Plus size={15} /> Add</button>
          </div>
          {EDUCATION.map(e => (
            <div key={e.degree} className="flex gap-4 p-4 rounded-xl bg-bg-2 border border-surface-border">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                <BookOpen size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-white">{e.degree}</p>
                <p className="text-sm text-slate-400">{e.institution}</p>
                <p className="text-xs text-slate-600 mt-1">{e.start} — {e.end}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Certifications' && (
        <div className="card">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg text-white">Certifications</h3>
            <button className="btn-primary text-sm py-2"><Plus size={15} /> Add</button>
          </div>
          <div className="space-y-3">
            {CERTS.map(c => (
              <div key={c.name} className="flex items-center justify-between p-4 rounded-xl
                bg-bg-2 border border-surface-border">
                <div className="flex items-center gap-3">
                  <Award size={18} className="text-yellow-400" />
                  <div>
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.issuer} · {c.date}</p>
                  </div>
                </div>
                {c.verified && <span className="badge-success flex items-center gap-1"><CheckCircle size={11} /> Verified</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Projects' && (
        <div className="card">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg text-white">Portfolio Projects</h3>
            <button className="btn-primary text-sm py-2"><Plus size={15} /> Add Project</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Sales Analytics Dashboard', stack: ['Python', 'Tableau', 'SQL'], desc: 'End-to-end analytics dashboard for retail sales data.' },
              { name: 'Campus Connect App', stack: ['React', 'Node.js', 'MongoDB'], desc: 'A platform connecting campus students with opportunities.' },
            ].map(p => (
              <div key={p.name} className="p-5 rounded-xl bg-bg-2 border border-surface-border hover:border-surface-border2 transition-all">
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3">
                  <Code size={18} />
                </div>
                <h4 className="font-bold text-white mb-1">{p.name}</h4>
                <p className="text-sm text-slate-400 mb-3">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-surface border border-surface-border text-slate-400">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
