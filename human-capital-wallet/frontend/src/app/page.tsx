import Link from 'next/link'
import {
  Shield, TrendingUp, Briefcase, Brain, DollarSign,
  ArrowRight, CheckCircle, BarChart3,
} from 'lucide-react'

const FEATURES = [
  { icon: Shield,    title: 'Verified Digital Identity', desc: 'Build a trusted profile with verified skills, certificates, and work history.' },
  { icon: TrendingUp,title: 'Reputation Score',          desc: 'Your trust score grows with every review, project, and verified credential.' },
  { icon: Briefcase, title: 'Opportunity Radar',         desc: 'Jobs, internships, scholarships, grants, competitions, and freelance gigs in one place.' },
  { icon: Brain,     title: 'AI Career Coach',           desc: 'Get personalized career paths, skill gap analysis, and growth roadmaps.' },
  { icon: DollarSign,title: 'Income Tracker',            desc: 'Track income from multiple sources, analyze expenses, and plan savings.' },
  { icon: BarChart3, title: 'Investment Module',          desc: 'Discover investment opportunities, calculate ROI, and track your portfolio.' },
]

const STATS = [
  { value: '50K+',    label: 'Professionals' },
  { value: '10K+',    label: 'Opportunities' },
  { value: 'KSh 2B+', label: 'Income Tracked' },
  { value: '4.9 ★',   label: 'User Rating' },
]

const PLANS = [
  {
    name: 'Free',
    price: 'KSh 0',
    period: '/month',
    features: ['Digital Profile', 'Opportunity Discovery (10/mo)', 'Basic Reputation Score', 'Income Tracking (5 records)'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'KSh 499',
    period: '/month',
    features: ['Everything in Free', 'Unlimited Opportunities', 'AI Career Coach', 'Full Income Analytics', 'Investment Module', 'Priority Support'],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Recruiter',
    price: 'KSh 2,499',
    period: '/month',
    features: ['Candidate Search', 'Post Unlimited Opportunities', 'Verified Talent Pool', 'Analytics Dashboard', 'Dedicated Account Manager'],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-surface-border bg-bg/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">HCW</div>
            <span className="font-bold text-lg tracking-tight">
              Human Capital <span className="text-primary">Wallet</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {['Features', 'Opportunities', 'Pricing', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-surface rounded-lg transition-all">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"    className="btn-ghost text-sm px-4 py-2">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.18) 0%, transparent 70%)' }} />
        <div className="relative max-w-4xl mx-auto">
          <span className="badge-primary inline-flex mb-6">🚀 Build Your Human Capital</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Your Skills Are<br />
            <span className="gradient-text">Your Capital</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create a verified digital identity, build your reputation score, discover personalized
            opportunities, track your income, and grow with AI-powered career guidance.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register" className="btn-primary text-base px-8 py-3">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-ghost text-base px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-3xl mx-auto mt-20 pt-12 border-t border-surface-border
                        grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-primary">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-bg-2 border-y border-surface-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-3">Everything You Need to Grow</h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            One platform to manage your professional identity, opportunities, and finances.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-center mb-3">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 text-center mb-12">Start free, upgrade when you&apos;re ready.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name}
                className={`card flex flex-col ${plan.highlight
                  ? 'border-primary shadow-lg shadow-primary/20 bg-surface-2'
                  : ''}`}>
                {plan.highlight && (
                  <span className="badge-primary self-start mb-4">Most Popular</span>
                )}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-2 mb-6">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle size={15} className="text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                  className={plan.highlight ? 'btn-primary w-full' : 'btn-ghost w-full'}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6 text-center border-t border-surface-border bg-bg-2 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(16,185,129,0.1) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
            Start Building Your Future Today
          </h2>
          <p className="text-slate-400 mb-8">
            Join 50,000+ professionals already managing their human capital on HCW.
          </p>
          <Link href="/register" className="btn-primary text-base px-10 py-3 inline-flex">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white font-black text-xs">HCW</div>
            <span className="font-semibold text-slate-300">Human Capital Wallet</span>
          </div>
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} HCW. Built for African Professionals.
          </p>
        </div>
      </footer>
    </div>
  )
}
