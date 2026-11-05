import { useState } from 'react'
import { Users, Clock, Plus } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import SearchBar from '../components/ui/SearchBar'
import './Gigs.css'

const CATEGORIES = ['All', 'Academic', 'Creative', 'Tech', 'Other']

const GIGS = [
  { id:1, title:'Math Tutor Needed', budget:'Ksh 2,000', posted:'2h ago', category:'Academic', applicants:3, desc:'Looking for a patient math tutor to help with calculus and statistics. Two sessions per week.', skills:['Mathematics','Teaching','Statistics'], poster:'Brian M.' },
  { id:2, title:'Web Designer for Startup', budget:'Ksh 3,800', posted:'5h ago', category:'Tech', applicants:7, desc:'Need a creative web designer to build a landing page for our student startup. Figma skills required.', skills:['Figma','UI/UX','HTML/CSS'], poster:'Aisha K.' },
  { id:3, title:'Essay Writing (Business)', budget:'Ksh 1,900', posted:'14h ago', category:'Academic', applicants:2, desc:'Need a well-written 2000-word essay on business management. Proper citations required.', skills:['Writing','Research','APA'], poster:'Partners Ltd.' },
  { id:4, title:'Data Entry Assistant', budget:'Ksh 800', posted:'1d ago', category:'Tech', applicants:2, desc:'Simple data entry work. Excel skills required. Flexible hours. Remote work.', skills:['Excel','Data Entry','Typing'], poster:'Online @ Uni' },
  { id:5, title:'Poster Design', budget:'Ksh 800', posted:'2d ago', category:'Creative', applicants:5, desc:'Design a promotional poster for a campus event. Creative and colorful design required.', skills:['Illustrator','Canva','Design'], poster:'Event Club' },
  { id:6, title:'Python Tutor', budget:'Ksh 1,500', posted:'3d ago', category:'Tech', applicants:4, desc:'Looking for a Python tutor for beginners. Flexible online sessions.', skills:['Python','Teaching','Programming'], poster:'CS Students' },
]

function GigCard({ gig }) {
  const [applied, setApplied] = useState(false)

  return (
    <Card className="gig-detail-card">
      <div className="gig-card-top">
        <div className="flex items-center gap-3">
          <div className="gig-avatar">{gig.poster[0]}</div>
          <div>
            <p className="gig-poster">{gig.poster}</p>
            <p className="gig-time"><Clock size={12} /> {gig.posted}</p>
          </div>
        </div>
        <Badge
          variant={
            gig.category === 'Tech' ? 'accent' :
            gig.category === 'Creative' ? 'warning' : 'primary'
          }
        >
          {gig.category}
        </Badge>
      </div>

      <h3 className="gig-detail-title">{gig.title}</h3>
      <p className="gig-detail-desc">{gig.desc}</p>

      <div className="gig-skills">
        {gig.skills.map(s => (
          <span key={s} className="skill-tag">{s}</span>
        ))}
      </div>

      <div className="gig-card-footer">
        <div className="gig-info-row">
          <span className="gig-budget-big">{gig.budget}</span>
          <span className="gig-applicants">
            <Users size={13} /> {gig.applicants} applicants
          </span>
        </div>
        <button
          className={`btn btn-sm ${applied ? 'btn-ghost' : 'btn-primary'}`}
          onClick={() => setApplied(v => !v)}
        >
          {applied ? 'Applied ✓' : 'Apply Now'}
        </button>
      </div>
    </Card>
  )
}

export default function Gigs() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const filtered = GIGS.filter(g => {
    const matchCat = activeTab === 'All' || g.category === activeTab
    const matchQ   = g.title.toLowerCase().includes(query.toLowerCase()) ||
                     g.desc.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <main className="page-with-sidebar">
      <div className="main-content">
        <div className="content-wrapper">
          <div className="page-header fade-up">
            <div>
              <h1 className="section-title">Gigs & Jobs</h1>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Find short-term jobs, freelance gigs, and academic helper opportunities
              </p>
            </div>
            <button className="btn btn-primary btn-md">
              <Plus size={16} /> Post a Gig
            </button>
          </div>

          <div className="mb-6 fade-up fade-up-delay-1">
            <SearchBar
              placeholder="Search gigs or jobs…"
              value={query}
              onChange={setQuery}
            />
          </div>

          <div className="cat-tabs fade-up fade-up-delay-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${activeTab === cat ? 'cat-tab--active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="results-count fade-up fade-up-delay-3">
            {filtered.length} gig{filtered.length !== 1 ? 's' : ''} available
          </p>

          <div className="grid-2 fade-up fade-up-delay-3">
            {filtered.map(gig => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <p className="text-muted">No gigs found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
