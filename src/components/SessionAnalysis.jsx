import React, { useState, useMemo } from 'react'
import DonutChart from './shared/DonutChart.jsx'
import TagBadge from './shared/TagBadge.jsx'
import { getSession, getQuestionSet, saveSession, getQuestionRating } from '../hooks/useStorage.js'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']

function fmtTime(s) {
  if (s == null) return '—'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function fmtPct(n, d) {
  if (!d) return '—'
  return `${Math.round((n / d) * 100)}%`
}

// ── Accuracy bar ───────────────────────────────────────────────────────────
function AccuracyBar({ label, correct, total, color }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  return (
    <div className="accuracy-bar-row">
      <div className="accuracy-bar-label" style={{ fontSize: 13 }}>
        {typeof label === 'string' ? <TagBadge tagId={label} /> : label}
      </div>
      <div className="accuracy-bar-track">
        <div
          className="accuracy-bar-fill"
          style={{
            width: `${pct}%`,
            background: color || (pct >= 75 ? 'var(--correct)' : pct >= 50 ? 'var(--accent2)' : 'var(--wrong)'),
          }}
        />
      </div>
      <div className="accuracy-bar-pct">{pct}%</div>
      <div style={{ width: 52, fontSize: 12, color: 'var(--muted)', textAlign: 'right', fontFamily: 'IBM Plex Mono' }}>
        {correct}/{total}
      </div>
    </div>
  )
}

// ── Question review row ────────────────────────────────────────────────────
function QuestionReviewRow({ q, idx, answer, isRevealed }) {
  const [open, setOpen] = useState(false)
  const isCorrect = answer !== null && answer === q.answer
  const isWrong   = answer !== null && answer !== q.answer
  const isSkipped = answer === null && isRevealed
  const isBlank   = answer === null && !isRevealed

  const statusIcon = isCorrect ? '✓' : isWrong ? '✗' : isSkipped ? '→' : '○'
  const statusColor = isCorrect ? 'var(--correct)' : isWrong ? 'var(--wrong)' : isSkipped ? 'var(--skipped)' : 'var(--muted)'

  const rating = getQuestionRating(q.id || `q-${idx}`)

  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 12 }}>
      <div
        style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, color: statusColor, fontSize: 15, flexShrink: 0, marginTop: 2 }}>
          {statusIcon}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--muted)' }}>Q{idx + 1}</span>
            {(q.tag || q.tags?.system) && <TagBadge tagId={q.tag || q.tags?.system} small />}
            {rating.needsReview && <span style={{ fontSize: 11, color: '#4285f4' }}>📌 Review</span>}
            {rating.validityConcern && <span style={{ fontSize: 11, color: 'var(--accent2)' }}>⚠ Validity</span>}
          </div>
          <div style={{ fontFamily: 'IBM Plex Serif', fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
            {q.stem?.slice(0, 120)}{q.stem?.length > 120 ? '…' : ''}
          </div>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 16, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{ marginTop: 14, paddingLeft: 28 }}>
          <div style={{ fontFamily: 'IBM Plex Serif', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{q.stem}</div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--accent2)', marginBottom: 10 }}>{q.lead}</div>

          {/* Choices */}
          <div style={{ marginBottom: 14 }}>
            {q.choices.map((c, ci) => {
              let style = { padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', marginBottom: 6, fontSize: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }
              if (ci === q.answer) style = { ...style, borderColor: 'var(--correct)', background: 'rgba(102,187,106,.1)' }
              else if (ci === answer && ci !== q.answer) style = { ...style, borderColor: 'var(--wrong)', background: 'rgba(239,83,80,.08)' }
              return (
                <div key={ci} style={style}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: ci === q.answer ? 'var(--correct)' : 'var(--muted)', flexShrink: 0 }}>
                    {LETTERS[ci]}
                  </span>
                  <span>{c}</span>
                  {ci === q.answer && <span style={{ marginLeft: 'auto', color: 'var(--correct)' }}>✓ Correct</span>}
                  {ci === answer && ci !== q.answer && <span style={{ marginLeft: 'auto', color: 'var(--wrong)' }}>✗ Your answer</span>}
                </div>
              )
            })}
          </div>

          {q.explanation && (
            <div className="explanation">
              <h4>Explanation</h4>
              <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
            </div>
          )}
          {q.keypoints?.length > 0 && (
            <div className="keypoints" style={{ marginTop: 10 }}>
              <h4>⭐ Key Points</h4>
              <ul>{q.keypoints.map((kp, i) => <li key={i}>{kp}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main SessionAnalysis ───────────────────────────────────────────────────
export default function SessionAnalysis({ sessionId, onNavigate }) {
  const [notesVal, setNotesVal]   = useState('')
  const [ratingVal, setRatingVal] = useState(null)
  const [reviewFilter, setFilter] = useState('all') // 'all' | 'wrong' | 'correct'

  const session = getSession(sessionId)
  const set     = session ? getQuestionSet(session.questionSetId) : null

  // Build questions snapshot — ID-based for sessions with questionIds, legacy slice fallback
  const questions = useMemo(() => {
    if (!set) return []
    if (session.questionIds) {
      const qMap = new Map(set.questions.map(q => [q.id, q]))
      return session.questionIds.map(id => qMap.get(id)).filter(Boolean)
    }
    // Legacy fallback
    let qs = set.questions
    if (session.config?.tagFilter?.length) {
      qs = qs.filter(q => {
        const tag = q.tag || q.tags?.system
        return !tag || session.config.tagFilter.includes(tag)
      })
    }
    return qs.slice(0, session.config?.questionCount ?? qs.length)
  }, [set, session])

  // Initialise notes / rating from saved session
  const [loaded, setLoaded] = useState(false)
  if (!loaded && session) {
    setNotesVal(session.sessionNotes || '')
    setRatingVal(session.sessionRating || null)
    setLoaded(true)
  }

  if (!session) return <div style={{ color: 'var(--muted)', padding: 40 }}>Session not found.</div>

  const answers  = session.results?.answers  ?? []
  const revealed = session.results?.revealed ?? []
  const timePerQ = session.results?.timePerQ ?? []
  const goalSec  = session.config?.goalSec   ?? 90

  const correct  = answers.filter((a, i) => a !== null && questions[i] && a === questions[i].answer).length
  const wrong    = answers.filter((a, i) => a !== null && questions[i] && a !== questions[i].answer).length
  const skipped  = answers.filter((a, i) => a === null && revealed[i]).length
  const answered = answers.filter(a => a !== null).length
  const total    = questions.length

  // By-tag breakdown — denominator is answered questions only (not total)
  const tagStats = useMemo(() => {
    const m = new Map()
    questions.forEach((q, i) => {
      const tag = q.tag || q.tags?.system || 'general'
      if (!m.has(tag)) m.set(tag, { correct: 0, answered: 0, time: 0 })
      if (answers[i] !== null) {
        m.get(tag).answered++
        m.get(tag).time += timePerQ[i] || 0
        if (answers[i] === q.answer) m.get(tag).correct++
      }
    })
    return m
  }, [questions, answers, timePerQ])

  const answeredTime = answers.reduce((sum, a, i) => a !== null ? sum + (timePerQ[i] || 0) : sum, 0)
  const avgTime      = answered > 0 ? Math.round(answeredTime / answered) : 0

  function saveNotes() {
    const updated = { ...session, sessionNotes: notesVal, sessionRating: ratingVal }
    saveSession(updated)
  }

  function exportJSON() {
    const data = {
      session: { ...session, _questions: questions },
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_')}_analysis.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter questions for review
  const reviewQs = questions.filter((q, i) => {
    if (reviewFilter === 'correct') return answers[i] !== null && answers[i] === q.answer
    if (reviewFilter === 'wrong')   return answers[i] !== null && answers[i] !== q.answer
    return true
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('dashboard')} style={{ marginBottom: 8 }}>
            ← Dashboard
          </button>
          <h2 style={{ fontSize: 22 }}>{session.title}</h2>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'IBM Plex Mono', marginTop: 4 }}>
            {formatDate(session.date)} · {session.config?.mode === 'test' ? 'Test Mode' : 'Tutor Mode'} · {session.config?.examLevel?.toUpperCase()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={exportJSON}>Export JSON ↓</button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('review', { sessionId })}>
            Review Session
          </button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <DonutChart correct={correct} wrong={wrong} skipped={skipped} total={total} answered={answered} size={80} thickness={10} />
          <div>
            <div className="stat-label">Score</div>
            <div className="stat-value" style={{ color: answered > 0 && correct / answered >= 0.75 ? 'var(--correct)' : 'var(--wrong)' }}>
              {fmtPct(correct, answered)}
            </div>
            <div className="stat-sub">{correct}/{answered} answered</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Correct</div>
          <div className="stat-value" style={{ color: 'var(--correct)' }}>{correct}</div>
          <div className="stat-sub">of {total} total</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Skipped</div>
          <div className="stat-value">{total - answered}</div>
          <div className="stat-sub">{answered} answered</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Time / Q</div>
          <div className="stat-value">{fmtTime(avgTime)}</div>
          {goalSec > 0 && <div className="stat-sub">Goal: {fmtTime(goalSec)}</div>}
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Time (answered)</div>
          <div className="stat-value">{fmtTime(answeredTime)}</div>
        </div>
      </div>

      <div className="analytics-grid" style={{ marginBottom: 28 }}>
        {/* Accuracy by tag */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 14 }}>Accuracy by Topic</div>
          {[...tagStats.entries()].map(([tag, { correct: c, answered: a }]) => (
            <AccuracyBar key={tag} label={tag} correct={c} total={a} />
          ))}
        </div>

        {/* Time per question table */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 14 }}>Time per Question</div>
          <div className="table-wrap" style={{ maxHeight: 320, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Q#</th>
                  <th>Topic</th>
                  <th>Result</th>
                  <th>Time</th>
                  {goalSec > 0 && <th>vs Goal</th>}
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => {
                  const a = answers[i]
                  const isCorr = a !== null && a === q.answer
                  const t = timePerQ[i] || 0
                  const over = goalSec > 0 && t > goalSec
                  return (
                    <tr key={i}>
                      <td className="font-mono text-muted">{i + 1}</td>
                      <td><TagBadge tagId={q.tag || q.tags?.system} small /></td>
                      <td>
                        <span style={{ color: a === null ? 'var(--muted)' : isCorr ? 'var(--correct)' : 'var(--wrong)', fontWeight: 600 }}>
                          {a === null ? '—' : isCorr ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="font-mono" style={{ color: over ? 'var(--wrong)' : 'var(--text)' }}>{fmtTime(t)}</td>
                      {goalSec > 0 && (
                        <td className="font-mono" style={{ color: over ? 'var(--wrong)' : 'var(--correct)', fontSize: 12 }}>
                          {t === 0 ? '—' : over ? `+${fmtTime(t - goalSec)}` : `-${fmtTime(goalSec - t)}`}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Session notes & rating */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Session Notes & Rating</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              style={{ minHeight: 80, resize: 'vertical' }}
              placeholder="e.g. 'Review cardiogenic shock hemodynamics…'"
              value={notesVal}
              onChange={e => setNotesVal(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Session Rating</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRatingVal(n === ratingVal ? null : n)}
                  style={{
                    width: 34, height: 34, borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: n <= (ratingVal || 0) ? 'rgba(249,168,37,.2)' : 'var(--surface2)',
                    color: n <= (ratingVal || 0) ? 'var(--accent2)' : 'var(--muted)',
                    cursor: 'pointer', fontSize: 18,
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={saveNotes}>Save Notes</button>
        </div>
      </div>

      {/* Question-by-question review */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div className="section-title">Question Review ({reviewQs.length})</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'wrong', 'correct'].map(f => (
              <button
                key={f}
                className={`diff-btn${reviewFilter === f ? ' active medium' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {reviewQs.map((q, i) => {
          const origIdx = questions.indexOf(q)
          return (
            <QuestionReviewRow
              key={q.id || i}
              q={q}
              idx={origIdx}
              answer={answers[origIdx] ?? null}
              isRevealed={revealed[origIdx] ?? false}
            />
          )
        })}
      </div>
    </div>
  )
}
