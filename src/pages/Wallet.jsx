import { ArrowDownLeft, ArrowUpRight, History, Plus, Minus, CreditCard } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import './Wallet.css'

const TRANSACTIONS = [
  { id:1, label:'Printing Service',   amount: -50,     date:'May 18, 2024', type:'debit',  icon:'🖨️' },
  { id:2, label:'Laundry Service',    amount: -150,    date:'May 18, 2024', type:'debit',  icon:'👕' },
  { id:3, label:'Job Payment',        amount: +2000,   date:'May 17, 2024', type:'credit', icon:'💼' },
  { id:4, label:'Wallet Top Up',      amount: +5000,   date:'May 16, 2024', type:'credit', icon:'📱' },
  { id:5, label:'Essay Writing',      amount: -1900,   date:'May 15, 2024', type:'debit',  icon:'✍️' },
  { id:6, label:'Math Tutoring Gig',  amount: +2000,   date:'May 14, 2024', type:'credit', icon:'📐' },
  { id:7, label:'Notes Purchase',     amount: -80,     date:'May 13, 2024', type:'debit',  icon:'📚' },
  { id:8, label:'Campus Food',        amount: -200,    date:'May 12, 2024', type:'debit',  icon:'🍱' },
]

const TOP_SERVICES = [
  { name: 'Printing', pct: 35, color: '#10b981' },
  { name: 'Laundry',  pct: 25, color: '#3b82f6' },
  { name: 'Notes',    pct: 20, color: '#f59e0b' },
  { name: 'Housing',  pct: 20, color: '#8b5cf6' },
]

function DonutChart({ segments }) {
  let offset = 0
  const r = 52
  const circ = 2 * Math.PI * r
  const cx = 65, cy = 65

  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      {segments.map(seg => {
        const dashLen = (seg.pct / 100) * circ
        const el = (
          <circle
            key={seg.name}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${dashLen} ${circ - dashLen}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        )
        offset += dashLen
        return el
      })}
    </svg>
  )
}

export default function Wallet() {
  return (
    <main className="page-with-sidebar">
      <div className="main-content">
        <div className="content-wrapper">
          <div className="page-header fade-up">
            <h1 className="section-title">My Wallet</h1>
            <Badge variant="success" size="md">● Active</Badge>
          </div>

          {/* Balance card */}
          <Card className="balance-card fade-up fade-up-delay-1" hover={false}>
            <div className="balance-bg-glow" />
            <p className="balance-label">Current Balance</p>
            <h2 className="balance-amount">KSh 12,450</h2>
            <div className="wallet-actions">
              <button className="wallet-action-btn">
                <div className="wallet-action-icon"><Plus size={20} /></div>
                <span>Top Up</span>
              </button>
              <button className="wallet-action-btn">
                <div className="wallet-action-icon"><Minus size={20} /></div>
                <span>Withdraw</span>
              </button>
              <button className="wallet-action-btn">
                <div className="wallet-action-icon"><History size={20} /></div>
                <span>History</span>
              </button>
              <button className="wallet-action-btn">
                <div className="wallet-action-icon"><CreditCard size={20} /></div>
                <span>Cards</span>
              </button>
            </div>
          </Card>

          <div className="wallet-grid fade-up fade-up-delay-2">
            {/* Transactions */}
            <Card className="transactions-card" hover={false}>
              <h3 className="subsection-title mb-4">Recent Transactions</h3>
              <div className="transaction-list">
                {TRANSACTIONS.map(tx => (
                  <div key={tx.id} className="transaction-row">
                    <div className="tx-icon-wrap">{tx.icon}</div>
                    <div className="tx-details">
                      <p className="tx-label">{tx.label}</p>
                      <p className="tx-date">{tx.date}</p>
                    </div>
                    <span className={`tx-amount ${tx.type === 'credit' ? 'tx-amount--credit' : 'tx-amount--debit'}`}>
                      {tx.type === 'credit' ? '+' : '−'} Ksh {Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Spending breakdown */}
            <div className="wallet-side">
              <Card hover={false}>
                <h3 className="subsection-title mb-4">Spending Breakdown</h3>
                <div className="donut-section">
                  <DonutChart segments={TOP_SERVICES} />
                  <div className="donut-legend">
                    {TOP_SERVICES.map(s => (
                      <div key={s.name} className="legend-item">
                        <span className="legend-dot" style={{ background: s.color }} />
                        <span className="legend-name">{s.name}</span>
                        <span className="legend-pct">{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card hover={false} className="mt-4">
                <h3 className="subsection-title mb-4">Quick Stats</h3>
                <div className="quick-stat-row">
                  <div className="quick-stat">
                    <ArrowUpRight size={18} className="text-primary" />
                    <div>
                      <p className="quick-stat-val">Ksh 4,000</p>
                      <p className="quick-stat-lab">Total Earned</p>
                    </div>
                  </div>
                  <div className="quick-stat">
                    <ArrowDownLeft size={18} className="text-danger" />
                    <div>
                      <p className="quick-stat-val">Ksh 2,380</p>
                      <p className="quick-stat-lab">Total Spent</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
