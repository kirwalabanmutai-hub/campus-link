import { Search } from 'lucide-react'
import './SearchBar.css'

export default function SearchBar({ placeholder = 'Search...', value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />
    </div>
  )
}
