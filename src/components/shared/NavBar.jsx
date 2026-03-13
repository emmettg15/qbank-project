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
        <img src="/logo.png" alt="QBank Forge" width="32" height="32" style={{ borderRadius: 4, display: 'block' }} />
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
