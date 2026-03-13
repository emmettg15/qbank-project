import React from 'react'

// Maps legacy single-tag IDs to colors
const TAG_COLORS = {
  pharm:   '#4fc3f7',
  pulm:    '#a5d6a7',
  onc:     '#ffcc80',
  heme:    '#ef9a9a',
  endo:    '#ce93d8',
  neuro:   '#80deea',
  immuno:  '#f48fb1',
  cardio:  '#ff8a65',
  gi:      '#a5d6a7',
  renal:   '#80cbc4',
  repro:   '#f48fb1',
  msk:     '#bcaaa4',
  psych:   '#b39ddb',
  biostats:'#fff176',
  general: '#6b7394',
}

const TAG_LABELS = {
  pharm:   'Pharm',
  pulm:    'Pulm',
  onc:     'Onc/Path',
  heme:    'Heme',
  endo:    'Endo/Repro',
  neuro:   'Neuro',
  immuno:  'Immuno',
  cardio:  'Cardio',
  gi:      'GI',
  renal:   'Renal',
  repro:   'Repro',
  msk:     'MSK/Derm',
  psych:   'Psych',
  biostats:'Biostats',
  general: 'General',
}

export default function TagBadge({ tagId, label, color, small }) {
  const bg    = color || TAG_COLORS[tagId] || '#6b7394'
  const text  = label || TAG_LABELS[tagId] || tagId || '—'
  return (
    <span
      className="tag"
      style={{
        background: `${bg}22`,
        color: bg,
        border: `1px solid ${bg}55`,
        fontSize: small ? 10 : 11,
        padding: small ? '1px 6px' : '2px 8px',
      }}
    >
      {text}
    </span>
  )
}

export { TAG_COLORS, TAG_LABELS }
