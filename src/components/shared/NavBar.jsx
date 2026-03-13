import React from 'react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'qbanks',    label: 'QBanks'    },
  { id: 'history',   label: 'History'   },
  { id: 'guide',     label: 'Guide'     },
]

export default function NavBar({ view, onNavigate }) {
  return (
    <nav className="navbar">
      {/* Brand */}
      <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
          <path d="M50 8 C50 8, 42 25, 42 35 C42 42, 46 46, 50 42 C54 38, 52 30, 56 22 C60 14, 68 20, 65 32 C62 44, 56 48, 56 48 C56 48, 64 42, 68 35 C72 28, 76 32, 72 42 C68 52, 58 56, 58 56" stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="50" y="82" textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="700" fontSize="30" fill="var(--accent)">QF</text>
        </svg>
        QBank Forge
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
