import './Card.css'

export default function Card({ children, className = '', hover = true, glass = false, style }) {
  return (
    <div
      className={`card ${hover ? 'card--hover' : ''} ${glass ? 'card--glass' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
