import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react'
import './Auth.css'

const ROLES = [
  { value: 'student',  label: 'Student',          icon: '🎓' },
  { value: 'provider', label: 'Service Provider',  icon: '🏪' },
  { value: 'recruiter',label: 'Recruiter',         icon: '💼' },
]

export default function Register() {
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" />

      <div className="auth-card auth-card--wide fade-up">
        <div className="auth-logo">
          <span className="logo-mark">CL</span>
          <span className="logo-text">Campus<span className="logo-accent">Link</span></span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join 10,000+ students on CampusLink</p>

        {/* Role selector */}
        <div className="role-selector">
          {ROLES.map(r => (
            <button
              key={r.value}
              type="button"
              className={`role-btn ${form.role === r.value ? 'role-btn--active' : ''}`}
              onClick={() => setForm(f => ({ ...f, role: r.value }))}
            >
              <span className="role-icon">{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        <form className="auth-form" onSubmit={e => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Brian Mutai"
                  value={form.name}
                  onChange={handle}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="you@university.ac.ke"
                  value={form.email}
                  onChange={handle}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handle}
                required
                minLength={8}
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPwd(v => !v)}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <p className="form-terms">
            By signing up you agree to our{' '}
            <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>.
          </p>

          <button type="submit" className="btn btn-primary btn-lg w-full">
            <UserPlus size={18} /> Create Account
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="btn-google">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
