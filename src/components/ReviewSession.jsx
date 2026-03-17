import React, { useState, useMemo, useEffect } from 'react'
import { getSession, getQuestionSet, getQuestionRating } from '../hooks/useStorage.js'
import TagBadge from './shared/TagBadge.jsx'
import DonutChart from './shared/DonutChart.jsx'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']

export default function ReviewSession({ sessionId, onNavigate }) {
  const [current, setCurrent] = useState(0)

  const session = getSession(sessionId)
  const set = session ? getQuestionSet(session.questionSetId) : null

  const questions = useMemo(() => {
    if (!set) return []
    if (session.questionIds) {
      const qMap = new Map(set.questions.map(q => [q.id, q]))
      return session.questionIds.map(id => qMap.get(id)).filter(Boolean)
    }
    let qs = set.questions
    if (session.config?.tagFilter?.length) {
      qs = qs.filter(q => {
        const tag = q.tag || q.tags?.system
        return !tag || session.config.tagFilter.includes(tag)
      })
    }
    return qs.slice(0, session.config?.questionCount ?? qs.length)
  }, [set, session])

  const answers = session?.results?.answers ?? []
  const revealed = session?.results?.revealed ?? []

  // Keyboard navigation
  useEffect(() => {
    function handleKeydown(e) {
      if (e.key === 'ArrowRight' && current < questions.length - 1) {
        e.preventDefault()
        setCurrent(c => c + 1)
      }
      if (e.key === 'ArrowLeft' && current > 0) {
        e.preventDefault()
        setCurrent(c => c - 1)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [current, questions.length])

  if (!session || !questions.length) {
    return <div style={{ padding: 40, color: 'var(--muted)' }}>Session not found.</div>
  }

  const q = questions[current]
  const answer = answers[current] ?? null
  const isCorrect = answer !== null && answer === q.answer
  const isWrong = answer !== null && answer !== q.answer

  // Compute stats for the donut
  const correct = answers.filter((a, i) => a !== null && questions[i] && a === questions[i].answer).length
  const answered = answers.filter(a => a !== null).length
  const wrongCount = answers.filter((a, i) => a !== null && questions[i] && a !== questions[i].answer).length
  const total = questions.length

  function qNavStatus(idx) {
    const a = answers[idx]
    const r = revealed[idx]
    if (idx === current) return 'current'
    const qn = questions[idx]
    if (!qn) return ''
    if (a === null) return r ? 'skipped' : ''
    return a === qn.answer ? 'correct' : 'wrong'
  }

  const rating = getQuestionRating(q.id || `q-${current}`)

  return (
    <div>
      {/* Header */}
      <div className="session-header" style={{ marginBottom: 0, borderRadius: 'var(--radius) var(--radius) 0 0', border: '1px solid var(--border)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
            Review: {session.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>
            Q {current + 1} / {questions.length}
          </div>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('analysis', { sessionId })}>
          ← Back to Summary
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('dashboard')}>
          Dashboard
        </button>
      </div>

      <div style={{ marginBottom: 20 }} />

      {/* Layout */}
      <div className="session-layout">
        {/* Left sidebar — nav grid */}
        <div className="session-sidebar-left card" style={{ padding: '14px' }}>
          <div className="section-title" style={{ marginBottom: 10 }}>Questions</div>
          <div className="q-nav-grid">
            {questions.map((_, idx) => (
              <button
                key={idx}
                className={`q-nav-btn${qNavStatus(idx) ? ' ' + qNavStatus(idx) : ''}`}
                onClick={() => setCurrent(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(102,187,106,.3)', display: 'inline-block' }} /> Correct
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(239,83,80,.2)', display: 'inline-block' }} /> Wrong
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(66,165,245,.2)', display: 'inline-block' }} /> Skipped
            </div>
          </div>
        </div>

        {/* Center — question card (read-only) */}
        <div>
          {/* Flag banners */}
          {rating.needsReview && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', marginBottom: 8, background: 'rgba(66,133,244,.1)', border: '1px solid rgba(66,133,244,.35)', borderRadius: 'var(--radius)', fontSize: 13, color: '#4285f4' }}>
              📌 <span>You marked this question for review</span>
            </div>
          )}
          {rating.validityConcern && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', marginBottom: 8, background: 'rgba(251,188,5,.12)', border: '1px solid rgba(251,188,5,.5)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--accent2)' }}>
              ⚠ <span>This question has been flagged for a validity concern</span>
            </div>
          )}

          <div className="card">
            {/* Tag */}
            {(q.tag || q.tags?.system) && (
              <div style={{ marginBottom: 12 }}>
                <TagBadge tagId={q.tag || q.tags?.system} />
              </div>
            )}

            {/* Stem */}
            <div style={{ fontFamily: 'IBM Plex Serif', fontSize: 15, lineHeight: 1.75, marginBottom: 16 }}>
              {q.stem}
            </div>

            {/* Image (optional) */}
            {q.image && (
              <div className="question-image-wrap">
                <img src={q.image} alt={q.imageAlt || 'Clinical image'} className="question-image" />
                {q.imageCaption && <div className="question-image-caption">{q.imageCaption}</div>}
              </div>
            )}

            {/* Lead */}
            {q.lead && (
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--accent2)', marginBottom: 18 }}>
                {q.lead}
              </div>
            )}

            {/* Choices — read-only with highlighting */}
            <div>
              {q.choices.map((choice, ci) => {
                const isCorrectChoice = ci === q.answer
                const isUserAnswer = ci === answer
                let borderColor = 'var(--border)'
                let bg = 'transparent'
                if (isCorrectChoice) { borderColor = 'var(--correct)'; bg = 'rgba(102,187,106,.1)' }
                else if (isUserAnswer && !isCorrectChoice) { borderColor = 'var(--wrong)'; bg = 'rgba(239,83,80,.08)' }

                return (
                  <div
                    key={ci}
                    style={{
                      padding: '10px 14px', borderRadius: 8,
                      border: `1.5px solid ${borderColor}`, background: bg,
                      marginBottom: 8, display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}
                  >
                    <span style={{
                      fontFamily: 'IBM Plex Mono', fontSize: 12, flexShrink: 0,
                      color: isCorrectChoice ? 'var(--correct)' : isUserAnswer ? 'var(--wrong)' : 'var(--muted)',
                    }}>
                      {LETTERS[ci]}
                    </span>
                    <span style={{ fontSize: 14 }}>{choice}</span>
                    {isCorrectChoice && (
                      <span style={{ marginLeft: 'auto', color: 'var(--correct)', fontSize: 13, flexShrink: 0 }}>✓ Correct</span>
                    )}
                    {isUserAnswer && !isCorrectChoice && (
                      <span style={{ marginLeft: 'auto', color: 'var(--wrong)', fontSize: 13, flexShrink: 0 }}>✗ Your answer</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Explanation — always shown */}
            {q.explanation && (
              <div className="explanation">
                <h4>Explanation</h4>
                <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
              </div>
            )}
            {q.keypoints?.length > 0 && (
              <div className="keypoints">
                <h4>⭐ Key Points</h4>
                <ul>
                  {q.keypoints.map((kp, i) => (
                    <li key={i}>{kp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <button className="btn btn-ghost" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>
              ← Prev
            </button>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>
              {current + 1} / {questions.length}
            </div>
            <button className="btn btn-ghost" onClick={() => setCurrent(c => c + 1)} disabled={current === questions.length - 1}>
              Next →
            </button>
          </div>
        </div>

        {/* Right sidebar — score overview */}
        <div className="session-sidebar-right">
          <div className="card" style={{ padding: 16, textAlign: 'center' }}>
            <DonutChart
              correct={correct}
              wrong={wrongCount}
              skipped={total - answered}
              total={total}
              answered={answered}
              size={100}
              thickness={11}
            />
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
              {correct}/{answered} correct
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="session-progress-bar">
        <div
          className="session-progress-fill"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
