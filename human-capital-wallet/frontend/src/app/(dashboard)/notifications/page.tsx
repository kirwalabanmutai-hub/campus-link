'use client'
import { useState } from 'react'
import { Bell, Briefcase, Star, DollarSign, Info, CheckCheck, Trash2 } from 'lucide-react'

const NOTIFS = [
  { id:'1', type:'opportunity', title:'New Job Match: Data Scientist at KCB',        message:'A new job matching your profile was posted. Apply before Jun 28.',              time:'2h ago',  read:false },
  { id:'2', type:'success',    title:'Profile Verified',                              message:'Your profile has been successfully verified by HCW. Your trust score increased.', time:'5h ago',  read:false },
  { id:'3', type:'info',       title:'New Review Received',                          message:'StartupHub CEO left you a 4-star review for your freelance project.',            time:'1d ago',  read:false },
  { id:'4', type:'success',    title:'Income Record Added',                          message:'Your June salary of KSh 80,000 has been recorded.',                             time:'2d ago',  read:true  },
  { id:'5', type:'opportunity', title:'Scholarship Deadline: Google Africa 2024',    message:'The application deadline is in 10 days. Don\'t miss out!',                      time:'3d ago',  read:true  },
  { id:'6', type:'info',       title:'Skill Endorsement: Python',                   message:'Brian M. endorsed your Python skill.',                                          time:'4d ago',  read:true  },
]

const TYPE_ICONS = {
  opportunity: Briefcase,
  success:     Star,
  info:        Info,
}
const TYPE_COLORS: Record<string, string> = {
  opportunity: 'bg-primary/10 text-primary',
  success:     'bg-yellow-400/10 text-yellow-400',
  info:        'bg-accent/10 text-accent',
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFS)
  const unread = notifs.filter(n => !n.read).length

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const del = (id: string) => setNotifs(n => n.filter(x => x.id !== id))
  const markOne = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  return (
    <div className="space-y-6 animate-fade-up max-w-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="section-title">Notifications</h1>
          <p className="text-slate-400 mt-1">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="btn-ghost text-sm py-2">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifs.map(n => {
          const Icon = TYPE_ICONS[n.type as keyof typeof TYPE_ICONS] || Bell
          return (
            <div key={n.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all
                ${n.read
                  ? 'bg-surface border-surface-border'
                  : 'bg-bg-2 border-primary/20 shadow-sm shadow-primary/5'}`}
              onClick={() => markOne(n.id)}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[n.type]}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${n.read ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                  <span className="text-xs text-slate-600 flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                <button onClick={e => { e.stopPropagation(); del(n.id) }}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {notifs.length === 0 && (
        <div className="text-center py-20">
          <Bell size={40} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  )
}
