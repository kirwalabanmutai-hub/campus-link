import { Link } from 'react-router-dom'
import {
  Printer, Shirt, BookOpen, Home as HomeIcon, Utensils, Wrench, Truck,
  Star, ArrowRight, ChevronRight, Zap, Shield, TrendingUp, Users,
  Brain, CheckCircle2,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import SearchBar from '../components/ui/SearchBar'
import { useState } from 'react'
import './Home.css'

const CATEGORIES = [
  { icon: Printer,  label: 'Printing',  color: '#10b981' },
  { icon: Shirt,    label: 'Laundry',   color: '#3b82f6' },
  { icon: BookOpen, label: 'Notes',     color: '#f59e0b' },
  { icon: HomeIcon, label: 'Housing',   color: '#8b5cf6' },
  { icon: Utensils, label: 'Food',      color: '#ec4899' },
  { icon: Wrench,   label: 'Repairs',   color: '#06b6d4' },
  { icon: Truck,    label: 'Movers',    color: '#f97316' },
]

const SERVICES = [
  { name: 'Printing (B&W)', price: 'Ksh 30/page', rating: 4.8, reviews: 120, provider: 'Galileo', type: 'Printing', badge: 'Popular' },
  { name: 'Laundry Service', price: 'From Ksh 100/kg', rating: 4.7, reviews: 85, provider: 'CleanPro', type: 'Laundry', badge: null },
  { name: 'Lecture Notes', price: 'Ksh 80', rating: 4.9, reviews: 60, provider: 'StudyHub', type: 'Academic', badge: 'Top Rated' },
  { name: 'Essay Writing', price: 'Ksh 1,900', rating: 4.6, reviews: 44, provider: 'Partners', type: 'Writing', badge: null },
]

const GIGS = [
  { title: 'Math Tutor Needed', budget: 'Ksh 2,000', posted: '2h ago', category: 'Academic', applicants: 3 },
  { title: 'Web Designer', budget: 'Ksh 3,800', posted: '5h ago', category: 'Tech', applicants: 7 },
  { title: 'Data Entry Assistant', budget: 'Ksh 800', posted: '1d ago', category: 'Tech', applicants: 2 },
  { title: 'Poster Design', budget: 'Ksh 800', posted: '2d ago', category: 'Creative', applicants: 5 },
]

const FEATURES = [
  { icon: Brain,     title: 'AI Career Guidance', desc: 'Personalized career paths, skill recommendations, and job matches powered by AI.' },
  { icon: Shield,    title: 'Secure Payments',    desc: 'Integrated M-Pesa and digital wallet for all campus transactions.' },
  { icon: TrendingUp,title: 'Opportunity Radar',  desc: 'Scholarships, competitions, internships, and freelance gigs — all in one place.' },
  { icon: Users,     title: 'Reputation System',  desc: 'Build trust through verified reviews and ratings from real clients.' },
  { icon: Zap,       title: 'Instant Bookings',   desc: 'Book campus services instantly — printing, laundry, housing, and more.' },
  { icon: CheckCircle2, title: 'Verified Providers', desc: 'All service providers are campus-vetted for quality and reliability.' },
]

const STATS = [
  { value: '10K+',   label: 'Students & Providers' },
  { value: '1,000+', label: 'Services Listed' },
  { value: 'KES 300M+', label: 'Transactions / Year' },
  { value: '4.8 ★',  label: 'Avg. Satisfaction' },
]

function StarRating({ rating }) {
  return (
    <span className="star-rating">
      <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
      <span>{rating}</span>
    </span>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')

  return (
    <main className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg-glow" />
        <div className="hero-content">
          <Badge variant="primary" size="md">
            🎓 One Campus. Endless Opportunities.
          </Badge>
          <h1 className="hero-title fade-up">
            Your Campus,<br />
            <span className="gradient-text">Supercharged</span>
          </h1>
          <p className="hero-sub fade-up fade-up-delay-1">
            Connect with campus services, discover jobs & gigs, get AI-powered career
            guidance, and manage payments — all from one platform.
          </p>

          <div className="hero-search fade-up fade-up-delay-2">
            <SearchBar
              placeholder="Search services, gigs, events…"
              value={query}
              onChange={setQuery}
            />
            <Link to="/services" className="btn btn-primary btn-lg">
              Explore <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-actions fade-up fade-up-delay-3">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/gigs"     className="btn btn-ghost btn-lg">Browse Gigs</Link>
          </div>
        </div>

        <div className="hero-stats fade-up fade-up-delay-4">
          {STATS.map(s => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Categories ── */}
      <section className="section">
        <div className="content-wrapper">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Browse by Category</h2>
            <Link to="/services" className="see-all">See all <ChevronRight size={16} /></Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(({ icon: Icon, label, color }) => (
              <Link key={label} to="/services" className="category-chip">
                <span className="category-icon" style={{ background: color + '22', color }}>
                  <Icon size={22} />
                </span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Services ── */}
      <section className="section section--alt">
        <div className="content-wrapper">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Popular Services</h2>
            <Link to="/services" className="see-all">See all <ChevronRight size={16} /></Link>
          </div>
          <div className="grid-4">
            {SERVICES.map(svc => (
              <Card key={svc.name} className="service-card">
                <div className="service-icon-wrap">
                  <Printer size={28} className="service-placeholder-icon" />
                  {svc.badge && <Badge variant="primary" size="sm">{svc.badge}</Badge>}
                </div>
                <div className="service-info">
                  <h3 className="service-name">{svc.name}</h3>
                  <p className="service-provider">{svc.provider}</p>
                  <div className="service-meta">
                    <StarRating rating={svc.rating} />
                    <span className="text-dim text-xs">({svc.reviews})</span>
                  </div>
                  <div className="service-footer">
                    <span className="service-price">{svc.price}</span>
                    <Link to="/services" className="btn btn-primary btn-sm">Book</Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Gigs ── */}
      <section className="section">
        <div className="content-wrapper">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Active Gigs & Jobs</h2>
            <Link to="/gigs" className="see-all">See all <ChevronRight size={16} /></Link>
          </div>
          <div className="grid-2">
            {GIGS.map(gig => (
              <Card key={gig.title} className="gig-card">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="accent" size="sm">{gig.category}</Badge>
                  <span className="text-dim text-xs">{gig.posted}</span>
                </div>
                <h3 className="gig-title">{gig.title}</h3>
                <div className="gig-footer">
                  <div>
                    <span className="gig-budget">{gig.budget}</span>
                    <span className="text-dim text-xs"> · {gig.applicants} applicants</span>
                  </div>
                  <Link to="/gigs" className="btn btn-outline btn-sm">Apply</Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section section--alt">
        <div className="content-wrapper text-center">
          <h2 className="section-title">Everything You Need on Campus</h2>
          <p className="section-subtitle">
            CampusLink brings together services, opportunities, AI career tools, and payments
            into one seamless platform built for African students.
          </p>
          <div className="grid-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="feature-card">
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to supercharge your campus life?</h2>
          <p className="cta-sub">
            Join 10,000+ students and providers already using CampusLink.
          </p>
          <div className="flex gap-4 justify-center wrap">
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
            <Link to="/career"   className="btn btn-ghost btn-lg">Try AI Career Coach</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
