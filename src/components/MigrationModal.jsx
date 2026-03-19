import { useState } from 'react'
import { useStorage } from '../hooks/useStorage.js'

export default function MigrationModal() {
  const { migrationNeeded, runMigration, dismissMigration } = useStorage()
  const [migrating, setMigrating] = useState(false)
  const [error, setError] = useState('')

  if (!migrationNeeded) return null

  async function handleMigrate() {
    setMigrating(true)
    setError('')
    try {
      await runMigration()
    } catch (err) {
      setError(err.message || 'Migration failed')
      setMigrating(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-title">Import Existing Data?</div>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
          We found existing sessions and question banks in this browser.
          Would you like to import them into your account so they sync across devices?
        </p>
        {error && (
          <p style={{ color: 'var(--wrong)', fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            className="btn btn-ghost"
            onClick={dismissMigration}
            disabled={migrating}
          >
            Skip
          </button>
          <button
            className="btn btn-primary"
            onClick={handleMigrate}
            disabled={migrating}
          >
            {migrating ? 'Importing...' : 'Import Data'}
          </button>
        </div>
      </div>
    </div>
  )
}
