import React from 'react'
import { useStorage } from '../../hooks/useStorage.js'
import { useAuth } from '../../hooks/useAuth.js'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'qbanks',    label: 'QBanks'    },
  { id: 'history',   label: 'History'   },
  { id: 'guide',     label: 'Guide'     },
]

export default function NavBar({ view, onNavigate }) {
  const { user, mode } = useStorage()
  const { signOut } = useAuth()

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

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        {view === 'session' && (
          <span style={{ fontSize: 12, fontFamily: 'IBM Plex Mono', color: 'var(--accent2)' }}>
            ● Session Active
          </span>
        )}
        {user ? (
          <button
            className="btn btn-ghost btn-sm"
            onClick={signOut}
            title={user.email}
            style={{ fontSize: 11, color: 'var(--muted)' }}
          >
            Sign Out
          </button>
        ) : (mode === 'local' || mode === 'local-pending') ? (
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>
            offline
          </span>
        ) : null}
      </div>
    </nav>
  )
}
