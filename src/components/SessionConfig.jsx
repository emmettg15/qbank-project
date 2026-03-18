import React, { useState, useMemo, useEffect } from 'react'
import TagBadge from './shared/TagBadge.jsx'
import { getTagLabel } from '../data/taggingSystem.js'
import { importQuestionSet, createSession, getQuestionRating } from '../hooks/useStorage.js'

const TIMER_PRESETS = [
  { label: '60s',  value: 60  },
  { label: '90s',  value: 90  },
  { label: '2 min',value: 120 },
  { label: '3 min',value: 180 },
  { label: 'Off',  value: 0   },
]

const EXAM_LEVELS = [
  { id: 'step1', label: 'Step 1' },
  { id: 'step2', label: 'Step 2 CK' },
  { id: 'step3', label: 'Step 3' },
]

export default function SessionConfig({ title, questions, existingSetId, onStart, onClose }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Detect all tags present in the question set
  const allTags = useMemo(() => {
    const tagSet = new Set()
    questions.forEach(q => {
      if (q.tag) tagSet.add(q.tag)
      if (q.tags?.system) tagSet.add(q.tags.system)
    })
    return [...tagSet]
  }, [questions])

  const [selectedTags,    setSelectedTags]    = useState(new Set(allTags))
  const [examLevel,       setExamLevel]       = useState('step1')
  const [mode,            setMode]            = useState('tutor')    // 'tutor' | 'test'
  const [goalSec,         setGoalSec]         = useState(90)
  const [maxQ,            setMaxQ]            = useState(null)       // null = all
  const [shuffle, setShuffle] = useState(false)
  const [validityWarning, setValidityWarning] = useState(null)       // null | { count, pool, setId }

  // Filtered question count
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const tag = q.tag || q.tags?.system
      return !tag || selectedTags.has(tag)
    })
  }, [questions, selectedTags])

  const qCount = Math.min(maxQ ?? filteredQuestions.length, filteredQuestions.length)

  function toggleTag(tag) {
    setSelectedTags(prev => {
      const next = new Set(prev)
      if (next.has(tag)) { next.delete(tag) } else { next.add(tag) }
      return next
    })
  }

  function handleStart() {
    // Save question set (or reuse existing)
    let setId = existingSetId
    if (!setId) {
      const qs = importQuestionSet({ title, questions, source: 'upload' })
      setId = qs.id
    }

    // Sample questions
    let pool = filteredQuestions
    if (maxQ && maxQ < pool.length) {
      const shuffled = [...pool].sort(() => Math.random() - .5)
      pool = shuffled.slice(0, maxQ)
    }

    // Check for validity-flagged questions
    const flaggedCount = pool.filter(q => getQuestionRating(q.id).validityConcern).length
    if (flaggedCount > 0) {
      setValidityWarning({ count: flaggedCount, pool, setId })
      return
    }

    launchSession(pool, setId)
  }

  function launchSession(pool, setId) {
    // Fisher-Yates shuffle if enabled
    if (shuffle) {
      pool = [...pool]
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]
      }
    }

    const session = createSession({
      title,
      questionSetId: setId,
      config: {
        tagFilter: [...selectedTags],
        examLevel,
        questionCount: pool.length,
        mode,
        goalSec,
        shuffle,
      },
      questions: pool,
    })
    session._questions = pool
    onStart(session.id, pool)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-title">Configure Session</div>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16, marginTop: -12 }}>
          {title}
        </div>

        {/* Exam Level */}
        <div className="form-group">
          <label className="form-label">Exam Level</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {EXAM_LEVELS.map(l => (
              <button
                key={l.id}
                className={`diff-btn${examLevel === l.id ? ' active medium' : ''}`}
                style={{ padding: '6px 16px' }}
                onClick={() => setExamLevel(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        {allTags.length > 1 && (
          <div className="form-group">
            <label className="form-label">
              Topics / Tags
              <span style={{ color: 'var(--accent)', marginLeft: 8 }}>
                {filteredQuestions.length} Q available
              </span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allTags.map(tag => (
                <div
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{ cursor: 'pointer', opacity: selectedTags.has(tag) ? 1 : 0.35, transition: 'opacity .15s' }}
                >
                  <TagBadge
                    tagId={tag}
                    label={`${getTagLabel(tag)} (${questions.filter(q => (q.tag || q.tags?.system) === tag).length})`}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTags(new Set(allTags))}>Select All</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTags(new Set())}>Clear All</button>
            </div>
          </div>
        )}

        {/* Question Count */}
        <div className="form-group">
          <label className="form-label">
            Number of Questions
            <span style={{ color: 'var(--accent)', marginLeft: 8 }}>{qCount}</span>
          </label>
          <input
            type="range"
            min={1}
            max={filteredQuestions.length}
            value={maxQ ?? filteredQuestions.length}
            onChange={e => setMaxQ(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4, fontFamily: 'IBM Plex Mono' }}>
            <span>1</span>
            <span>All ({filteredQuestions.length})</span>
          </div>
        </div>

        {/* Mode */}
        <div className="form-group">
          <label className="form-label">Mode</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`diff-btn${mode === 'tutor' ? ' active easy' : ''}`}
              style={{ padding: '6px 16px' }}
              onClick={() => setMode('tutor')}
            >
              Tutor (immediate feedback)
            </button>
            <button
              className={`diff-btn${mode === 'test' ? ' active hard' : ''}`}
              style={{ padding: '6px 16px' }}
              onClick={() => setMode('test')}
            >
              Test (deferred reveal)
            </button>
          </div>
        </div>

        {/* Shuffle */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={shuffle}
              onChange={e => setShuffle(e.target.checked)}
            />
            <span className="form-label" style={{ margin: 0 }}>Shuffle questions & answer choices</span>
          </label>
        </div>

        {/* Timer Goal */}
        <div className="form-group">
          <label className="form-label">Timer Goal Per Question</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TIMER_PRESETS.map(p => (
              <button
                key={p.value}
                className={`diff-btn${goalSec === p.value ? ' active medium' : ''}`}
                onClick={() => setGoalSec(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Validity warning */}
        {validityWarning && (
          <div style={{ padding: '14px 16px', background: 'rgba(251,188,5,.12)', border: '1px solid rgba(251,188,5,.5)', borderRadius: 'var(--radius)', marginTop: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--accent2)' }}>
              ⚠ {validityWarning.count} question{validityWarning.count !== 1 ? 's' : ''} flagged for validity concerns
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
              These questions will be marked with a warning banner during the session.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setValidityWarning(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={() => { setValidityWarning(null); launchSession(validityWarning.pool, validityWarning.setId) }}>
                Start Anyway →
              </button>
            </div>
          </div>
        )}
        {/* Action buttons */}
        {!validityWarning && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border)', marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleStart}
              disabled={qCount === 0}
            >
              Start {qCount} Question{qCount !== 1 ? 's' : ''} →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
