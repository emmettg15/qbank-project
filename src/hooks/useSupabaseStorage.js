/**
 * useSupabaseStorage — async Supabase equivalents of useStorage.js functions
 *
 * Each function takes userId as the first parameter.
 * Data shapes returned match the localStorage versions exactly.
 */

import { supabase } from '../lib/supabase.js'
import { v4 as uuid } from '../utils/uuid.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUuid(str) {
  return typeof str === 'string' && UUID_RE.test(str)
}

// ─── Sessions ────────────────────────────────────────────────────────────────

function rowToSession(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    questionSetId: row.question_set_id,
    questionIds: row.question_ids || [],
    config: row.config || {},
    results: row.results || { answers: [], revealed: [], eliminated: [], timePerQ: [] },
    score: {
      correct: row.score_correct,
      answered: row.score_answered,
      total: row.score_total,
    },
    completed: row.completed,
    status: row.status,
    sessionNotes: row.session_notes,
    sessionRating: row.session_rating,
  }
}

function sessionToRow(userId, session) {
  return {
    id: session.id,
    user_id: userId,
    title: session.title,
    date: session.date,
    question_set_id: session.questionSetId || null,
    question_ids: session.questionIds || [],
    config: session.config || {},
    results: session.results || {},
    score_correct: session.score?.correct ?? 0,
    score_answered: session.score?.answered ?? 0,
    score_total: session.score?.total ?? 0,
    completed: session.completed ?? false,
    status: session.status || 'active',
    session_notes: session.sessionNotes || '',
    session_rating: session.sessionRating ?? null,
  }
}

export async function getSessions(userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return (data || []).map(rowToSession)
}

export async function getSession(userId, id) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)
    .single()
  if (error) return null
  return rowToSession(data)
}

export async function saveSession(userId, session) {
  const row = sessionToRow(userId, session)

  // Verify FK reference exists before writing (prevents FK constraint violations)
  if (row.question_set_id) {
    const { data } = await supabase
      .from('question_sets')
      .select('id')
      .eq('id', row.question_set_id)
      .single()
    if (!data) row.question_set_id = null
  }

  const { error } = await supabase
    .from('sessions')
    .upsert(row, { onConflict: 'id' })
  if (error) throw error
  return session
}

export async function deleteSession(userId, id) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('user_id', userId)
    .eq('id', id)
  if (error) throw error
}

export async function createSession(userId, { title, questionSetId, config, questions }) {
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
  await saveSession(userId, session)
  return session
}

export async function pauseSession(userId, id) {
  const session = await getSession(userId, id)
  if (!session) return null
  session.status = 'paused'
  session.completed = false
  await saveSession(userId, session)
  return session
}

// ─── Question Sets ───────────────────────────────────────────────────────────

function rowsToQuestionSet(setRow, questionRows) {
  return {
    id: setRow.id,
    title: setRow.title,
    date: setRow.date,
    source: setRow.source,
    questions: (questionRows || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(q => ({
        id: q.id,
        stem: q.stem,
        lead: q.lead,
        choices: q.choices || [],
        answer: q.answer,
        explanation: q.explanation,
        keypoints: q.keypoints || [],
        tag: q.tag,
        tags: q.tags || {},
        ...(q.image && { image: q.image }),
        ...(q.image_alt && { imageAlt: q.image_alt }),
        ...(q.image_caption && { imageCaption: q.image_caption }),
      })),
  }
}

export async function getQuestionSetsMeta(userId) {
  const { data: sets, error: setsErr } = await supabase
    .from('question_sets')
    .select('id, title, date, source, user_id')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (setsErr) throw setsErr

  // Return metadata only (no questions) — callers hydrate from localStorage
  return (sets || []).map(s => rowsToQuestionSet(s, []))
}

export async function getQuestionSets(userId) {
  const { data: sets, error: setsErr } = await supabase
    .from('question_sets')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (setsErr) throw setsErr

  if (!sets || sets.length === 0) return []

  const setIds = sets.map(s => s.id)
  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('*')
    .in('question_set_id', setIds)
    .order('sort_order', { ascending: true })
  if (qErr) throw qErr

  const qBySet = {}
  for (const q of (questions || [])) {
    if (!qBySet[q.question_set_id]) qBySet[q.question_set_id] = []
    qBySet[q.question_set_id].push(q)
  }

  return sets.map(s => rowsToQuestionSet(s, qBySet[s.id] || []))
}

export async function getQuestionSet(userId, id) {
  const { data: setRow, error: setErr } = await supabase
    .from('question_sets')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)
    .single()
  if (setErr) return null

  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('*')
    .eq('question_set_id', id)
    .order('sort_order', { ascending: true })
  if (qErr) throw qErr

  return rowsToQuestionSet(setRow, questions || [])
}

