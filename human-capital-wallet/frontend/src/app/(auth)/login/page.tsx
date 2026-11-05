'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import { authApi, getApiErrorMessage } from '@/lib/api'
import { setToken, setUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.login(form)
      setToken(data.data.token)
      setUser(data.data.user)
      router.push('/dashboard')
    } catch (error) {
      setError(getApiErrorMessage(error, 'Login failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 70% 60% at 20% 30%, rgba(16,185,129,0.12) 0%, transparent 65%), #080d19' }}>

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">HCW</div>
          <span className="font-bold text-xl text-white">Human Capital <span className="text-primary">Wallet</span></span>
        </div>

        <div className="card border-surface-border2 p-8">
          <h1 className="text-2xl font-extrabold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input type="email" name="email" value={form.email} onChange={handle}
                  className="input pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handle}
                  className="input pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Signing in…' : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-surface-border" />
            <span className="text-sm text-slate-600">or</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-2.5 px-5 rounded-lg
            border border-surface-border bg-bg-2 text-sm font-semibold text-white
            hover:bg-surface hover:border-surface-border2 transition-all">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
