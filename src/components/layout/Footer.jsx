import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Github, Twitter, Linkedin } from 'lucide-react'
import './Footer.css'

const LINKS = {
  Platform: [
    { label: 'Services',    to: '/services' },
    { label: 'Gigs & Jobs', to: '/gigs' },
    { label: 'AI Career Coach', to: '/career' },
    { label: 'Wallet',      to: '/wallet' },
    { label: 'Dashboard',   to: '/dashboard' },
  ],
  Company: [
    { label: 'About Us',    to: '#' },
    { label: 'Blog',        to: '#' },
    { label: 'Careers',     to: '#' },
    { label: 'Press Kit',   to: '#' },
  ],
  Support: [
    { label: 'Help Center', to: '#' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Contact',     to: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="navbar-logo" style={{ marginBottom: '1rem' }}>
            <span className="logo-mark">CL</span>
            <span className="logo-text">Campus<span className="logo-accent">Link</span></span>
          </Link>
          <p className="footer-tagline">
            AI-Powered Campus Services &amp; Opportunities Platform connecting students,
            service providers, and opportunities across universities and TVETs.
          </p>
          <div className="footer-contact">
            <span><MapPin size={14} /> Nairobi, Kenya</span>
            <span><Phone size={14} /> +254 700 000 000</span>
            <span><Mail size={14} /> campuslink@gmail.com</span>
          </div>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="#" aria-label="GitHub"><Github size={18} /></a>
          </div>
        </div>

        {Object.entries(LINKS).map(([group, items]) => (
          <div key={group} className="footer-col">
            <h4 className="footer-col-title">{group}</h4>
            <ul className="footer-col-list">
              {items.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CampusLink. All rights reserved.</p>
        <p>Built with ♥ for African Students</p>
      </div>
    </footer>
  )
}
