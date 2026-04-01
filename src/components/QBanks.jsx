import React, { useState, useMemo } from 'react'
import TagBadge from './shared/TagBadge.jsx'
import SessionConfig from './SessionConfig.jsx'
import { JEFFMD_CATALOG } from '../data/jeffmd-catalog.js'
import { useStorage } from '../hooks/useStorage.js'
import { v4 as uuid } from '../utils/uuid.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function isValidUuid(str) {
  return typeof str === 'string' && UUID_RE.test(str)
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Check if a catalog QBank was added in the last 14 days
function isNew(addedDate) {
  if (!addedDate) return false
  const diff = Date.now() - new Date(addedDate).getTime()
  return diff < 14 * 24 * 60 * 60 * 1000
}

// ─── Catalog Card ─────────────────────────────────────────────────────────────
function CatalogCard({ entry, progress, catalogImport, onClick }) {
  const hasUpdate = catalogImport && catalogImport.version < entry.version

  return (
    <div
      className="card-sm"
      style={{ cursor: 'pointer', padding: '16px 20px' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{entry.title}</div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {isNew(entry.addedDate) && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px',
              background: 'rgba(102,187,106,.2)', color: 'var(--correct)',
              borderRadius: 'var(--radius-sm)',
            }}>NEW</span>
          )}
          {hasUpdate && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px',
              background: 'rgba(255,167,38,.2)', color: 'var(--accent2)',
              borderRadius: 'var(--radius-sm)',
            }}>UPDATED</span>
          )}
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>
        {entry.description}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        {entry.tags.slice(0, 4).map(t => <TagBadge key={t} tagId={t} small />)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>
          {entry.questionCount} questions · {entry.examLevel.toUpperCase()}
        </div>
        {progress && (
          <div style={{
            fontSize: 12, fontWeight: 600, fontFamily: 'IBM Plex Mono',
            color: progress.completed > 0 ? 'var(--correct)' : 'var(--muted)',
          }}>
            {progress.completed > 0
              ? `${progress.completed} session${progress.completed > 1 ? 's' : ''} completed`
              : 'Not started'}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QBanksPage({ onNavigate }) {
  const storage = useStorage()
  const [configTarget, setConfigTarget] = useState(null)
  const [loading, setLoading] = useState(null) // catalogId being loaded

  // Build progress map: catalogId → { completed, inProgress }
  const progressMap = useMemo(() => {
    const sessions = storage.getSessions()
    const map = {}
    for (const entry of JEFFMD_CATALOG) {
      const imp = storage.getCatalogImport(entry.catalogId)
      if (!imp) {
        // Check if seed data matches (title-based detection for backward compat)
        map[entry.catalogId] = { completed: 0, inProgress: 0 }
        continue
      }
      const related = sessions.filter(s => s.questionSetId === imp.questionSetId)
      map[entry.catalogId] = {
        completed: related.filter(s => s.completed || s.status === 'completed').length,
        inProgress: related.filter(s => !s.completed && s.status !== 'completed').length,
      }
    }
    return map
  }, [configTarget]) // re-compute when config closes (session may have been created)

  async function handleSelect(entry) {
    setLoading(entry.catalogId)
    try {
      let imp = storage.getCatalogImport(entry.catalogId)

      // If not imported yet, check if seed data already matches (backward compat)
      if (!imp) {
        const existingSets = storage.getQuestionSets()
        const match = existingSets.find(s =>
          s.title && entry.title && s.title.includes(entry.title.split(' — ')[0])
        )
        if (match) {
          storage.setCatalogImport(entry.catalogId, match.id, entry.version)
          imp = { questionSetId: match.id, version: entry.version }
        }
      }

      // Already imported at current version
      if (imp && imp.version >= entry.version) {
        const qs = storage.getQuestionSet(imp.questionSetId)
        if (qs) {
          setConfigTarget({ title: qs.title, questions: qs.questions, existingSetId: qs.id })
          setLoading(null)
          return
        }
      }

      // Lazy-load the QBank JSON
      const module = await import(`../data/qbanks/${entry.catalogId}.json`)
      const data = module.default

      const title = data.config?.title
        ? `${data.config.title}${data.config.subtitle ? ' — ' + data.config.subtitle : ''}`
        : entry.title

      // Version update: update existing question set in-place
      if (imp) {
        const existing = storage.getQuestionSet(imp.questionSetId)
        if (existing) {
          existing.questions = data.questions.map(q => ({
            id: (q.id && isValidUuid(q.id)) ? q.id : uuid(),
            stem: q.stem || '',
            lead: q.lead || '',
            choices: q.choices || [],
            answer: q.answer ?? 0,
            explanation: q.explanation || '',
            keypoints: q.keypoints || [],
            tag: q.tag || null,
            tags: q.tags || { examLevel: 'step1', system: q.tag || 'general', contentType: 'pathophysiology', topic: '' },
            ...(q.image && { image: q.image }),
            ...(q.imageAlt && { imageAlt: q.imageAlt }),
            ...(q.imageCaption && { imageCaption: q.imageCaption }),
          }))
          existing.title = title
          existing.date = new Date().toISOString()
          storage.saveQuestionSet(existing)
          storage.setCatalogImport(entry.catalogId, existing.id, entry.version)
          setConfigTarget({ title: existing.title, questions: existing.questions, existingSetId: existing.id })
          setLoading(null)
          return
        }
      }

      // Fresh import
      const qs = storage.importQuestionSet({
        title,
        questions: data.questions,
        source: 'jeffmd-catalog',
      })
      storage.setCatalogImport(entry.catalogId, qs.id, entry.version)
      setConfigTarget({ title: qs.title, questions: qs.questions, existingSetId: qs.id })
    } catch (err) {
      console.error('Failed to load QBank:', err)
    }
    setLoading(null)
  }

  return (
    <div className="view-enter">
      <div className="section-header" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22 }}>QBanks</h2>
      </div>

      <div style={{
        fontSize: 14, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6,
        padding: '12px 20px', background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}>
        Curated USMLE-style question banks. Click a QBank to configure and start a session.
        Your progress is saved locally in your browser.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {JEFFMD_CATALOG.map(entry => (
          <CatalogCard
            key={entry.catalogId}
            entry={entry}
            progress={progressMap[entry.catalogId]}
            catalogImport={storage.getCatalogImport(entry.catalogId)}
            onClick={() => handleSelect(entry)}
          />
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 20 }}>
          Loading question bank...
        </div>
      )}

      {/* Session Config Modal */}
      {configTarget && (
        <SessionConfig
          title={configTarget.title}
          questions={configTarget.questions}
          existingSetId={configTarget.existingSetId}
          onStart={(sessionId, questions) => {
            setConfigTarget(null)
            onNavigate('session', { sessionId, questions })
          }}
          onClose={() => setConfigTarget(null)}
        />
      )}
    </div>
  )
}
