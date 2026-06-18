'use client'
import { Star, CheckCircle, Shield, Award, TrendingUp, Users } from 'lucide-react'

const SCORE_BREAKDOWN = [
  { label: 'Verification Score', score: 92, max: 100, icon: Shield,     color: 'text-primary',   bg: 'bg-primary/10' },
  { label: 'Activity Score',     score: 78, max: 100, icon: TrendingUp, color: 'text-accent',    bg: 'bg-accent/10' },
  { label: 'Review Score',       score: 88, max: 100, icon: Star,       color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { label: 'Network Score',      score: 82, max: 100, icon: Users,      color: 'text-purple-400', bg: 'bg-purple-400/10' },
]

const REVIEWS = [
  { from: 'Safaricom PM',   rating: 5, text: 'Exceptional data analyst. Delivered insights on time and exceeded expectations.', date: 'Jun 2024',   avatar: 'S' },
  { from: 'StartupHub CEO', rating: 4, text: 'Great frontend skills. Would work with again.',                                   date: 'Dec 2023',  avatar: 'S' },
  { from: 'Google Africa',  rating: 5, text: 'Outstanding candidate in our hackathon. Very innovative solutions.',              date: 'May 2024',  avatar: 'G' },
]

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14}
          fill={i < n ? '#f59e0b' : 'none'}
          stroke={i < n ? '#f59e0b' : '#4b5563'} />
      ))}
    </span>
  )
}

export default function ReputationPage() {
  const overall = 87

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="section-title">Reputation Dashboard</h1>
        <p className="text-slate-400 mt-1">Your trust score and community reviews</p>
      </div>

      {/* Overall score */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card flex flex-col items-center text-center py-8">
          <div className="relative w-36 h-36 mb-4">
            <svg viewBox="0 0 144 144" className="w-full h-full -rotate-90">
              <circle cx="72" cy="72" r="58" fill="none" stroke="#1f2e47" strokeWidth="12" />
              <circle cx="72" cy="72" r="58" fill="none" stroke="#10b981" strokeWidth="12"
                strokeDasharray={`${(overall / 100) * 2 * Math.PI * 58} ${2 * Math.PI * 58}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <p className="text-3xl font-black text-white">{overall}</p>
                <p className="text-xs text-slate-500">/100</p>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-bold text-white">Trust Score</h2>
          <p className="text-sm text-slate-400 mt-1">Top 15% of all professionals</p>
          <span className="badge-success mt-3">● Trusted Member</span>
        </div>

        <div className="md:col-span-2 card">
          <h3 className="font-bold text-lg text-white mb-5">Score Breakdown</h3>
          <div className="space-y-5">
            {SCORE_BREAKDOWN.map(({ label, score, max, icon: Icon, color, bg }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${bg} ${color} flex items-center justify-center`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-sm font-semibold text-white">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${color}`}>{score}/{max}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${
                    color.includes('primary') ? 'bg-primary' :
                    color.includes('accent') ? 'bg-accent' :
                    color.includes('yellow') ? 'bg-yellow-400' : 'bg-purple-400'
                  }`} style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <h3 className="font-bold text-lg text-white mb-4">Earned Badges</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: '🏆', name: 'Top Performer',    color: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400' },
            { icon: '✅', name: 'Verified Profile', color: 'border-primary/30 bg-primary/10 text-primary' },
            { icon: '🚀', name: 'Early Adopter',    color: 'border-accent/30 bg-accent/10 text-accent' },
            { icon: '💡', name: 'Problem Solver',   color: 'border-purple-400/30 bg-purple-400/10 text-purple-400' },
          ].map(b => (
            <div key={b.name}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${b.color} text-sm font-semibold`}>
              {b.icon} {b.name}
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="card">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-white">Client Reviews</h3>
          <div className="flex items-center gap-2">
            <Stars n={5} />
            <span className="text-sm font-bold text-white">4.9</span>
            <span className="text-sm text-slate-500">({REVIEWS.length} reviews)</span>
          </div>
        </div>
        <div className="space-y-4">
          {REVIEWS.map(r => (
            <div key={r.from} className="p-5 rounded-xl bg-bg-2 border border-surface-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm
                    flex items-center justify-center flex-shrink-0">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{r.from}</p>
                    <p className="text-xs text-slate-500">{r.date}</p>
                  </div>
                </div>
                <Stars n={r.rating} />
              </div>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
