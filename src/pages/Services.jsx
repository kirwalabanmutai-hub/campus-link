import { useState } from 'react'
import { Star, MapPin, Clock, Filter, ChevronDown } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import SearchBar from '../components/ui/SearchBar'
import './Services.css'

const CATEGORIES = ['All', 'Printing', 'Laundry', 'Academic', 'Food', 'Housing', 'Repairs', 'Writing', 'Movers']

const SERVICES = [
  { id:1,  name:'Printing (B&W)',          provider:'Galileo Print Shop',  price:'Ksh 30/page',      rating:4.8, reviews:120, category:'Printing', location:'Block A, Room 2',   hours:'8am–8pm',  badge:'Popular',   emoji:'🖨️' },
  { id:2,  name:'Laundry Service',          provider:'CleanPro Laundry',   price:'From Ksh 100/kg',  rating:4.7, reviews:85,  category:'Laundry',  location:'Hostel C',           hours:'7am–9pm',  badge:null,        emoji:'👕' },
  { id:3,  name:'Lecture Notes',            provider:'StudyHub Notes',      price:'Ksh 80',           rating:4.9, reviews:60,  category:'Academic', location:'Online',             hours:'24/7',     badge:'Top Rated', emoji:'📚' },
  { id:4,  name:'Essay Writing',            provider:'Write Partners',      price:'Ksh 1,900',        rating:4.6, reviews:44,  category:'Writing',  location:'Online',             hours:'24/7',     badge:null,        emoji:'✍️' },
  { id:5,  name:'Data Entry Jobs',          provider:'Online @ Uni',        price:'Ksh 800',          rating:4.5, reviews:30,  category:'Academic', location:'Online',             hours:'24/7',     badge:null,        emoji:'💻' },
  { id:6,  name:'Printing (Color)',         provider:'Galileo Print Shop',  price:'Ksh 80/page',      rating:4.8, reviews:97,  category:'Printing', location:'Block A, Room 2',   hours:'8am–8pm',  badge:null,        emoji:'🎨' },
  { id:7,  name:'Room Cleaning',            provider:'CleanSpace',          price:'Ksh 500/session',  rating:4.6, reviews:52,  category:'Housing',  location:'All Hostels',        hours:'8am–6pm',  badge:'New',       emoji:'🧹' },
  { id:8,  name:'Food Delivery',            provider:'Campus Bites',        price:'From Ksh 200',     rating:4.4, reviews:210, category:'Food',     location:'All Campus',         hours:'7am–10pm', badge:'Hot',       emoji:'🍱' },
  // ── Movers ──
  { id:9,  name:'Room-to-Room Moving',      provider:'SwiftMovers KE',      price:'From Ksh 800',     rating:4.7, reviews:63,  category:'Movers',   location:'All Hostels',        hours:'7am–7pm',  badge:'Popular',   emoji:'📦' },
  { id:10, name:'Off-Campus Relocation',    provider:'CampusHaul',          price:'From Ksh 2,500',   rating:4.6, reviews:41,  category:'Movers',   location:'Nairobi & Environs', hours:'8am–6pm',  badge:null,        emoji:'🚚' },
  { id:11, name:'Furniture Assembly',       provider:'HandyFix Campus',     price:'Ksh 500/item',     rating:4.8, reviews:38,  category:'Movers',   location:'All Hostels',        hours:'8am–8pm',  badge:'New',       emoji:'🪑' },
  { id:12, name:'Luggage Storage',          provider:'SafeStore Campus',    price:'Ksh 100/day',      rating:4.5, reviews:29,  category:'Movers',   location:'Main Gate, Block B', hours:'6am–10pm', badge:null,        emoji:'🧳' },
  { id:13, name:'Pickup & Delivery',        provider:'QuickRun Express',    price:'From Ksh 300',     rating:4.6, reviews:88,  category:'Movers',   location:'All Campus',         hours:'7am–9pm',  badge:'Fast',      emoji:'🛵' },
  { id:14, name:'End-of-Semester Packing',  provider:'SwiftMovers KE',      price:'From Ksh 1,200',   rating:4.9, reviews:17,  category:'Movers',   location:'All Hostels',        hours:'8am–5pm',  badge:'Top Rated', emoji:'🗃️' },
]

function ServiceCard({ svc }) {
  return (
    <Card className="svc-card">
      <div className="svc-emoji-wrap">
        <span className="svc-emoji">{svc.emoji}</span>
        {svc.badge && <Badge variant="primary" size="sm">{svc.badge}</Badge>}
      </div>
      <div className="svc-body">
        <div className="flex items-center justify-between mb-1">
          <h3 className="svc-name">{svc.name}</h3>
        </div>
        <p className="svc-provider">{svc.provider}</p>
        <div className="svc-meta">
          <span className="star-rating-row">
            <Star size={12} fill="#f59e0b" stroke="#f59e0b" /> {svc.rating}
            <span className="text-dim text-xs">({svc.reviews})</span>
          </span>
          <span className="svc-loc"><MapPin size={12} /> {svc.location}</span>
        </div>
        <div className="svc-hours"><Clock size={12} /> {svc.hours}</div>
        <div className="svc-footer">
          <span className="svc-price">{svc.price}</span>
          <button className="btn btn-primary btn-sm">Book Now</button>
        </div>
      </div>
    </Card>
  )
}

export default function Services() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const filtered = SERVICES.filter(s => {
    const matchCat = activeTab === 'All' || s.category === activeTab
    const matchQ   = s.name.toLowerCase().includes(query.toLowerCase()) ||
                     s.provider.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <main className="page-with-sidebar">
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <div className="page-header fade-up">
            <div>
              <h1 className="section-title">Campus Services</h1>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Find and book trusted campus services near you
              </p>
            </div>
            <button className="btn btn-ghost btn-md filter-btn">
              <Filter size={16} /> Filters <ChevronDown size={14} />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6 fade-up fade-up-delay-1">
            <SearchBar
              placeholder="Search services…"
              value={query}
              onChange={setQuery}
            />
          </div>

          {/* Category tabs */}
          <div className="cat-tabs fade-up fade-up-delay-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${activeTab === cat ? 'cat-tab--active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results */}
          <p className="results-count fade-up fade-up-delay-3">
            {filtered.length} service{filtered.length !== 1 ? 's' : ''} found
          </p>

          <div className="grid-4 fade-up fade-up-delay-3">
            {filtered.map(svc => (
              <ServiceCard key={svc.id} svc={svc} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <p className="text-muted">No services match your search.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
