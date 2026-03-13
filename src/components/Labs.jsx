import React, { useState, useMemo } from 'react'
import { LAB_CATEGORIES } from '../data/labValues.js'

export default function Labs() {
  const [search,  setSearch]  = useState('')
  const [step,    setStep]    = useState('step1')   // 'step1' | 'step23'
  const [openCat, setOpenCat] = useState(new Set(LAB_CATEGORIES.map(c => c.id)))

  function toggleCat(id) {
    setOpenCat(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Filter categories/values by search
  const filtered = useMemo(() => {
    if (!search.trim()) return LAB_CATEGORIES
    const q = search.toLowerCase()
    return LAB_CATEGORIES
      .map(cat => ({
        ...cat,
        values: cat.values.filter(v =>
          v.name.toLowerCase().includes(q) ||
          (v.step1 || '').toLowerCase().includes(q) ||
          (v.step23 || '').toLowerCase().includes(q)
        ),
      }))
      .filter(cat => cat.values.length > 0 || cat.label.toLowerCase().includes(q))
  }, [search])

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, marginBottom: 4 }}>USMLE Lab Reference</h2>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          Standard NBME reference intervals used across Step 1, 2 CK, and Step 3.
          Select your exam to see relevant clinical callouts.
        </div>
      </div>

      {/* Search + step toggle */}
      <div className="labs-search-bar">
        <input
          className="form-input"
          placeholder="Search analytes, conditions, drugs…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />

        <div className="step-toggle">
          <button
            className={`step-toggle-btn${step === 'step1' ? ' active' : ''}`}
            onClick={() => setStep('step1')}
          >
            Step 1
          </button>
          <button
            className={`step-toggle-btn${step === 'step23' ? ' active' : ''}`}
            onClick={() => setStep('step23')}
          >
            Step 2 / 3
          </button>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setOpenCat(new Set(LAB_CATEGORIES.map(c => c.id)))}
        >
          Expand All
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setOpenCat(new Set())}
        >
          Collapse All
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', fontSize: 12, color: 'var(--muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#ce93d8', display: 'inline-block' }} />
          Step 1 callout (mechanism / pathophysiology)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#80deea', display: 'inline-block' }} />
          Step 2/3 callout (clinical threshold / management)
        </span>
      </div>

      {/* Categories */}
      {filtered.map(cat => (
        <div key={cat.id} className="labs-category">
          {/* Category header */}
          <div
            className="labs-category-title"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => toggleCat(cat.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && toggleCat(cat.id)}
          >
            <span>{cat.label}</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--muted)' }}>
              {cat.values.length} values {openCat.has(cat.id) ? '▲' : '▼'}
            </span>
          </div>

          {openCat.has(cat.id) && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>Analyte</th>
                      <th style={{ width: '14%' }}>Reference Range</th>
                      <th style={{ width: '8%' }}>Units</th>
                      <th>
                        {step === 'step1'
                          ? '📘 Step 1 — Mechanism / Pathophysiology'
                          : '🏥 Step 2/3 — Clinical Threshold / Management'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.values.map((v, i) => {
                      const callout = step === 'step1' ? v.step1 : (v.step23 || v.step1)
                      return (
                        <tr key={i} className="lab-row">
                          <td style={{ fontWeight: 500 }}>{v.name}</td>
                          <td>
                            <span style={{
                              fontFamily: 'IBM Plex Mono',
                              fontSize: 13,
                              color: 'var(--accent)',
                              fontWeight: 600,
                            }}>
                              {v.ref}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--muted)' }}>
                            {v.units}
                          </td>
                          <td>
                            {callout ? (
                              <span
                                className={`lab-callout ${step === 'step1' ? 'step1' : 'step23'}`}
                                style={{ fontSize: 13 }}
                              >
                                {callout}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--border)', fontSize: 12 }}>—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
          No results for "{search}"
        </div>
      )}
    </div>
  )
}
