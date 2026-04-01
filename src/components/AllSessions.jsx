import React, { useState, useMemo } from 'react'
import DonutChart from './shared/DonutChart.jsx'
import TagBadge from './shared/TagBadge.jsx'
import { useStorage } from '../hooks/useStorage.js'
import { TAGS, getTagLabel } from '../data/taggingSystem.js'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtTime(s) {
  if (!s) return '—'
  const m = Math.floor(s / 60), sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

// ── Helper: derive answered count from session (supports old + new format) ──
function getAnswered(s) {
  if (s.score?.answered != null) return s.score.answered
  return (s.results?.answers ?? []).filter(a => a !== null).length
}

// ── Mini trend chart (SVG line) ──────────────────────────────────────────────
function TrendChart({ sessions }) {
  if (sessions.length < 2) return null
  const w = 340, h = 80, pad = 10

  const points = sessions.map((s, i) => {
    const answered = getAnswered(s)
    const pct = answered > 0 ? Math.round((s.score.correct / answered) * 100) : 0
    return {
      x: pad + (i / (sessions.length - 1)) * (w - 2 * pad),
      y: pad + ((1 - pct / 100) * (h - 2 * pad)),
      pct,
      title: s.title,
    }
  })

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="section-title" style={{ marginBottom: 12 }}>Accuracy Trend</div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', maxWidth: w }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(pct => {
          const y = pad + ((1 - pct / 100) * (h - 2 * pad))
          return (
            <g key={pct}>
              <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="var(--border)" strokeWidth={0.5} />
              <text x={2} y={y + 4} fontSize={8} fill="var(--muted)" fontFamily="IBM Plex Mono">{pct}%</text>
            </g>
          )
        })}
        {/* 75% passing line */}
        {(() => {
          const y = pad + ((1 - 0.75) * (h - 2 * pad))
          return <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="var(--correct)" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
        })()}
        {/* Line */}
        <polyline points={polyline} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={p.pct >= 75 ? 'var(--correct)' : 'var(--wrong)'} />
        ))}
      </svg>
    </div>
  )
}

