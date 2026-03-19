import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabase.js'

export default function AuthGate({ children }) {
  const { user, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)

  // Skip auth entirely if Supabase isn't configured or user chose offline
  if (!supabase || offlineMode) {
    return children({ user: null, mode: 'local' })
  }

  if (loading) {
    return (
      <div className="auth-gate">
        <div className="auth-card">
          <div className="auth-spinner" />
          <p style={{ color: 'var(--muted)', marginTop: 12 }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Authenticated — render app in supabase mode
  if (user) {
    return children({ user, mode: 'supabase' })
  }

  // Not authenticated — show login
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    setError('')
    const { error: err } = await signIn(email.trim())
    setSubmitting(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="auth-gate">
      <div className="auth-card">
        <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 28, marginBottom: 4 }}>
          QBank Pro
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 13 }}>
          Sign in to sync your data across devices
        </p>

        {sent ? (
          <div className="auth-sent">
            <p style={{ color: 'var(--correct)', fontWeight: 600, marginBottom: 8 }}>
              Check your email
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              We sent a magic link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
              Click it to sign in.
            </p>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 16 }}
              onClick={() => { setSent(false); setEmail('') }}
            >
              Try a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="auth-input"
              autoFocus
              disabled={submitting}
            />
            {error && (
              <p style={{ color: 'var(--wrong)', fontSize: 12, marginTop: 6 }}>{error}</p>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 12 }}
              disabled={submitting || !email.trim()}
            >
              {submitting ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          className="btn btn-ghost"
          style={{ width: '100%' }}
          onClick={() => setOfflineMode(true)}
        >
          Continue Offline
        </button>
        <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 8, textAlign: 'center' }}>
          Data stays in this browser only
        </p>
      </div>
    </div>
  )
}
