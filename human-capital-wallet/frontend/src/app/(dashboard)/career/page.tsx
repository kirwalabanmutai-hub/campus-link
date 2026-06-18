'use client'
import { useState } from 'react'
import { Brain, ChevronRight, CheckCircle, BookOpen, Target, Sparkles, Send } from 'lucide-react'

const CAREERS = [
  { title: 'Data Analyst',       match: 87, salary: 'KSh 80K–140K/mo', skills: ['SQL', 'Python', 'Tableau'] },
  { title: 'ML Engineer',         match: 74, salary: 'KSh 120K–200K/mo', skills: ['TensorFlow', 'Python', 'MLOps'] },
  { title: 'Product Manager',     match: 68, salary: 'KSh 100K–180K/mo', skills: ['Roadmapping', 'Agile', 'Analytics'] },
  { title: 'Full-Stack Developer',match: 65, salary: 'KSh 90K–160K/mo',  skills: ['React', 'Node.js', 'PostgreSQL'] },
]

const ROADMAP = [
  { step: 1, title: 'Foundations',        desc: 'Python, SQL basics, statistics',         done: true  },
  { step: 2, title: 'Data Wrangling',     desc: 'Pandas, NumPy, data cleaning',           done: true  },
  { step: 3, title: 'Visualization',      desc: 'Matplotlib, Tableau, Power BI',          done: false },
  { step: 4, title: 'Machine Learning',   desc: 'Scikit-learn, model building',           done: false },
  { step: 5, title: 'Cloud Analytics',    desc: 'AWS QuickSight, BigQuery',               done: false },
  { step: 6, title: 'Portfolio + Job',    desc: '3 projects + resume + interview prep',   done: false },
]

const SKILL_GAPS = [
  { name: 'Tableau',        priority: 'High',   hours: 20 },
  { name: 'Machine Learning', priority: 'High',  hours: 40 },
  { name: 'Cloud (AWS)',    priority: 'Medium', hours: 30 },
  { name: 'Communication', priority: 'Low',    hours: 10 },
]

const CHAT_EXAMPLES = [
  'What skills should I learn next?',
  'How do I transition from analyst to ML engineer?',
  'Review my career roadmap',
]

export default function CareerPage() {
  const [active, setActive] = useState(CAREERS[0])
  const [chat, setChat]     = useState<{role: string; text: string}[]>([
    { role: 'ai', text: 'Hi! I\'m your AI Career Coach. Based on your profile, I see a strong match for Data Analyst roles. What would you like to explore today?' },
  ])
  const [msg, setMsg]       = useState('')

  function sendMsg() {
    if (!msg.trim()) return
    setChat(c => [...c,
      { role: 'user', text: msg },
      { role: 'ai',   text: 'Great question! Based on your current skills in Python and SQL, I recommend focusing on data visualization next — it\'s a high-demand skill for Data Analysts. Tools like Tableau or Power BI would be a strong next step.' },
    ])
    setMsg('')
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title">AI Career Coach</h1>
          <p className="text-slate-400 mt-1">Personalized career paths, skill gaps, and growth roadmaps</p>
        </div>
        <span className="badge-primary flex items-center gap-1"><Sparkles size={12} /> AI Powered</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Career Matches */}
        <div className="space-y-3">
          <h2 className="font-bold text-base text-white">Career Matches</h2>
          {CAREERS.map(c => (
            <div key={c.title}
              onClick={() => setActive(c)}
              className={`card cursor-pointer transition-all
                ${active.title === c.title ? 'border-primary/40 bg-surface-2 shadow-lg shadow-primary/10' : 'card-hover'}`}>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <svg width="52" height="52" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="22" fill="none" stroke="#1f2e47" strokeWidth="5" />
                    <circle cx="26" cy="26" r="22" fill="none" stroke="#10b981" strokeWidth="5"
                      strokeDasharray={`${(c.match / 100) * 2 * Math.PI * 22} ${2 * Math.PI * 22}`}
                      strokeLinecap="round" transform="rotate(-90 26 26)" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-primary">{c.match}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm">{c.title}</p>
                  <p className="text-xs text-primary mt-0.5">{c.salary}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {c.skills.map(s => <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-surface border border-surface-border text-slate-500">{s}</span>)}
                  </div>
                </div>
                <ChevronRight size={16} className={active.title === c.title ? 'text-primary' : 'text-slate-600'} />
              </div>
            </div>
          ))}
        </div>

        {/* Skill Gap + Roadmap */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <Target size={17} className="text-primary" /> Skill Gap Analysis — {active.title}
            </h2>
            <div className="space-y-3">
              {SKILL_GAPS.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.hours}h estimated</p>
                  </div>
                  <span className={
                    s.priority === 'High' ? 'badge-danger' :
                    s.priority === 'Medium' ? 'badge-warning' : 'badge-success'
                  }>{s.priority}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <BookOpen size={17} className="text-accent" /> Roadmap
            </h2>
            <div className="space-y-1">
              {ROADMAP.map((step, i) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${step.done ? 'border-primary bg-primary/10 text-primary' : 'border-surface-border bg-surface text-slate-500'}`}>
                      {step.done ? <CheckCircle size={13} /> : step.step}
                    </div>
                    {i < ROADMAP.length - 1 && (
                      <div className={`w-0.5 h-6 my-0.5 ${step.done ? 'bg-primary/40' : 'bg-surface-border'}`} />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className={`text-sm font-semibold ${step.done ? 'text-primary' : 'text-white'}`}>{step.title}</p>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Chat */}
        <div className="card flex flex-col h-[520px]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-surface-border">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Brain size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">AI Career Coach</p>
              <p className="text-xs text-primary">● Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed
                  ${m.role === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-surface border border-surface-border text-slate-300 rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {CHAT_EXAMPLES.map(ex => (
                <button key={ex} onClick={() => setMsg(ex)}
                  className="text-xs px-2.5 py-1 rounded-full bg-surface border border-surface-border
                    text-slate-400 hover:text-primary hover:border-primary/30 transition-all">
                  {ex}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMsg()}
                placeholder="Ask your career coach…"
                className="input flex-1 py-2 text-sm" />
              <button onClick={sendMsg} className="btn-primary px-3 py-2">
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
