import React, { useState, useEffect, useRef } from 'react'
import { useSession } from '../hooks/useSession.js'
import { getSession, getQuestionSet, getQuestionRating, setQuestionRating } from '../hooks/useStorage.js'
import TagBadge from './shared/TagBadge.jsx'
import DonutChart from './shared/DonutChart.jsx'
import Labs from './Labs.jsx'
import Calculator from './Calculator.jsx'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']

// ─── Timer display ────────────────────────────────────────────────────────────
function TimerDisplay({ elapsed, goalSec }) {
  if (!goalSec) {
    return <span className="timer-display timer-neutral">{fmtTime(elapsed)}</span>
  }
  const pct = elapsed / goalSec
  const cls = pct < 0.67 ? 'timer-green' : pct < 1 ? 'timer-amber' : 'timer-red'
  return <span className={`timer-display ${cls}`}>{fmtTime(elapsed)}</span>
}

function fmtTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

// ─── Question flag row ────────────────────────────────────────────────────────
function FlagRow({ questionId }) {
  const [flags, setFlags] = useState(() => getQuestionRating(questionId))

  function toggle(field) {
    const updated = setQuestionRating(questionId, { [field]: !flags[field] })
    setFlags(updated)
  }

  return (
    <div className="rating-row">
      <button
        className={`diff-btn${flags.needsReview ? ' active medium' : ''}`}
        onClick={() => toggle('needsReview')}
        title="Mark this question for personal review"
      >
        📌 {flags.needsReview ? 'Marked for Review' : 'Needs Review'}
      </button>
      <button
        className={`diff-btn${flags.validityConcern ? ' active hard' : ''}`}
        onClick={() => toggle('validityConcern')}
        title="Flag this question as potentially incorrect or poorly written"
      >
        ⚠ {flags.validityConcern ? 'Validity Flagged' : 'Flag Validity'}
      </button>
    </div>
  )
}

