'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { authApi, getApiErrorMessage } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to send reset email.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#080d19' }}>
      <div className="w-full max-w-md animate-fade-up">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">HCW</div>
          <span className="font-bold text-xl text-white">Human Capital <span className="text-primary">Wallet</span></span>
        </div>

        <div className="card border-surface-border2 p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-sm text-slate-400 mb-6">
                We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <Link href="/login" className="btn-ghost text-sm">
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={15} /> Back to Sign In
              </Link>
              <h1 className="text-2xl font-extrabold text-white mb-1">Forgot password?</h1>
              <p className="text-sm text-slate-400 mb-6">Enter your email and we&apos;ll send you a reset link.</p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="input pl-10" placeholder="you@example.com" required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
