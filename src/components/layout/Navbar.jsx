import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Home, Briefcase, Brain, Wallet, LayoutDashboard,
  Store, Bell, Menu, X,
} from 'lucide-react'
import './Navbar.css'

const NAV_ITEMS = [
  { to: '/',          label: 'Home',      icon: Home },
  { to: '/services',  label: 'Services',  icon: Store },
  { to: '/gigs',      label: 'Gigs & Jobs', icon: Briefcase },
  { to: '/career',    label: 'AI Career', icon: Brain },
  { to: '/wallet',    label: 'Wallet',    icon: Wallet },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-mark">CL</span>
          <span className="logo-text">
            Campus<span className="logo-accent">Link</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' nav-link--active' : '')
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="navbar-actions">
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={20} />
            <span className="notif-dot" />
          </button>
          <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>

          <button
            className="icon-btn mobile-toggle"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="mobile-menu">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'mobile-nav-link' + (isActive ? ' mobile-nav-link--active' : '')
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <div className="mobile-auth">
            <Link to="/login"    className="btn btn-ghost w-full" onClick={() => setMobileOpen(false)}>Sign in</Link>
            <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>Get Started</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
