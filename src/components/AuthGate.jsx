import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabase.js'

export default function AuthGate({ children }) {
  const { user, loading, signIn, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [skipWait, setSkipWait] = useState(false)

  // Supabase not configured — pure local mode
  if (!supabase) {
    return children({ user: null, mode: 'local' })
  }

  // User skipped the login screen — load app immediately with localStorage,
  // but keep auth listener running so if a session resolves we can sync
  if (skipWait && !user) {
    return children({ user: null, mode: 'local-pending' })
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
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
          onClick={async () => {
            setError('')
            const { error: err } = await signInWithGoogle()
            if (err) setError(err.message)
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          className="btn btn-ghost"
          style={{ width: '100%' }}
          onClick={() => setSkipWait(true)}
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
