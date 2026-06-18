import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound-inner">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
          <Link to="/services" className="btn btn-ghost btn-lg">Browse Services</Link>
        </div>
      </div>
    </main>
  )
}
