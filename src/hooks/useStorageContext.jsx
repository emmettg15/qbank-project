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
import { v4 as uuid } from '../utils/uuid.js'

const StorageContext = createContext(null)

export function StorageProvider({ user, mode, children }) {
  const [sessions, setSessions] = useState([])
  const [questionSets, setQuestionSets] = useState([])
  const [questionRatings, setQuestionRatings] = useState({})
  const [catalogImports, setCatalogImports] = useState({})
  const [loading, setLoading] = useState(true)
  const [migrationNeeded, setMigrationNeeded] = useState(false)

  const userId = user?.id || null
  const isRemote = mode === 'supabase' && userId

  // ─── Initial Load ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        if (isRemote) {
          const [s, qs, qr, ci] = await Promise.all([
            remote.getSessions(userId),
            remote.getQuestionSets(userId),
            remote.getQuestionRatings(userId),
            remote.getCatalogImports(userId),
          ])
          if (cancelled) return

          // Check if migration is needed (Supabase empty, localStorage has data)
          const localSessions = local.getSessions()
          const localSets = local.getQuestionSets()
          if (s.length === 0 && qs.length === 0 && (localSessions.length > 0 || localSets.length > 0)) {
            setMigrationNeeded(true)
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
  const remoteDo = useCallback((fn) => {
    if (!isRemote) return
    fn().catch(err => console.error('Supabase write error:', err))
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
    remoteDo(() => remote.setQuestionRating(userId, questionId, rating))
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
