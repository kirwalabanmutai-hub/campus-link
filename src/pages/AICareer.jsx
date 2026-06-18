import { useState } from 'react'
import { Brain, CheckCircle, ChevronRight, TrendingUp, BookOpen, Target, Award } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import './AICareer.css'

const CAREER_MATCHES = [
  { title: 'Data Analyst',       match: 85, skills: ['SQL', 'Python', 'Statistics'], salary: 'Ksh 80K–140K/mo', color: '#10b981' },
  { title: 'UX Designer',        match: 72, skills: ['Figma', 'User Research', 'Prototyping'], salary: 'Ksh 60K–120K/mo', color: '#3b82f6' },
  { title: 'Software Developer', match: 68, skills: ['JavaScript', 'React', 'Node.js'], salary: 'Ksh 90K–180K/mo', color: '#8b5cf6' },
  { title: 'Content Creator',    match: 61, skills: ['Writing', 'SEO', 'Canva'], salary: 'Ksh 40K–80K/mo', color: '#f59e0b' },
]

const SKILLS_RECOMMENDED = [
  { name: 'SQL Basics',             level: 'Beginner', icon: '🗄️', category: 'Data' },
  { name: 'Data Visualization',     level: 'Beginner', icon: '📊', category: 'Data' },
  { name: 'Python for Data Analysis', level: 'Intermediate', icon: '🐍', category: 'Data' },
  { name: 'Excel Advanced',         level: 'Beginner', icon: '📈', category: 'Business' },
  { name: 'Communication Skills',   level: 'All Levels', icon: '🗣️', category: 'Soft Skills' },
]

const ROADMAP = [
  { step: 1, title: 'Foundations',         desc: 'Complete Python & SQL basics', done: true },
  { step: 2, title: 'Data Wrangling',      desc: 'Pandas, NumPy, data cleaning',  done: true },
  { step: 3, title: 'Visualization',       desc: 'Matplotlib, Tableau, Power BI', done: false },
  { step: 4, title: 'Machine Learning',    desc: 'Scikit-learn, model building',  done: false },
  { step: 5, title: 'Portfolio Projects',  desc: 'Build 3 end-to-end projects',   done: false },
  { step: 6, title: 'Job Ready',           desc: 'Resume, LinkedIn, interview prep', done: false },
]

function MatchCircle({ pct, color }) {
  const r = 46
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="match-circle-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <span className="match-pct" style={{ color }}>{pct}%</span>
    </div>
  )
}

export default function AICareer() {
  const [activeCareer, setActiveCareer] = useState(CAREER_MATCHES[0])

  return (
    <main className="page-with-sidebar">
      <div className="main-content">
        <div className="content-wrapper">
          <div className="page-header fade-up">
            <div>
              <h1 className="section-title">AI Career Coach</h1>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Personalized career paths, skill recommendations, and job matches
              </p>
            </div>
            <Badge variant="primary" size="md">🤖 AI Powered</Badge>
          </div>

          {/* Top: Career matches */}
          <div className="career-layout fade-up fade-up-delay-1">
            {/* Match cards */}
            <div className="match-list">
              <h2 className="subsection-title">Your Career Match</h2>
              {CAREER_MATCHES.map(c => (
                <Card
                  key={c.title}
                  className={`match-card ${activeCareer.title === c.title ? 'match-card--active' : ''}`}
                  onClick={() => setActiveCareer(c)}
                >
                  <div className="flex items-center gap-4">
                    <MatchCircle pct={c.match} color={c.color} />
                    <div className="flex-1">
                      <h3 className="match-title">{c.title}</h3>
                      <p className="match-salary">{c.salary}</p>
                      <div className="match-skills">
                        {c.skills.map(s => (
                          <span key={s} className="skill-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-dim" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Detail panel */}
            <div className="career-detail">
              <Card className="career-detail-card">
                <div className="career-detail-header">
                  <div className="career-detail-icon">
                    <Brain size={28} />
                  </div>
                  <div>
                    <h2 className="career-detail-title">{activeCareer.title}</h2>
                    <p className="career-detail-salary">{activeCareer.salary}</p>
                  </div>
                  <MatchCircle pct={activeCareer.match} color={activeCareer.color} />
                </div>

                <div className="divider" />

                <h3 className="subsection-title">Key Skills Required</h3>
                <div className="detail-skills">
                  {activeCareer.skills.map(s => (
                    <div key={s} className="detail-skill-row">
                      <CheckCircle size={16} className="text-primary" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary btn-md w-full mt-4">
                  View Full Roadmap <ChevronRight size={16} />
                </button>
              </Card>
            </div>
          </div>

          {/* Recommended Skills */}
          <section className="mt-8 fade-up fade-up-delay-2">
            <h2 className="subsection-title mb-4">Recommended Skills</h2>
            <div className="grid-3">
              {SKILLS_RECOMMENDED.map(skill => (
                <Card key={skill.name} className="skill-card">
                  <div className="skill-card-top">
                    <span className="skill-emoji">{skill.icon}</span>
                    <Badge variant={
                      skill.level === 'Beginner' ? 'success' :
                      skill.level === 'Intermediate' ? 'warning' : 'default'
                    }>{skill.level}</Badge>
                  </div>
                  <h4 className="skill-name">{skill.name}</h4>
                  <p className="skill-cat">{skill.category}</p>
                  <button className="btn btn-outline btn-sm mt-4 w-full">Start Learning</button>
                </Card>
              ))}
            </div>
          </section>

          {/* Career Roadmap */}
          <section className="mt-8 fade-up fade-up-delay-3">
            <h2 className="subsection-title mb-4">
              <Target size={20} className="text-primary" /> Career Roadmap — {activeCareer.title}
            </h2>
            <div className="roadmap">
              {ROADMAP.map((step, i) => (
                <div key={step.step} className={`roadmap-step ${step.done ? 'roadmap-step--done' : ''}`}>
                  <div className="roadmap-indicator">
                    <div className={`roadmap-dot ${step.done ? 'roadmap-dot--done' : ''}`}>
                      {step.done ? <CheckCircle size={14} /> : step.step}
                    </div>
                    {i < ROADMAP.length - 1 && (
                      <div className={`roadmap-line ${step.done ? 'roadmap-line--done' : ''}`} />
                    )}
                  </div>
                  <div className="roadmap-content">
                    <h4 className="roadmap-title">{step.title}</h4>
                    <p className="roadmap-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