export async function saveQuestionSet(userId, qs) {
  // Upsert the set row
  const { error: setErr } = await supabase
    .from('question_sets')
    .upsert({
      id: qs.id,
      user_id: userId,
      title: qs.title,
      date: qs.date,
      source: qs.source || 'upload',
    }, { onConflict: 'id' })
  if (setErr) throw setErr

  // Upsert questions and remove any that were deleted from the set
  if (qs.questions && qs.questions.length > 0) {
    const rows = qs.questions.map((q, i) => ({
      id: (q.id && isValidUuid(q.id)) ? q.id : uuid(),
      question_set_id: qs.id,
      user_id: userId,
      sort_order: i,
      stem: q.stem || '',
      lead: q.lead || '',
      choices: q.choices || [],
      answer: q.answer ?? 0,
      explanation: q.explanation || '',
      keypoints: q.keypoints || [],
      tag: q.tag || null,
      tags: q.tags || {},
      image: q.image || null,
      image_alt: q.imageAlt || null,
      image_caption: q.imageCaption || null,
    }))

    // Batch upsert in chunks of 100
    for (let i = 0; i < rows.length; i += 100) {
      const chunk = rows.slice(i, i + 100)
      const { error: qErr } = await supabase.from('questions').upsert(chunk, { onConflict: 'id' })
      if (qErr) throw qErr
    }

    // Delete only questions that are no longer in the set
    const currentIds = rows.map(r => r.id)
    const { data: existing } = await supabase
      .from('questions')
      .select('id')
      .eq('question_set_id', qs.id)
    const removedIds = (existing || [])
      .map(r => r.id)
      .filter(id => !currentIds.includes(id))
    if (removedIds.length > 0) {
      await supabase.from('questions').delete().in('id', removedIds)
    }
  } else {
    // No questions — delete all for this set
    await supabase.from('questions').delete().eq('question_set_id', qs.id)
  }

  return qs
}

export async function deleteQuestionSet(userId, id) {
  // CASCADE handles questions
  const { error } = await supabase
    .from('question_sets')
    .delete()
    .eq('user_id', userId)
    .eq('id', id)
  if (error) throw error
}

