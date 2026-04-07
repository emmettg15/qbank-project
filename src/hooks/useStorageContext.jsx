/**
 * StorageProvider — React context that wraps useStorage for both local and Supabase modes.
 *
 * On mount: loads all data from Supabase (or localStorage if offline/local mode).
 * Reads: synchronous from in-memory cache.
 * Writes: update cache immediately (optimistic), then push to Supabase async.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import * as local from './useLocalStorage.js'
import * as remote from './useSupabaseStorage.js'
import { supabase } from '../lib/supabase.js'
import { v4 as uuid } from '../utils/uuid.js'

const StorageContext = createContext(null)

function SkipButton({ onClick }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2000)
    return () => clearTimeout(t)
  }, [])
  if (!show) return null
  return (
    <button
      onClick={onClick}
      className="btn"
      style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)' }}
    >
      Use offline data instead
    </button>
  )
}

export function StorageProvider({ user, mode, children }) {
  const [sessions, setSessions] = useState([])
  const [questionSets, setQuestionSets] = useState([])
  const [questionRatings, setQuestionRatings] = useState({})
  const [catalogImports, setCatalogImports] = useState({})
  const [loading, setLoading] = useState(true)
  const [migrationNeeded, setMigrationNeeded] = useState(false)

  const userId = user?.id || null
  const isRemote = mode === 'supabase' && userId
  const skipRef = useRef(false)

  function skipToLocal() {
    skipRef.current = true
    setSessions(local.getSessions())
    setQuestionSets(local.getQuestionSets())
    setQuestionRatings(local.getQuestionRatings())
    setCatalogImports(local.getCatalogImports())
    setLoading(false)
  }

  // ─── Initial Load ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        if (isRemote) {
          const [s, qsMeta, qr, ci] = await Promise.all([
            remote.getSessions(userId),
            remote.getQuestionSetsMeta(userId),
            remote.getQuestionRatings(userId),
            remote.getCatalogImports(userId),
          ])
          if (cancelled || skipRef.current) return

          // Hydrate questions from localStorage (avoids fetching all questions from Supabase on startup)
          const localSetsMap = {}
          for (const ls of local.getQuestionSets()) { localSetsMap[ls.id] = ls }
          const missingFromLocal = qsMeta.some(meta => !localSetsMap[meta.id])

          let qs
          if (missingFromLocal) {
            // New device or cleared browser — must do full fetch from Supabase
            qs = await remote.getQuestionSets(userId)
            // Populate localStorage for future fast loads
            for (const q of qs) { local.saveQuestionSet(q) }
          } else {
            qs = qsMeta.map(meta => ({ ...meta, questions: localSetsMap[meta.id].questions }))
          }

          // Check if migration is needed (Supabase empty, localStorage has data)
          const localSessions = local.getSessions()
          const localSets = local.getQuestionSets()
          if (s.length === 0 && qs.length === 0 && (localSessions.length > 0 || localSets.length > 0)) {
            setMigrationNeeded(true)
          }

          // Merge: recover any local question sets missing from Supabase
          // (can happen when Supabase write failed, e.g. non-UUID IDs)
          const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          const remoteSetIds = new Set(qs.map(q => q.id))
          const allSessions = [...s, ...localSessions]
          const referencedSetIds = new Set(allSessions.map(sess => sess.questionSetId).filter(Boolean))
          const missingLocal = localSets.filter(ls =>
            !remoteSetIds.has(ls.id) && referencedSetIds.has(ls.id)
          )
          if (missingLocal.length > 0) {
            for (const ls of missingLocal) {
              // Normalize non-UUID question IDs before syncing to Supabase
              const idMap = {}
              const normalized = {
                ...ls,
                questions: (ls.questions || []).map(q => {
                  if (q.id && UUID_RE.test(q.id)) return q
                  const newId = uuid()
                  idMap[q.id] = newId
                  return { ...q, id: newId }
                }),
              }
              // Update local storage with normalized IDs
              local.saveQuestionSet(normalized)
              // Update any local sessions that reference old question IDs
              if (Object.keys(idMap).length > 0) {
                for (const sess of localSessions) {
                  if (sess.questionSetId === ls.id && sess.questionIds) {
                    sess.questionIds = sess.questionIds.map(id => idMap[id] || id)
                    local.saveSession(sess)
                  }
                }
              }
              // Await question set save so it exists before session saves reference it
              try {
                await remote.saveQuestionSet(userId, normalized)
              } catch (err) {
                console.error('Failed to sync local question set to Supabase:', err)
              }
              qs = [...qs, normalized]
              remoteSetIds.add(normalized.id)
            }

            // Now update remote sessions that reference remapped question IDs
            for (const ls of missingLocal) {
              const idMap = {}
              for (const q of (ls.questions || [])) {
                if (q.id && !UUID_RE.test(q.id)) idMap[q.id] = uuid()
              }
              if (Object.keys(idMap).length > 0) {
                for (const sess of s) {
                  if (sess.questionSetId === ls.id && sess.questionIds) {
                    const remapped = { ...sess, questionIds: sess.questionIds.map(id => idMap[id] || id) }
                    remote.saveSession(userId, remapped).catch(() => {})
                  }
                }
              }
            }
          }

          // Merge local sessions missing from Supabase
          // Build set of all known question set IDs (remote + just-synced)
          const knownSetIds = new Set(qs.map(q => q.id))
          const remoteSessionIds = new Set(s.map(sess => sess.id))
          const missingSessions = localSessions.filter(ls => !remoteSessionIds.has(ls.id))
          if (missingSessions.length > 0) {
            for (const ls of missingSessions) {
              // Null out question_set_id if the referenced set doesn't exist in Supabase (prevents FK violation)
              const safeSession = ls.questionSetId && !knownSetIds.has(ls.questionSetId)
                ? { ...ls, questionSetId: null }
                : ls
              remote.saveSession(userId, safeSession).catch(err =>
                console.error('Failed to sync local session to Supabase:', err)
              )
            }
            s = [...s, ...missingSessions]
          }

          setSessions(s)
          setQuestionSets(qs)
          setQuestionRatings(qr)
          setCatalogImports(ci)
        } else {
          // Local mode
          setSessions(local.getSessions())
          setQuestionSets(local.getQuestionSets())
          setQuestionRatings(local.getQuestionRatings())
          setCatalogImports(local.getCatalogImports())
        }
      } catch (err) {
        console.error('Storage load error, falling back to localStorage:', err)
        setSessions(local.getSessions())
        setQuestionSets(local.getQuestionSets())
        setQuestionRatings(local.getQuestionRatings())
        setCatalogImports(local.getCatalogImports())
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [isRemote, userId])

  // ─── Migration ───────────────────────────────────────────────────────────
  const runMigration = useCallback(async () => {
    if (!isRemote) return
    try {
      const data = local.exportAll()
      await remote.importAll(userId, data)
      // Reload from Supabase
      const [s, qs, qr, ci] = await Promise.all([
        remote.getSessions(userId),
        remote.getQuestionSets(userId),
        remote.getQuestionRatings(userId),
        remote.getCatalogImports(userId),
      ])
      setSessions(s)
      setQuestionSets(qs)
      setQuestionRatings(qr)
      setCatalogImports(ci)
      setMigrationNeeded(false)
    } catch (err) {
      console.error('Migration failed:', err)
      throw err
    }
  }, [isRemote, userId])

  const dismissMigration = useCallback(() => setMigrationNeeded(false), [])

  // ─── Helper: run remote write in background, log errors ──────────────────
  // Ensures auth session is fresh before writing (prevents RLS violations from stale JWTs)
  const remoteDo = useCallback((fn) => {
    if (!isRemote) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        console.warn('Supabase write skipped — no active session')
        return
      }
      return fn()
    }).catch(err => console.error('Supabase write error:', err))
  }, [isRemote])

  // ─── Sessions ────────────────────────────────────────────────────────────

  const getSessionsCache = useCallback(() => sessions, [sessions])

  const getSessionCache = useCallback((id) => {
    return sessions.find(s => s.id === id) || null
  }, [sessions])

  const saveSessionAction = useCallback((session) => {
    setSessions(prev => {
      const idx = prev.findIndex(s => s.id === session.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = session
        return next
      }
      return [session, ...prev]
    })
    // Persist
    local.saveSession(session)
    remoteDo(() => remote.saveSession(userId, session))
    return session
  }, [userId, remoteDo])

  const deleteSessionAction = useCallback((id) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    local.deleteSession(id)
    remoteDo(() => remote.deleteSession(userId, id))
  }, [userId, remoteDo])

  const createSessionAction = useCallback(({ title, questionSetId, config, questions }) => {
    const session = {
      id: uuid(),
      title,
      date: new Date().toISOString(),
      questionSetId,
      questionIds: questions.map(q => q.id),
      config,
      results: {
        answers: new Array(questions.length).fill(null),
        revealed: new Array(questions.length).fill(false),
        eliminated: new Array(questions.length).fill([]),
        timePerQ: new Array(questions.length).fill(0),
      },
      score: { correct: 0, answered: 0, total: questions.length },
      completed: false,
      status: 'active',
      sessionNotes: '',
      sessionRating: null,
    }
    setSessions(prev => [session, ...prev])
    local.saveSession(session)
    remoteDo(() => remote.saveSession(userId, session))
    return session
  }, [userId, remoteDo])

  const pauseSessionAction = useCallback((id) => {
    let updated = null
    setSessions(prev => prev.map(s => {
      if (s.id !== id) return s
      updated = { ...s, status: 'paused', completed: false }
      return updated
    }))
    if (updated) {
      local.saveSession(updated)
      remoteDo(() => remote.saveSession(userId, updated))
    }
    return updated
  }, [userId, remoteDo])

  // ─── Question Sets ──────────────────────────────────────────────────────

  const getQuestionSetsCache = useCallback(() => questionSets, [questionSets])

  const getQuestionSetCache = useCallback((id) => {
    return questionSets.find(s => s.id === id) || null
  }, [questionSets])

  const saveQuestionSetAction = useCallback((qs) => {
    setQuestionSets(prev => {
      const idx = prev.findIndex(s => s.id === qs.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = qs
        return next
      }
      return [qs, ...prev]
    })
    local.saveQuestionSet(qs)
    remoteDo(() => remote.saveQuestionSet(userId, qs))
    return qs
  }, [userId, remoteDo])

  const deleteQuestionSetAction = useCallback((id) => {
    setQuestionSets(prev => prev.filter(s => s.id !== id))
    local.deleteQuestionSet(id)
    remoteDo(() => remote.deleteQuestionSet(userId, id))
  }, [userId, remoteDo])

  const importQuestionSetAction = useCallback(({ title, questions, source = 'upload' }) => {
    const qs = local.importQuestionSet({ title, questions, source })
    setQuestionSets(prev => [qs, ...prev])
    remoteDo(() => remote.saveQuestionSet(userId, qs))
    return qs
  }, [userId, remoteDo])

  // ─── Question Ratings ──────────────────────────────────────────────────

  const getQuestionRatingsCache = useCallback(() => questionRatings, [questionRatings])

  const getQuestionRatingCache = useCallback((questionId) => {
    return questionRatings[questionId] || { needsReview: false, validityConcern: false }
  }, [questionRatings])

  const setQuestionRatingAction = useCallback((questionId, rating) => {
    const current = questionRatings[questionId] || { needsReview: false, validityConcern: false }
    const merged = { ...current, ...rating }
    setQuestionRatings(prev => ({ ...prev, [questionId]: merged }))
    local.setQuestionRating(questionId, rating)
    remoteDo(() => remote.setQuestionRating(userId, questionId, merged))
    return merged
  }, [userId, questionRatings, remoteDo])

  // ─── Aggregate Stats ──────────────────────────────────────────────────

  const getAggregateStatsCache = useCallback(() => {
    const completed = sessions.filter(s => s.completed)
    if (completed.length === 0) {
      return { totalSessions: 0, totalQuestions: 0, totalCorrect: 0, accuracyPct: 0, avgTimePerQ: 0 }
    }
    let totalQ = 0, totalCorrect = 0, totalTime = 0
    for (const s of completed) {
      const answered = (s.results.answers || []).filter(a => a !== null).length
      totalQ += answered
      totalCorrect += s.score.correct
      if (s.results.timePerQ && s.results.answers) {
        s.results.answers.forEach((a, i) => {
          if (a !== null) totalTime += s.results.timePerQ[i] || 0
        })
      }
    }
    return {
      totalSessions: completed.length,
      totalQuestions: totalQ,
      totalCorrect,
      accuracyPct: totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0,
      avgTimePerQ: totalQ > 0 ? Math.round(totalTime / totalQ) : 0,
    }
  }, [sessions])

  // ─── Catalog Imports ──────────────────────────────────────────────────

  const getCatalogImportsCache = useCallback(() => catalogImports, [catalogImports])

  const getCatalogImportCache = useCallback((catalogId) => {
    return catalogImports[catalogId] || null
  }, [catalogImports])

  const deleteCatalogImportAction = useCallback((catalogId) => {
    setCatalogImports(prev => {
      const next = { ...prev }
      delete next[catalogId]
      return next
    })
    local.deleteCatalogImport(catalogId)
    remoteDo(() => remote.deleteCatalogImport(userId, catalogId))
  }, [userId, remoteDo])

  const setCatalogImportAction = useCallback((catalogId, questionSetId, version) => {
    const entry = {
      questionSetId,
      version,
      importedDate: new Date().toISOString(),
    }
    setCatalogImports(prev => ({ ...prev, [catalogId]: entry }))
    local.setCatalogImport(catalogId, questionSetId, version)
    remoteDo(() => remote.setCatalogImport(userId, catalogId, questionSetId, version))
  }, [userId, remoteDo])

  // ─── Bulk Operations ──────────────────────────────────────────────────

  const clearAllDataAction = useCallback(() => {
    setSessions([])
    setQuestionSets([])
    setQuestionRatings({})
    setCatalogImports({})
    local.clearAllData()
    remoteDo(() => remote.clearAllData(userId))
  }, [userId, remoteDo])

  const exportAllAction = useCallback(() => {
    return {
      sessions,
      questionSets,
      questionRatings,
      exportDate: new Date().toISOString(),
    }
  }, [sessions, questionSets, questionRatings])

  const importAllAction = useCallback((data) => {
    if (data.sessions) {
      setSessions(data.sessions)
      data.sessions.forEach(s => local.saveSession(s))
    }
    if (data.questionSets) {
      setQuestionSets(data.questionSets)
      data.questionSets.forEach(qs => local.saveQuestionSet(qs))
    }
    if (data.questionRatings) {
      setQuestionRatings(data.questionRatings)
      Object.entries(data.questionRatings).forEach(([qId, r]) => local.setQuestionRating(qId, r))
    }
    remoteDo(() => remote.importAll(userId, data))
  }, [userId, remoteDo])

  // ─── Context Value ───────────────────────────────────────────────────

  const value = {
    // State
    loading,
    mode,
    user,
    migrationNeeded,
    runMigration,
    dismissMigration,

    // Sessions
    getSessions: getSessionsCache,
    getSession: getSessionCache,
    saveSession: saveSessionAction,
    deleteSession: deleteSessionAction,
    createSession: createSessionAction,
    pauseSession: pauseSessionAction,

    // Question Sets
    getQuestionSets: getQuestionSetsCache,
    getQuestionSet: getQuestionSetCache,
    saveQuestionSet: saveQuestionSetAction,
    deleteQuestionSet: deleteQuestionSetAction,
    importQuestionSet: importQuestionSetAction,

    // Question Ratings
    getQuestionRatings: getQuestionRatingsCache,
    getQuestionRating: getQuestionRatingCache,
    setQuestionRating: setQuestionRatingAction,

    // Aggregate Stats
    getAggregateStats: getAggregateStatsCache,

    // Catalog Imports
    getCatalogImports: getCatalogImportsCache,
    getCatalogImport: getCatalogImportCache,
    setCatalogImport: setCatalogImportAction,
    deleteCatalogImport: deleteCatalogImportAction,

    // Bulk
    clearAllData: clearAllDataAction,
    exportAll: exportAllAction,
    importAll: importAllAction,
  }

  if (loading) {
    return (
      <div className="auth-gate">
        <div className="auth-card">
          <div className="auth-spinner" />
          <p style={{ color: 'var(--muted)', marginTop: 12 }}>Loading your data...</p>
          {isRemote && <SkipButton onClick={skipToLocal} />}
        </div>
      </div>
    )
  }

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const ctx = useContext(StorageContext)
  if (!ctx) throw new Error('useStorage must be used within a StorageProvider')
  return ctx
}