// ─── Main ActiveSession ───────────────────────────────────────────────────────
export default function ActiveSession({ sessionId, questionsOverride, onNavigate }) {
  const [pendingQuestions, setPendingQuestions] = useState(questionsOverride || null)
  const [sessionLoaded,    setSessionLoaded]    = useState(!!questionsOverride)

  // Load questions from storage when not passed directly (e.g. resume from history)
  useEffect(() => {
    if (questionsOverride) { setPendingQuestions(questionsOverride); setSessionLoaded(true); return }
    const s = getSession(sessionId)
    if (!s) return
    const set = getQuestionSet(s.questionSetId)
    if (set) {
      let qs
      if (s.questionIds) {
        const qMap = new Map(set.questions.map(q => [q.id, q]))
        qs = s.questionIds.map(id => qMap.get(id)).filter(Boolean)
      } else {
        qs = set.questions
        if (s.config?.tagFilter?.length) {
          qs = qs.filter(q => {
            const tag = q.tag || q.tags?.system
            return !tag || s.config.tagFilter.includes(tag)
          })
        }
        if (s.config?.questionCount) qs = qs.slice(0, s.config.questionCount)
      }
      setPendingQuestions(qs)
    }
    setSessionLoaded(true)
  }, [sessionId, questionsOverride])

  const [toolPanel,        setToolPanel]        = useState(null)   // null | 'labs' | 'calc'
  const [showEndDropdown,  setShowEndDropdown]   = useState(false)
  const [showTimer,        setShowTimer]         = useState(true)

  const engine = useSession(sessionId, pendingQuestions)

  const {
    session, questions, current, answers, revealed,
    displayOrders, eliminated_, timePerQ, isPaused, isComplete,
    currentQ, currentOrder, currentAnswer, isRevealed,
    goalSec, elapsed, mode, score,
    goTo, next, prev,
    selectChoice, submitAnswer,
    toggleEliminate, togglePause, completeSession, pauseSession,
  } = engine

  // ── Keyboard shortcuts ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isComplete || !currentQ) return

    function handleKeydown(e) {
      if (/^[0-9]$/.test(e.key)) {
        let choiceIdx = parseInt(e.key) - 1
        if (e.key === '0') choiceIdx = 9
        if (choiceIdx < currentQ.choices.length && !isRevealed && !isPaused) {
          e.preventDefault()
          selectChoice(choiceIdx)
        }
        return
      }
      if (e.code === 'Space') { e.preventDefault(); togglePause(); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); return }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); return }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [currentQ, isRevealed, isPaused, isComplete, selectChoice, togglePause, next, prev])

  if (!sessionLoaded || !session || !currentQ) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted)' }}>
        Loading session…
      </div>
    )
  }

  const isTestMode = mode === 'test'
  const isTutorMode = mode === 'tutor'
  const isLastQ = current === questions.length - 1

  // ── Choice rendering helper ─────────────────────────────────────────────
  function choiceClass(displayIdx) {
    const order    = displayOrders[current] || []
    const realIdx  = order[displayIdx]
    const isElim   = eliminated_.has(realIdx)
    const isSelected = currentAnswer === realIdx
    const isCorrect  = currentQ.answer === realIdx

    let cls = 'choice'
    if (isElim)    return cls + ' eliminated'
    if (!isRevealed) {
      if (isSelected) cls += ' selected'
    } else {
      if (isCorrect)            cls += ' correct'
      else if (isSelected)      cls += ' wrong'
    }
    if (isRevealed) cls += ' disabled'
    return cls
  }

  // ── Nav grid status ─────────────────────────────────────────────────────
  function qNavStatus(idx) {
    const a = answers[idx]
    const r = revealed[idx]
    if (idx === current) return 'current'
    // In test mode: show 'answered' status instead of correct/wrong (no reveals yet)
    if (isTestMode) {
      return a !== null ? 'answered' : ''
    }
    if (!r) return a !== null ? 'answered' : ''
    const q = questions[idx]
    if (!q) return ''
    if (a === null) return 'skipped'
    return a === q.answer ? 'correct' : 'wrong'
  }

  const wrongCount = answers.filter((a, i) => a !== null && questions[i] && a !== questions[i].answer).length

  // Sidebar stats gated on revealed[] to avoid leaking correct/wrong before Submit
  const revealedCorrect = answers.filter((a, i) => revealed[i] && a !== null && questions[i] && a === questions[i].answer).length
  const revealedWrong = answers.filter((a, i) => revealed[i] && a !== null && questions[i] && a !== questions[i].answer).length
  const revealedCount = revealed.filter(Boolean).length

  // ── Bottom nav button logic ─────────────────────────────────────────────
  // Tutor mode: no answer → Next (skip), answer selected but not revealed → Submit, revealed → Next/End Session
  // Test mode: always Next/End Session (no per-question submit)
  function renderBottomRight() {
    if (isTutorMode) {
      // Answer selected but not yet revealed → Submit
      if (currentAnswer !== null && !isRevealed) {
        return (
          <button className="btn btn-primary" onClick={submitAnswer}>
            Submit
          </button>
        )
      }
      // After reveal or no answer selected
      if (isLastQ) {
        return (
          <button className="btn btn-primary" onClick={completeSession}>
            End Session
          </button>
        )
      }
      return (
        <button className="btn btn-ghost" onClick={next}>
          Next →
        </button>
      )
    }

    // Test mode — simple Next / End Session
    if (isLastQ) {
      return (
        <button className="btn btn-primary" onClick={completeSession}>
          End Session
        </button>
      )
    }
    return (
      <button className="btn btn-ghost" onClick={next}>
        Next →
      </button>
    )
  }

  return (
    <div>
      {/* ── Session Header ── */}
      <div className="session-header" style={{ marginBottom: 0, borderRadius: 'var(--radius) var(--radius) 0 0', border: '1px solid var(--border)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{session.title}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>
            Q {current + 1} / {questions.length}
          </div>
        </div>

        {/* Timer + toggle */}
        {showTimer ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <TimerDisplay elapsed={elapsed} goalSec={goalSec} />
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding: '2px 6px', fontSize: 12 }}
              onClick={() => setShowTimer(false)}
              title="Hide timer"
            >
              👁
            </button>
          </div>
        ) : (
          <button
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 12, color: 'var(--muted)' }}
            onClick={() => setShowTimer(true)}
            title="Show timer"
          >
            👁‍🗨 Timer
          </button>
        )}

        {/* Pause */}
        <button className="btn btn-ghost btn-sm" onClick={togglePause}>
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>

        {/* Tool panel toggles */}
        <div style={{ display: 'flex', gap: 5, marginLeft: 4 }}>
          <button
            className={`tool-panel-btn${toolPanel === 'labs' ? ' active' : ''}`}
            onClick={() => setToolPanel(p => p === 'labs' ? null : 'labs')}
            title="Labs Reference"
          >
            📋 Labs
          </button>
          <button
            className={`tool-panel-btn${toolPanel === 'calc' ? ' active' : ''}`}
            onClick={() => setToolPanel(p => p === 'calc' ? null : 'calc')}
            title="Calculator"
          >
            🔢 Calc
          </button>
        </div>

        {/* End Session dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--wrong)', borderColor: 'rgba(239,83,80,.3)' }}
            onClick={() => setShowEndDropdown(s => !s)}
          >
            ✕ End
          </button>
          {showEndDropdown && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 6,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: 6, zIndex: 100,
              minWidth: 160, boxShadow: '0 8px 24px rgba(0,0,0,.4)',
            }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', textAlign: 'left', marginBottom: 4 }}
                onClick={() => setShowEndDropdown(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', textAlign: 'left', marginBottom: 4, color: 'var(--accent)' }}
                onClick={() => {
                  setShowEndDropdown(false)
                  pauseSession()
                  onNavigate('dashboard')
                }}
              >
                ⏸ Pause
              </button>
              <button
                className="btn btn-danger btn-sm"
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => {
                  setShowEndDropdown(false)
                  completeSession()
                }}
              >
                End Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* spacer below header area */}
      <div style={{ marginBottom: 20 }} />

      {/* ── Layout ── */}
      <div className={isTestMode ? 'session-layout session-layout-no-right' : 'session-layout'}>
        {/* Left sidebar — nav grid */}
        <div className="session-sidebar-left card" style={{ padding: '14px' }}>
          <div className="section-title" style={{ marginBottom: 10 }}>Questions</div>
          <div className="q-nav-grid">
            {questions.map((_, idx) => (
              <button
                key={idx}
                className={`q-nav-btn${qNavStatus(idx) ? ' ' + qNavStatus(idx) : ''}`}
                onClick={() => goTo(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {isTestMode ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(66,165,245,.3)', display: 'inline-block' }} /> Answered
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--surface2)', display: 'inline-block' }} /> Unanswered
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(102,187,106,.3)', display: 'inline-block' }} /> Correct
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(239,83,80,.2)', display: 'inline-block' }} /> Wrong
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(66,165,245,.2)', display: 'inline-block' }} /> Skipped
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center — question card */}
        <div>
          {isPaused && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(15,17,23,.92)',
              backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 150,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏸</div>
                <div style={{ fontSize: 22, fontFamily: 'IBM Plex Serif', fontWeight: 600, marginBottom: 8 }}>Session Paused</div>
                <div style={{ color: 'var(--muted)', marginBottom: 24 }}>Timer is stopped</div>
                <button className="btn btn-primary" onClick={togglePause}>▶ Resume Session</button>
              </div>
            </div>
          )}

          {/* Flag warning banners */}
          {(() => {
            const f = getQuestionRating(currentQ.id || `q-${current}`)
            return (
              <>
                {f.needsReview && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', marginBottom: 8, background: 'rgba(66,133,244,.1)', border: '1px solid rgba(66,133,244,.35)', borderRadius: 'var(--radius)', fontSize: 13, color: '#4285f4' }}>
                    📌 <span>You've marked this question for review</span>
                  </div>
                )}
                {f.validityConcern && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', marginBottom: 8, background: 'rgba(251,188,5,.12)', border: '1px solid rgba(251,188,5,.5)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--accent2)' }}>
                    ⚠ <span>This question has been flagged for a validity concern</span>
                  </div>
                )}
              </>
            )
          })()}

          <div className="card">
            {/* Tag */}
            {(currentQ.tag || currentQ.tags?.system) && (
              <div style={{ marginBottom: 12 }}>
                <TagBadge tagId={currentQ.tag || currentQ.tags?.system} />
              </div>
            )}

            {/* Stem */}
            <div style={{ fontFamily: 'IBM Plex Serif', fontSize: 15, lineHeight: 1.75, marginBottom: 16 }}>
              {currentQ.stem}
            </div>

            {/* Image (optional) */}
            {currentQ.image && (
              <div className="question-image-wrap">
                <img
                  src={currentQ.image}
                  alt={currentQ.imageAlt || 'Clinical image'}
                  className="question-image"
                />
                {currentQ.imageCaption && (
                  <div className="question-image-caption">{currentQ.imageCaption}</div>
                )}
              </div>
            )}

            {/* Lead */}
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--accent2)', marginBottom: 18 }}>
              {currentQ.lead}
            </div>

            {/* Choices */}
            <div>
              {currentOrder.map((realIdx, displayIdx) => {
                const isElim = eliminated_.has(realIdx)
                return (
                  <div
                    key={displayIdx}
                    className={choiceClass(displayIdx)}
                    onClick={() => !isRevealed && !isElim && selectChoice(displayIdx)}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      if (!isRevealed) toggleEliminate(displayIdx)
                    }}
                  >
                    <div className="choice-content">
                      <span className="choice-letter">{LETTERS[displayIdx]}</span>
                      <span>{currentQ.choices[realIdx]}</span>
                    </div>
                    {isRevealed && currentQ.answer === realIdx && (
                      <span style={{ marginLeft: 'auto', color: 'var(--correct)', flexShrink: 0, paddingRight: 4 }}>✓</span>
                    )}
                    {!isRevealed && (
                      <button
                        className={`choice-eliminate-btn${isElim ? ' is-eliminated' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleEliminate(displayIdx) }}
                        title={isElim ? 'Restore choice' : 'Cross out choice'}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Explanation (shown after reveal — tutor mode only during session) */}
            {isRevealed && (
              <>
                {currentQ.explanation && (
                  <div className="explanation">
                    <h4>Explanation</h4>
                    <div dangerouslySetInnerHTML={{ __html: currentQ.explanation }} />
                  </div>
                )}
                {currentQ.keypoints?.length > 0 && (
                  <div className="keypoints">
                    <h4>⭐ Key Points</h4>
                    <ul>
                      {currentQ.keypoints.map((kp, i) => (
                        <li key={i}>{kp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <FlagRow questionId={currentQ.id || `q-${current}`} />
              </>
            )}

            {/* Eliminate tip */}
            {!isRevealed && (
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
                Click <strong style={{ color: 'var(--wrong)' }}>✕</strong> on a choice to cross it out · Right-click also works
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <button className="btn btn-ghost" onClick={prev} disabled={current === 0}>
              ← Prev
            </button>

            <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>
              {current + 1} / {questions.length}
            </div>

            {renderBottomRight()}
          </div>
        </div>

        {/* Right sidebar — score + topic breakdown (tutor mode only) */}
        {!isTestMode && (
          <div className="session-sidebar-right">
            <div className="card" style={{ padding: 16, textAlign: 'center', marginBottom: 14 }}>
              <DonutChart
                correct={revealedCorrect}
                wrong={revealedWrong}
                skipped={0}
                total={score.total}
                answered={revealedCount}
                size={100}
                thickness={11}
              />
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
                {revealedCount}/{score.total} answered
              </div>
            </div>

            {/* Topic breakdown */}
            <div className="card" style={{ padding: 14 }}>
              <div className="section-title" style={{ marginBottom: 10 }}>By Topic</div>
              {Array.from(
                questions.reduce((acc, q, i) => {
                  const tag = q.tag || q.tags?.system || 'general'
                  if (!acc.has(tag)) acc.set(tag, { correct: 0, answered: 0 })
                  if (revealed[i]) {
                    acc.get(tag).answered++
                    if (answers[i] === q.answer) acc.get(tag).correct++
                  }
                  return acc
                }, new Map())
              ).map(([tag, { correct, answered }]) => (
                <div key={tag} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11 }}><TagBadge tagId={tag} small /></span>
                    <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--muted)' }}>
                      {correct}/{answered}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${answered > 0 ? (correct / answered) * 100 : 0}%`,
                        background: answered > 0 && correct / answered >= 0.75 ? 'var(--correct)' : 'var(--wrong)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Fixed progress bar at bottom of viewport ── */}
      <div className="session-progress-bar">
        <div
          className="session-progress-fill"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* ── Tool panel (Labs / Calculator) ── */}
      {toolPanel && (
        <>
          <div className="tool-panel-overlay" onClick={() => setToolPanel(null)} />
          <div className="tool-panel">
            <div className="tool-panel-header">
              <span className="tool-panel-header-title">
                {toolPanel === 'labs' ? '📋 Labs Reference' : '🔢 Calculator'}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => setToolPanel(null)}>✕</button>
            </div>
            <div className="tool-panel-body">
              {toolPanel === 'labs' ? <Labs /> : <Calculator />}
            </div>
          </div>
        </>
      )}

      {/* ── Completion overlay ── */}
      {isComplete && (
        <div className="modal-overlay">
          <div className="modal" style={{ textAlign: 'center', maxWidth: 540, padding: '36px 40px' }}>
            <div className="modal-title" style={{ fontSize: 22, marginBottom: 24 }}>Session Complete!</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <DonutChart
                correct={score.correct}
                wrong={wrongCount}
                skipped={score.total - score.answered}
                total={score.total}
                answered={score.answered}
                size={150}
                thickness={18}
              />
            </div>
            <div
              className={`completion-score ${score.answered > 0 && score.correct / score.answered >= 0.75 ? 'completion-pass' : 'completion-fail'}`}
            >
              {score.answered > 0 ? Math.round((score.correct / score.answered) * 100) : 0}%
            </div>
            <div style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 15 }}>
              {score.correct} / {score.answered} answered correctly
              {score.answered > 0 && score.correct / score.answered >= 0.75
                ? ' — Passing!'
                : ' — Keep practicing (≥75% to pass)'}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost" style={{ flex: '1 1 120px', justifyContent: 'center' }} onClick={() => onNavigate('dashboard')}>
                Dashboard
              </button>
              <button className="btn btn-ghost" style={{ flex: '1 1 120px', justifyContent: 'center' }} onClick={() => onNavigate('review', { sessionId: session.id })}>
                Review Questions
              </button>
              <button className="btn btn-primary" style={{ flex: '1 1 120px', justifyContent: 'center' }} onClick={() => onNavigate('analysis', { sessionId: session.id })}>
                View Analysis →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