export async function importQuestionSet(userId, { title, questions, source = 'upload' }) {
  const qs = {
    id: uuid(),
    title,
    date: new Date().toISOString(),
    source,
    questions: questions.map(q => ({
      id: (q.id && isValidUuid(q.id)) ? q.id : uuid(),
      stem: q.stem || '',
      lead: q.lead || '',
      choices: q.choices || [],
      answer: q.answer ?? 0,
      explanation: q.explanation || '',
      keypoints: q.keypoints || [],
      tag: q.tag || null,
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
  await saveQuestionSet(userId, qs)
  return qs
}

// ─── Question Ratings ────────────────────────────────────────────────────────

export async function getQuestionRatings(userId) {
  const { data, error } = await supabase
    .from('question_ratings')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error

  const ratings = {}
  for (const r of (data || [])) {
    ratings[r.question_id] = {
      needsReview: r.needs_review,
      validityConcern: r.validity_concern,
    }
  }
  return ratings
}

export async function getQuestionRating(userId, questionId) {
  const { data, error } = await supabase
    .from('question_ratings')
    .select('*')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .single()
  if (error || !data) return { needsReview: false, validityConcern: false }
  return {
    needsReview: data.needs_review,
    validityConcern: data.validity_concern,
  }
}

export async function setQuestionRating(userId, questionId, rating) {
  const { error } = await supabase
    .from('question_ratings')
    .upsert({
      user_id: userId,
      question_id: questionId,
      needs_review: rating.needsReview ?? false,
      validity_concern: rating.validityConcern ?? false,
    }, { onConflict: 'user_id,question_id' })
  if (error) throw error
  return rating
}

// ─── Catalog Imports ─────────────────────────────────────────────────────────

export async function getCatalogImports(userId) {
  const { data, error } = await supabase
    .from('catalog_imports')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error

  const imports = {}
  for (const r of (data || [])) {
    imports[r.catalog_id] = {
      questionSetId: r.question_set_id,
      version: r.version,
      importedDate: r.imported_date,
    }
  }
  return imports
}

export async function getCatalogImport(userId, catalogId) {
  const imports = await getCatalogImports(userId)
  return imports[catalogId] || null
}

export async function deleteCatalogImport(userId, catalogId) {
  const { error } = await supabase
    .from('catalog_imports')
    .delete()
    .eq('user_id', userId)
    .eq('catalog_id', catalogId)
  if (error) throw error
}

export async function setCatalogImport(userId, catalogId, questionSetId, version) {
  const { error } = await supabase
    .from('catalog_imports')
    .upsert({
      user_id: userId,
      catalog_id: catalogId,
      question_set_id: questionSetId,
      version,
      imported_date: new Date().toISOString(),
    }, { onConflict: 'user_id,catalog_id' })
  if (error) throw error
}

// ─── Bulk Operations ─────────────────────────────────────────────────────────

export async function clearAllData(userId) {
  // Delete in dependency order
  await supabase.from('catalog_imports').delete().eq('user_id', userId)
  await supabase.from('question_ratings').delete().eq('user_id', userId)
  await supabase.from('sessions').delete().eq('user_id', userId)
  // CASCADE handles questions when sets are deleted
  await supabase.from('question_sets').delete().eq('user_id', userId)
}

export async function exportAll(userId) {
  const [sessions, questionSets, questionRatings] = await Promise.all([
    getSessions(userId),
    getQuestionSets(userId),
    getQuestionRatings(userId),
  ])
  return {
    sessions,
    questionSets,
    questionRatings,
    exportDate: new Date().toISOString(),
  }
}

export async function importAll(userId, data) {
  // Build old→new ID map for non-UUID question IDs (e.g. "q001" → proper UUID)
  const idMap = {}
  if (data.questionSets) {
    for (const qs of data.questionSets) {
      for (const q of (qs.questions || [])) {
        if (q.id && !isValidUuid(q.id)) {
          idMap[q.id] = uuid()
        }
      }
    }
  }

  const remap = (id) => idMap[id] || id

  // Import question sets with remapped IDs
  if (data.questionSets) {
    for (const qs of data.questionSets) {
      const remapped = {
        ...qs,
        questions: (qs.questions || []).map(q => ({
          ...q,
          id: remap(q.id),
        })),
      }
      await saveQuestionSet(userId, remapped)
    }
  }

  // Import sessions with remapped questionIds
  if (data.sessions) {
    for (const s of data.sessions) {
      const remapped = {
        ...s,
        questionIds: (s.questionIds || []).map(remap),
      }
      await saveSession(userId, remapped)
    }
  }

  // Import ratings with remapped keys
  if (data.questionRatings) {
    for (const [qId, rating] of Object.entries(data.questionRatings)) {
      await setQuestionRating(userId, remap(qId), rating)
    }
  }
}
