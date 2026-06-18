import Card from './Card'
import './StatCard.css'

export default function StatCard({ icon: Icon, label, value, sub, trend, color = 'primary' }) {
  const trendUp = trend > 0

  return (
    <Card className={`stat-card stat-card--${color}`}>
      <div className="stat-card-header">
        <div className={`stat-icon stat-icon--${color}`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`stat-trend ${trendUp ? 'stat-trend--up' : 'stat-trend--down'}`}>
            {trendUp ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </Card>
  )
}
