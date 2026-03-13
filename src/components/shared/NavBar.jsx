import React from 'react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'jeffmd',    label: 'JeffMD'    },
  { id: 'history',   label: 'History'   },
  { id: 'guide',     label: 'Guide'     },
]

export default function NavBar({ view, onNavigate }) {
  return (
    <nav className="navbar">
      {/* Brand */}
      <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="1" y="1" width="20" height="20" rx="5" stroke="var(--accent)" strokeWidth="1.5"/>
          <text x="11" y="15" textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="700" fontSize="11" fill="var(--accent)">Qx</text>
        </svg>
        QBank Pro
      </span>

      {/* Nav links */}
      <div className="nav-links">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-link${view === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side indicator */}
      {view === 'session' && (
        <span style={{ fontSize: 12, fontFamily: 'IBM Plex Mono', color: 'var(--accent2)', marginLeft: 'auto' }}>
          ● Session Active
        </span>
      )}
    </nav>
  )
}
