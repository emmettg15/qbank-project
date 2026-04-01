import React, { useState, useRef, useCallback } from 'react'
import DonutChart from './shared/DonutChart.jsx'
import TagBadge from './shared/TagBadge.jsx'
import SessionConfig from './SessionConfig.jsx'
import { useStorage } from '../hooks/useStorage.js'
import { generateGuidePdf } from '../utils/generateGuidePdf.js'

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDuration(timePerQ = []) {
  const total = timePerQ.reduce((a, b) => a + b, 0)
  if (!total) return '—'
  const m = Math.floor(total / 60)
  const s = total % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

// ─── File parser ──────────────────────────────────────────────────────────────
function parseUploadedFile(text, filename) {
  // Try JSON directly
  try {
    const data = JSON.parse(text)
    if (data.questions && Array.isArray(data.questions)) {
      return {
        title: data.config?.title
          ? `${data.config.title}${data.config.subtitle ? ' — ' + data.config.subtitle : ''}`
          : filename.replace(/\.[^.]+$/, ''),
        questions: data.questions,
      }
    }
  } catch {}

  // Try extracting from HTML <script id="qdata"> block
  const match = text.match(/<script[^>]+id="qdata"[^>]*>([\s\S]*?)<\/script>/i)
  if (match) {
    try {
      const data = JSON.parse(match[1].trim())
      if (data.questions) {
        return {
          title: data.config?.title
            ? `${data.config.title}${data.config.subtitle ? ' — ' + data.config.subtitle : ''}`
            : filename.replace(/\.html?$/i, ''),
          questions: data.questions,
        }
      }
    } catch {}
  }

  throw new Error('Could not parse questions from this file. Expected a QBank HTML file or JSON with a "questions" array.')
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ onParsed }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError]       = useState(null)
  const inputRef = useRef()

  const handleFile = useCallback((file) => {
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = parseUploadedFile(e.target.result, file.name)
        onParsed(parsed)
      } catch (err) {
        setError(err.message)
      }
    }
    reader.readAsText(file)
  }, [onParsed])

  return (
    <div>
      <div
        className={`upload-zone${dragOver ? ' drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        <div className="upload-zone-icon">⬆</div>
        <div className="upload-zone-title">Upload a Question Bank</div>
        <div className="upload-zone-sub">
          Drop a QBank <code>.html</code> file or <code>.json</code> file here, or click to browse
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".html,.json"
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]) }}
        />
      </div>
      {error && (
        <p style={{ color: 'var(--wrong)', fontSize: 13, marginTop: 8 }}>⚠ {error}</p>
      )}
    </div>
  )
}

// ─── Session Card (recent sessions) ──────────────────────────────────────────
function RecentSessionCard({ session, onNavigate }) {
  const correct  = session.score?.correct ?? 0
  const total    = session.score?.total ?? 1
  // Use persisted answered count; fall back to deriving from answers array
  const answered = session.score?.answered
    ?? (session.results?.answers ?? []).filter(a => a !== null).length
  const wrong    = answered - correct
  const skipped  = total - answered

  return (
    <div
      className="session-card"
      onClick={() => onNavigate('analysis', { sessionId: session.id })}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onNavigate('analysis', { sessionId: session.id })}
    >
      <DonutChart correct={correct} wrong={wrong} skipped={skipped} total={total} answered={answered} size={80} thickness={10} />
      <div className="session-card-info">
        <div className="session-card-title">{session.title}</div>
        <div className="session-card-meta">
          {formatDate(session.date)} · {total} Q · {formatDuration(session.results?.timePerQ)}
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {session.config?.tagFilter?.slice(0, 3).map(t => (
            <TagBadge key={t} tagId={t} small />
          ))}
        </div>
      </div>
      <div className="session-card-score">
        <span style={{ color: answered > 0 && correct / answered >= 0.75 ? 'var(--correct)' : 'var(--wrong)', fontSize: 18, fontWeight: 700, fontFamily: 'IBM Plex Mono' }}>
          {answered > 0 ? Math.round((correct / answered) * 100) : 0}%
        </span>
      </div>
    </div>
  )
}

// ─── Welcome Banner ──────────────────────────────────────────────────────────
function WelcomeBanner({ onNavigate }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px', marginBottom: 20,
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ fontSize: 14, color: 'var(--text)' }}>
        Welcome to <strong style={{ color: 'var(--accent)' }}>QBank Forge</strong> — your offline USMLE-style question bank. Upload a question bank or use the pre-loaded questions to get started.
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('guide')}>
          View Guide →
        </button>
        <button className="btn btn-ghost btn-sm" onClick={generateGuidePdf}>
          Download Guide (PDF)
        </button>
      </div>
    </div>
  )
}

// ─── Reset Confirmation Modal ──────────────────────────────────────────────────
function ResetModal({ onConfirm, onClose }) {
  const storage = useStorage()
  const sessionCount  = storage.getSessions().length
  const setCount      = storage.getQuestionSets().length
  const ratingCount   = Object.keys(storage.getQuestionRatings()).length

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-title" style={{ color: 'var(--wrong)' }}>⚠ Reset All Data?</div>
        <div style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
          The following will be <strong style={{ color: 'var(--wrong)' }}>permanently deleted</strong>:
        </div>
        <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
          <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)' }}>Sessions</span>
            <span style={{ fontFamily: 'IBM Plex Mono', color: 'var(--text)' }}>{sessionCount}</span>
          </div>
          <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)' }}>Question banks</span>
            <span style={{ fontFamily: 'IBM Plex Mono', color: 'var(--text)' }}>{setCount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)' }}>Question ratings</span>
            <span style={{ fontFamily: 'IBM Plex Mono', color: 'var(--text)' }}>{ratingCount}</span>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
          This cannot be undone. The app will reload after reset.
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Reset Everything</button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete QBank Confirmation Modal ──────────────────────────────────────────
function DeleteQBankModal({ set, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-title" style={{ color: 'var(--wrong)' }}>Remove Question Bank?</div>
        <div style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
          This will remove <strong>{set.title}</strong> from your available question banks.
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, padding: '10px 14px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
          Existing sessions using this question bank will not be deleted. You can re-import it later from the QBanks catalog.
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => onConfirm(set)}>Remove</button>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard({ onNavigate }) {
  const storage = useStorage()
  const [configTarget,  setConfigTarget]  = useState(null)
  const [existingSets,  setExistingSets]  = useState(() => storage.getQuestionSets())
  const [allSessions,   setAllSessions]   = useState(() => storage.getSessions())
  const [stats, setStats] = useState(() => storage.getAggregateStats())
  const [showReset, setShowReset] = useState(false)
  const [confirmDeleteQBank, setConfirmDeleteQBank] = useState(null)

  const inProgress = allSessions.filter(s => !s.completed && s.status !== 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  const completedSessions = allSessions.filter(s => s.completed || s.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  function handleDeleteSession(id) {
    storage.deleteSession(id)
    refreshData()
  }

  function refreshData() {
    setExistingSets(storage.getQuestionSets())
    setAllSessions(storage.getSessions())
    setStats(storage.getAggregateStats())
  }

  function handleResetConfirm() {
    storage.clearAllData()
    window.location.reload()
  }

  function handleDeleteQBank(set) {
    // Clear any catalog import that points to this question set
    const catalogImports = storage.getCatalogImports()
    for (const [catalogId, imp] of Object.entries(catalogImports)) {
      if (imp.questionSetId === set.id) {
        storage.deleteCatalogImport(catalogId)
      }
    }
    storage.deleteQuestionSet(set.id)
    setConfirmDeleteQBank(null)
    // Update local state directly (context cache is stale within same event handler)
    setExistingSets(prev => prev.filter(s => s.id !== set.id))
  }

  function handleParsed(parsed) {
    setConfigTarget(parsed)
    refreshData()
  }

  function handleSelectExisting(set) {
    setConfigTarget({ title: set.title, questions: set.questions, existingSetId: set.id })
  }

  return (
    <div className="view-enter">
      {/* ── Welcome Banner ── */}
      <WelcomeBanner onNavigate={onNavigate} />

      {/* ── Reset Modal ── */}
      {showReset && <ResetModal onConfirm={handleResetConfirm} onClose={() => setShowReset(false)} />}

      {/* ── Stats Overview ── */}
      <div className="section-header" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22 }}>Dashboard</h2>
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--wrong)', borderColor: 'rgba(239,83,80,.3)' }}
          onClick={() => setShowReset(true)}
        >
          ⚠ Reset Data
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">{stats.totalSessions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Questions Attempted</div>
          <div className="stat-value">{stats.totalQuestions.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overall Accuracy</div>
          <div className="stat-value" style={{ color: stats.accuracyPct >= 75 ? 'var(--correct)' : stats.accuracyPct >= 50 ? 'var(--accent2)' : 'var(--wrong)' }}>
            {stats.accuracyPct}%
          </div>
          <div className="stat-sub">Passing ≥ 75%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Time / Q</div>
          <div className="stat-value">{stats.avgTimePerQ > 0 ? `${stats.avgTimePerQ}s` : '—'}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* ── Left column: In Progress + Completed Sessions ── */}
        <div>
          {/* In Progress */}
          {inProgress.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div className="card" style={{ borderColor: 'rgba(66,165,245,.4)' }}>
                <div className="section-title" style={{ marginBottom: 12, color: 'var(--accent)' }}>
                  In Progress
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '25vh', overflowY: 'auto' }}>
                  {inProgress.map((s, index) => {
                    const answered = s.score?.answered
                      ?? (s.results?.answers ?? []).filter(a => a !== null).length
                    const total = s.score?.total ?? 0
                    return (
                      <div
                        key={s.id}
                        className="list-stagger"
                        style={{ '--i': index, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono', marginTop: 2 }}>
                            {formatDate(s.date)} · {answered}/{total} answered · {s.config?.mode ?? '—'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('session', { sessionId: s.id })}>
                            ▶ Resume
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--wrong)', padding: '5px 8px' }} onClick={() => handleDeleteSession(s.id)} title="Delete session">✕</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Completed Sessions */}
          <div className="card" style={{ borderColor: 'rgba(66,165,245,.4)' }}>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <span className="section-title" style={{ color: 'var(--accent)' }}>Completed Sessions</span>
              {completedSessions.length > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('history')}>
                  View All →
                </button>
              )}
            </div>

            {completedSessions.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px 20px' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
                <div>No completed sessions yet. Start a session to get going.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '25vh', overflowY: 'auto' }}>
                {completedSessions.map((s, index) => {
                  const correct = s.score?.correct ?? 0
                  const total = s.score?.total ?? 1
                  const answered = s.score?.answered
                    ?? (s.results?.answers ?? []).filter(a => a !== null).length
                  const wrong = answered - correct
                  const skipped = total - answered
                  const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0

                  return (
                    <div key={s.id} className="list-stagger" style={{ '--i': index, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
                      <DonutChart correct={correct} wrong={wrong} skipped={skipped} total={total} answered={answered} size={50} thickness={7} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono', marginTop: 2 }}>
                          {formatDate(s.date)} · {s.config?.mode ?? '—'} · <span style={{ color: pct >= 75 ? 'var(--correct)' : 'var(--wrong)', fontWeight: 700 }}>{pct}%</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('review', { sessionId: s.id })}>
                          Review
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('analysis', { sessionId: s.id })}>
                          Summary
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--wrong)', padding: '5px 8px' }} onClick={() => handleDeleteSession(s.id)} title="Delete session">✕</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Start New Session ── */}
        <div>
          <div className="section-header">
            <span className="section-title">Start New Session</span>
          </div>

          <UploadZone onParsed={handleParsed} />

          {/* Existing sets */}
          {existingSets.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div className="section-title" style={{ marginBottom: 10 }}>— or use an existing set —</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {existingSets.map(set => (
                  <div
                    key={set.id}
                    className="card-sm"
                    style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => handleSelectExisting(set)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleSelectExisting(set)}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{set.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>
                        {set.questions.length} questions · {formatDate(set.date)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-sm" style={{ pointerEvents: 'none' }}>Configure →</button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--wrong)', padding: '5px 8px' }}
                        title="Remove question bank"
                        onClick={e => { e.stopPropagation(); setConfirmDeleteQBank(set) }}
                      >✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete QBank Modal ── */}
      {confirmDeleteQBank && (
        <DeleteQBankModal
          set={confirmDeleteQBank}
          onConfirm={handleDeleteQBank}
          onClose={() => setConfirmDeleteQBank(null)}
        />
      )}

      {/* ── Session Config Modal ── */}
      {configTarget && (
        <SessionConfig
          title={configTarget.title}
          questions={configTarget.questions}
          existingSetId={configTarget.existingSetId}
          onStart={(sessionId, questions) => {
            setConfigTarget(null)
            refreshData()
            onNavigate('session', { sessionId, questions })
          }}
          onClose={() => setConfigTarget(null)}
        />
      )}
    </div>
  )
}
