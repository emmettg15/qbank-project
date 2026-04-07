/**
 * useSession — question engine hook (ported from original vanilla JS)
 *
 * Manages all active-session state:
 *   - current question index
 *   - answers, revealed, eliminated sets
 *   - per-question timer
 *   - shuffle of choice display order
 *   - pause state
 *   - score computation
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useStorage } from './useStorage.js'

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Build choice display order for every question (shuffled or identity)
function buildDisplayOrders(questions, shouldShuffle = true) {
  return questions.map(q => {
    const indices = q.choices.map((_, i) => i)
    return shouldShuffle ? shuffle(indices) : indices
  })
}

export function useSession(sessionId, questionsOverride) {
  const storage = useStorage()
  const [session,  setSession]  = useState(null)
  const [questions, setQuestions] = useState([])
  const [displayOrders, setDisplayOrders] = useState([])

  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState([])    // index in choices[], or null
  const [revealed,  setRevealed]  = useState([])    // bool per question
  const [eliminated,setEliminated]= useState([])    // Set<number> per question
  const [timePerQ,  setTimePerQ]  = useState([])    // seconds per question
  const [isPaused,  setIsPaused]  = useState(false)
  const [isComplete,setIsComplete]= useState(false)

  const timerRef     = useRef(null)
  const startTimeRef = useRef(Date.now())
  const elapsedRef   = useRef(0)   // seconds accumulated on current Q before pause
  const timePerQRef  = useRef([])  // mirror of timePerQ for synchronous reads in goTo

  // ── Load session ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return
    const s = storage.getSession(sessionId)
    if (!s) return
    setSession(s)

    let qs = questionsOverride
    if (!qs) {
      const set = storage.getQuestionSet(s.questionSetId)
      if (set) {
        if (s.questionIds) {
          // ID-based lookup — preserves original order and survives question set edits
          const qMap = new Map(set.questions.map(q => [q.id, q]))
          qs = s.questionIds.map(id => qMap.get(id)).filter(Boolean)
        } else {
          // Legacy fallback for sessions without questionIds
          qs = set.questions.filter((_, i) => i < s.config.questionCount)
        }
      }
    }
    qs = qs || []
    setQuestions(qs)
    const shouldShuffle = s.config?.shuffle !== false && s.config?.shuffleQuestions !== false
    setDisplayOrders(buildDisplayOrders(qs, shouldShuffle))

    // Restore from saved results (pad arrays to match question count)
    const pad = (arr, len, fill) => { const a = [...(arr || [])]; while (a.length < len) a.push(fill()); return a.slice(0, len) }
    setAnswers(pad(s.results.answers, qs.length, () => null))
    setRevealed(pad(s.results.revealed, qs.length, () => false))
    setEliminated(pad((s.results.eliminated || []).map(a => new Set(Array.isArray(a) ? a : [])), qs.length, () => new Set()))
    const restoredTime = pad(s.results.timePerQ, qs.length, () => 0)
    setTimePerQ(restoredTime)
    timePerQRef.current = restoredTime
    // Fix: initialize elapsed ref from saved time so timer resumes correctly
    elapsedRef.current = restoredTime[0] || 0
    startTimeRef.current = Date.now()
    setIsComplete(s.completed || false)
  }, [sessionId])

  // ── Timer ──────────────────────────────────────────────────────────────────
  // Depend on session?.id (stable) instead of session (new object every persist cycle)
  const sessionId_ = session?.id
  useEffect(() => {
    if (isPaused || isComplete || !sessionId_) return

    startTimeRef.current = Date.now()

    timerRef.current = setInterval(() => {
      const now = Date.now()
      const elapsed = elapsedRef.current + Math.floor((now - startTimeRef.current) / 1000)
      timePerQRef.current[current] = elapsed
      setTimePerQ(prev => {
        const next = [...prev]
        next[current] = elapsed
        return next
      })
    }, 500)

    return () => clearInterval(timerRef.current)
  }, [current, isPaused, isComplete, sessionId_])

  // ── Persist on state change ───────────────────────────────────────────────
  const persistRef = useRef(null)
  useEffect(() => {
    if (!session) return
    clearTimeout(persistRef.current)
    persistRef.current = setTimeout(() => {
      const correct  = answers.filter((a, i) => a !== null && questions[i] && a === questions[i].answer).length
      const answered = answers.filter(a => a !== null).length
      const updated = {
        ...session,
        results: {
          answers,
          revealed,
          eliminated: eliminated.map(s => [...s]),
          timePerQ,
        },
        score: { correct, answered, total: questions.length },
        completed: isComplete,
        status: isComplete ? 'completed' : (session.status || 'active'),
      }
      storage.saveSession(updated)
      setSession(updated)
    }, 2000)
  }, [answers, revealed, eliminated, timePerQ, isComplete])

  // ── Navigation ────────────────────────────────────────────────────────────
  function saveCurrentTime() {
    const now = Date.now()
    elapsedRef.current += Math.floor((now - startTimeRef.current) / 1000)
    startTimeRef.current = now
  }

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= questions.length) return
    saveCurrentTime()
    // Save current Q's accumulated time to the ref and state
    timePerQRef.current[current] = elapsedRef.current
    setTimePerQ(prev => {
      const next = [...prev]
      next[current] = elapsedRef.current
      return next
    })
    // Restore target Q's elapsed time synchronously from ref
    elapsedRef.current = timePerQRef.current[idx] || 0
    startTimeRef.current = Date.now()
    setCurrent(idx)
  }, [current, questions.length])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  // ── Answer selection (left click) ─────────────────────────────────────────
  const selectChoice = useCallback((displayIdx) => {
    if (!questions[current]) return
    const order      = displayOrders[current] || []
    const realIdx    = order[displayIdx]

    // Can't change answer if already revealed (tutor mode after submit)
    if (revealed[current]) return

    setAnswers(prev => {
      const next = [...prev]
      next[current] = realIdx
      return next
    })
    // No auto-reveal in either mode — tutor requires explicit Submit, test reveals on End Session
  }, [current, displayOrders, revealed, session])

  // ── Submit (test mode explicit submit button) ─────────────────────────────
  const submitAnswer = useCallback(() => {
    if (answers[current] === null || answers[current] === undefined) return
    setRevealed(prev => {
      const next = [...prev]
      next[current] = true
      return next
    })
  }, [current, answers])

  // ── Reveal (test mode — show answer even without selection) ──────────────
  const revealAnswer = useCallback(() => {
    setRevealed(prev => {
      const next = [...prev]
      next[current] = true
      return next
    })
  }, [current])

  // ── Right-click elimination ───────────────────────────────────────────────
  const toggleEliminate = useCallback((displayIdx) => {
    if (revealed[current]) return
    const order   = displayOrders[current] || []
    const realIdx = order[displayIdx]
    setEliminated(prev => {
      const next = prev.map(s => new Set(s))
      if (!next[current]) next[current] = new Set()
      if (next[current].has(realIdx)) {
        next[current].delete(realIdx)
      } else {
        next[current].add(realIdx)
      }
      return next
    })
  }, [current, displayOrders, revealed])

  // ── Pause ─────────────────────────────────────────────────────────────────
  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      if (!prev) {
        // Pausing: save current elapsed
        const now = Date.now()
        elapsedRef.current += Math.floor((now - startTimeRef.current) / 1000)
      } else {
        // Resuming
        startTimeRef.current = Date.now()
      }
      return !prev
    })
  }, [])

  // ── Pause session (save progress, return to dashboard) ───────────────────
  const pauseSessionAction = useCallback(() => {
    saveCurrentTime()
    // Flush current question's accumulated time into timePerQ state
    timePerQRef.current[current] = elapsedRef.current
    setTimePerQ(prev => {
      const next = [...prev]
      next[current] = elapsedRef.current
      return next
    })
    if (session) {
      storage.pauseSession(session.id)
    }
  }, [session, current])

  // ── Complete session ──────────────────────────────────────────────────────
  const completeSession = useCallback(() => {
    saveCurrentTime()
    // Flush current question's accumulated time into timePerQ state
    timePerQRef.current[current] = elapsedRef.current
    setTimePerQ(prev => {
      const next = [...prev]
      next[current] = elapsedRef.current
      return next
    })
    // In test mode: bulk-reveal all questions on completion
    if (session?.config?.mode === 'test') {
      setRevealed(prev => prev.map(() => true))
    }
    setIsComplete(true)
    // Status will be set to 'completed' via the persist effect
  }, [current, session])

  // ── Reset ────────────────────────────────────────────────────────────────
  const resetSession = useCallback(() => {
    const qs = questions
    const shouldShuffle = session?.config?.shuffle !== false && session?.config?.shuffleQuestions !== false
    setDisplayOrders(buildDisplayOrders(qs, shouldShuffle))
    const n = qs.length
    setAnswers(new Array(n).fill(null))
    setRevealed(new Array(n).fill(false))
    setEliminated(new Array(n).fill(null).map(() => new Set()))
    setTimePerQ(new Array(n).fill(0))
    setCurrent(0)
    setIsComplete(false)
    elapsedRef.current = 0
    startTimeRef.current = Date.now()
  }, [questions])

  // ── Computed values ───────────────────────────────────────────────────────
  const currentQ      = questions[current] || null
  const currentOrder  = displayOrders[current] || []
  const currentAnswer = answers[current] ?? null
  const isRevealed    = revealed[current] || false
  const eliminated_   = eliminated[current] || new Set()
  const goalSec       = session?.config?.goalSec ?? 90
  const elapsed       = timePerQ[current] || 0
  const mode          = session?.config?.mode || 'tutor'

  const score = {
    correct: answers.filter((a, i) => a !== null && questions[i] && a === questions[i].answer).length,
    answered: answers.filter(a => a !== null).length,
    revealed: revealed.filter(Boolean).length,
    total: questions.length,
  }

  return {
    // State
    session, questions, current, answers, revealed,
    displayOrders, eliminated, timePerQ, isPaused, isComplete,
    // Current Q helpers
    currentQ, currentOrder, currentAnswer, isRevealed, eliminated_,
    goalSec, elapsed, mode, score,
    // Actions
    goTo, next, prev,
    selectChoice, submitAnswer, revealAnswer,
    toggleEliminate, togglePause, completeSession, pauseSession: pauseSessionAction, resetSession,
  }
}
