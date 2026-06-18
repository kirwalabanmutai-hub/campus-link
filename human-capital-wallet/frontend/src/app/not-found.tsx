import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black gradient-text mb-4 select-none">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-slate-400 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary px-6 py-2.5 rounded-lg text-sm font-medium">
            Go Home
          </Link>
          <Link href="/dashboard" className="px-6 py-2.5 rounded-lg text-sm font-medium
            bg-surface border border-surface-border text-slate-300 hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
