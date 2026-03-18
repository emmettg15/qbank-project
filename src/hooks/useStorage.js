/**
 * useStorage — localStorage abstraction layer
 *
 * All keys are prefixed with 'qbp_' (QBank Pro).
 * Data model is designed to map 1:1 to Supabase tables in Phase 2.
 * To migrate: replace the read/write functions below with Supabase calls.
 */

import { v4 as uuid } from '../utils/uuid.js'

const KEYS = {
  sessions:        'qbp_sessions',
  questionSets:    'qbp_question_sets',
  questionRatings: 'qbp_question_ratings',
  catalogImports:  'qbp_catalog_imported',
}

// ─── Generic helpers ─────────────────────────────────────────────────────────
function load(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// ─── Sessions ────────────────────────────────────────────────────────────────
export function getSessions() {
  return load(KEYS.sessions, [])
}

export function getSession(id) {
  return getSessions().find(s => s.id === id) || null
}

export function saveSession(session) {
  const sessions = getSessions()
  const idx = sessions.findIndex(s => s.id === session.id)
  if (idx >= 0) {
    sessions[idx] = session
  } else {
    sessions.push(session)
  }
  save(KEYS.sessions, sessions)
  return session
}

export function deleteSession(id) {
  const sessions = getSessions().filter(s => s.id !== id)
  save(KEYS.sessions, sessions)
}

export function createSession({ title, questionSetId, config, questions }) {
  const session = {
    id: uuid(),
    title,
    date: new Date().toISOString(),
    questionSetId,
    questionIds: questions.map(q => q.id),   // snapshot ID order for reliable resume
    config,
    results: {
      answers:   new Array(questions.length).fill(null),
      revealed:  new Array(questions.length).fill(false),
      eliminated: new Array(questions.length).fill([]),
      timePerQ:  new Array(questions.length).fill(0),
    },
    score: { correct: 0, answered: 0, total: questions.length },
    completed: false,
    status: 'active',
    sessionNotes: '',
    sessionRating: null,
  }
  return saveSession(session)
}

export function pauseSession(id) {
  const session = getSession(id)
  if (!session) return null
  session.status = 'paused'
  session.completed = false
  return saveSession(session)
}

// ─── Question Sets ────────────────────────────────────────────────────────────
export function getQuestionSets() {
  return load(KEYS.questionSets, [])
}

export function getQuestionSet(id) {
  return getQuestionSets().find(s => s.id === id) || null
}

export function saveQuestionSet(qs) {
  const sets = getQuestionSets()
  const idx = sets.findIndex(s => s.id === qs.id)
  if (idx >= 0) {
    sets[idx] = qs
  } else {
    sets.unshift(qs) // newest first
  }
  save(KEYS.questionSets, sets)
  return qs
}

export function deleteQuestionSet(id) {
  const sets = getQuestionSets().filter(s => s.id !== id)
  save(KEYS.questionSets, sets)
}

export function importQuestionSet({ title, questions, source = 'upload' }) {
  const qs = {
    id: uuid(),
    title,
    date: new Date().toISOString(),
    source,
    questions: questions.map(q => ({
      id: q.id || uuid(),
      stem: q.stem || '',
      lead: q.lead || '',
      choices: q.choices || [],
      answer: q.answer ?? 0,
      explanation: q.explanation || '',
      keypoints: q.keypoints || [],
      tag: q.tag || null,           // legacy single-tag from old format
      tags: q.tags || {
        examLevel: 'step1',
        system: q.tag || 'general',
        contentType: 'pathophysiology',
        topic: '',
      },
      ...(q.image && { image: q.image }),
      ...(q.imageAlt && { imageAlt: q.imageAlt }),
      ...(q.imageCaption && { imageCaption: q.imageCaption }),
    })),
  }
  return saveQuestionSet(qs)
}

// ─── Question Ratings ──────────────────────────────────────────────────────────
export function getQuestionRatings() {
  return load(KEYS.questionRatings, {})
}

export function getQuestionRating(questionId) {
  const ratings = getQuestionRatings()
  return ratings[questionId] || { needsReview: false, validityConcern: false }
}

export function setQuestionRating(questionId, rating) {
  const ratings = getQuestionRatings()
  ratings[questionId] = { ...ratings[questionId], ...rating }
  save(KEYS.questionRatings, ratings)
  return ratings[questionId]
}

// ─── Aggregate Stats ──────────────────────────────────────────────────────────
export function getAggregateStats() {
  const sessions = getSessions().filter(s => s.completed)
  if (sessions.length === 0) {
    return { totalSessions: 0, totalQuestions: 0, totalCorrect: 0, accuracyPct: 0, avgTimePerQ: 0 }
  }
  let totalQ = 0, totalCorrect = 0, totalTime = 0
  for (const s of sessions) {
    // Count only answered questions (not skipped/unanswered) in the denominator
    const answered = (s.results.answers || []).filter(a => a !== null).length
    totalQ += answered
    totalCorrect += s.score.correct
    if (s.results.timePerQ && s.results.answers) {
      // Sum time only for answered questions
      s.results.answers.forEach((a, i) => {
        if (a !== null) totalTime += s.results.timePerQ[i] || 0
      })
    }
  }
  return {
    totalSessions: sessions.length,
    totalQuestions: totalQ,
    totalCorrect,
    accuracyPct: totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0,
    avgTimePerQ: totalQ > 0 ? Math.round(totalTime / totalQ) : 0,
  }
}

// ─── Catalog Imports (JeffMD QBanks) ──────────────────────────────────────────
export function getCatalogImports() {
  return load(KEYS.catalogImports, {})
}

export function getCatalogImport(catalogId) {
  return getCatalogImports()[catalogId] || null
}

export function setCatalogImport(catalogId, questionSetId, version) {
  const imports = getCatalogImports()
  imports[catalogId] = {
    questionSetId,
    version,
    importedDate: new Date().toISOString(),
  }
  save(KEYS.catalogImports, imports)
}

// ─── Clear all data ────────────────────────────────────────────────────────────
export function clearAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}

// ─── Export / Import all data ─────────────────────────────────────────────────
export function exportAll() {
  return {
    sessions: getSessions(),
    questionSets: getQuestionSets(),
    questionRatings: getQuestionRatings(),
    exportDate: new Date().toISOString(),
  }
}

export function importAll(data) {
  if (data.sessions) save(KEYS.sessions, data.sessions)
  if (data.questionSets) save(KEYS.questionSets, data.questionSets)
  if (data.questionRatings) save(KEYS.questionRatings, data.questionRatings)
}