// ── AllSessions ──────────────────────────────────────────────────────────────
export default function AllSessions({ onNavigate }) {
  const storage = useStorage()
  const [search,     setSearch]    = useState('')
  const [sortBy,     setSortBy]    = useState('date')   // 'date' | 'score' | 'title'
  const [sortDir,    setSortDir]   = useState('desc')   // 'asc' | 'desc'
  const [filterTag,  setFilterTag] = useState('')
  const [, refresh]                = useState(0)

  const rawSessions    = storage.getSessions()
  const allCompleted   = rawSessions.filter(s => s.completed || s.status === 'completed')
  const inProgress     = rawSessions.filter(s => !s.completed && s.status !== 'completed')
  const allSessions    = allCompleted

  // All tags present in sessions (for greying out unused ones)
  const usedTags = useMemo(() => {
    const tags = new Set()
    allSessions.forEach(s => s.config?.tagFilter?.forEach(t => tags.add(t)))
    return tags
  }, [allSessions])

  // Full canonical tag list — always show all 19
  const allTags = TAGS.map(t => t.id)

  // Filter + sort
  const sessions = useMemo(() => {
    let list = [...allSessions]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s => s.title.toLowerCase().includes(q))
    }
    if (filterTag) {
      list = list.filter(s => s.config?.tagFilter?.includes(filterTag))
    }
    list.sort((a, b) => {
      let va, vb
      if (sortBy === 'date')  { va = a.date; vb = b.date }
      if (sortBy === 'score') {
        const aa = getAnswered(a), ab = getAnswered(b)
        va = aa > 0 ? a.score.correct / aa : 0
        vb = ab > 0 ? b.score.correct / ab : 0
      }
      if (sortBy === 'title') { va = a.title; vb = b.title }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [allSessions, search, filterTag, sortBy, sortDir])

  // Trend: newest 10 by date
  const trendSessions = [...allSessions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10)

  function toggleSort(col) {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('desc') }
  }

  function handleDelete(id) {
    storage.deleteSession(id)
    refresh(n => n + 1)
  }

  function SortArrow({ col }) {
    if (sortBy !== col) return <span style={{ color: 'var(--border)' }}> ↕</span>
    return <span style={{ color: 'var(--accent)' }}>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>
  }

  return (
    <div className="view-enter">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('dashboard')} style={{ marginBottom: 8 }}>
            ← Dashboard
          </button>
          <h2 style={{ fontSize: 22 }}>Session History</h2>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{allSessions.length} completed sessions</div>
        </div>
      </div>

      {/* ── In-progress sessions ── */}
      {inProgress.length > 0 && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(66,165,245,.4)' }}>
          <div className="section-title" style={{ marginBottom: 12, color: 'var(--accent)' }}>
            ▶ In-Progress Sessions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {inProgress.map((s, index) => {
              const answered = getAnswered(s)
              const total    = s.score?.total ?? 0
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
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--wrong)', padding: '5px 8px' }} onClick={() => handleDelete(s.id)} title="Delete session">✕</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Trend chart */}
      {trendSessions.length >= 2 && <TrendChart sessions={trendSessions} />}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-input"
          style={{ maxWidth: 240 }}
          placeholder="Search sessions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-input"
          style={{ maxWidth: 200 }}
          value={filterTag}
          onChange={e => setFilterTag(e.target.value)}
        >
          <option value="">All Topics</option>
          {allTags.map(t => (
            <option key={t} value={t} disabled={!usedTags.has(t)}>
              {usedTags.has(t) ? '' : '○ '}{getTagLabel(t)}
            </option>
          ))}
        </select>
      </div>

      {/* ── Completed Sessions ── */}
      <div className="card" style={{ borderColor: 'rgba(66,165,245,.4)', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 0' }}>
          <div className="section-title" style={{ marginBottom: 0, color: 'var(--accent)' }}>
            Completed Sessions
          </div>
        </div>

        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 20px' }}>
            {allSessions.length === 0
              ? 'No completed sessions yet. Start a session from the Dashboard!'
              : 'No sessions match your filters.'}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('title')}>
                    Title <SortArrow col="title" />
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('date')}>
                    Date <SortArrow col="date" />
                  </th>
                  <th>Topics</th>
                  <th>Mode</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('score')}>
                    Score <SortArrow col="score" />
                  </th>
                  <th>Qs</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, index) => {
                  const correct  = s.score.correct
                  const total    = s.score.total
                  const answered = getAnswered(s)
                  const wrong    = answered - correct
                  const skipped  = total - answered
                  const pct      = answered > 0 ? Math.round((correct / answered) * 100) : 0
                  const pass     = pct >= 75
                  const answeredTime = (s.results?.answers ?? []).reduce(
                    (sum, a, i) => a !== null ? sum + ((s.results?.timePerQ?.[i]) || 0) : sum, 0
                  )
                  return (
                    <tr key={s.id} className="list-stagger" style={{ '--i': index }}>
                      <td style={{ width: 54 }}>
                        <DonutChart correct={correct} wrong={wrong} skipped={skipped} total={total} answered={answered} size={44} thickness={6} />
                      </td>
                      <td style={{ fontWeight: 500, maxWidth: 220 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                        {s.sessionNotes && (
                          <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            📝 {s.sessionNotes.slice(0, 60)}{s.sessionNotes.length > 60 ? '…' : ''}
                          </div>
                        )}
                      </td>
                      <td className="font-mono text-muted text-sm">{formatDate(s.date)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(s.config?.tagFilter ?? []).slice(0, 3).map(t => <TagBadge key={t} tagId={t} small />)}
                        </div>
                      </td>
                      <td className="text-sm text-muted">{s.config?.mode ?? '—'}</td>
                      <td>
                        <span className="font-mono" style={{ color: pass ? 'var(--correct)' : 'var(--wrong)', fontWeight: 700 }}>
                          {pct}%
                        </span>
                      </td>
                      <td className="font-mono text-muted text-sm">{total}</td>
                      <td className="font-mono text-muted text-sm">{fmtTime(answeredTime)}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('review', { sessionId: s.id })}>
                            Review
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('analysis', { sessionId: s.id })}>
                            Summary
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--wrong)' }}
                            onClick={() => handleDelete(s.id)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
