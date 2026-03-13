import React from 'react'

/**
 * DonutChart — SVG circular progress matching the Qmax screenshot style.
 * Segments: correct (green), wrong (red), skipped (blue), unanswered (gray rim).
 *
 * Props:
 *   correct     {number} count
 *   wrong       {number} count
 *   skipped     {number} count
 *   total       {number} total questions
 *   size        {number} px, default 120
 *   thickness   {number} stroke width, default 14
 *   label       {string} center label, default '%'
 */
export default function DonutChart({
  correct = 0,
  wrong   = 0,
  skipped = 0,
  total   = 1,
  answered,
  size    = 120,
  thickness = 14,
  label,
}) {
  const r      = (size - thickness) / 2
  const cx     = size / 2
  const cy     = size / 2
  const circum = 2 * Math.PI * r

  // % correct = correct / answered (not total)
  const answeredCount = answered ?? (correct + wrong)
  const pct        = answeredCount > 0 ? Math.round((correct / answeredCount) * 100) : 0
  const correctFrac = total > 0 ? correct / total : 0
  const wrongFrac   = total > 0 ? wrong   / total : 0
  const skippedFrac = total > 0 ? skipped / total : 0
  const unanswFrac  = Math.max(0, 1 - correctFrac - wrongFrac - skippedFrac)

  // Each segment: offset = sum of previous segments * circumference
  // We start at 12 o'clock (rotate -90°)
  function arc(frac, offset) {
    return {
      strokeDasharray:  `${frac * circum} ${circum}`,
      strokeDashoffset: `-${offset * circum}`,
    }
  }

  const correctOff = 0
  const wrongOff   = correctFrac
  const skippedOff = correctFrac + wrongFrac
  const unanswOff  = correctFrac + wrongFrac + skippedFrac

  const centerLabel = label ?? `${pct}%`

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)', display: 'block', flexShrink: 0 }}
    >
      {/* Background track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--surface2)"
        strokeWidth={thickness}
      />

      {/* Unanswered (gray) */}
      {unanswFrac > 0.001 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--unanswered)"
          strokeWidth={thickness}
          strokeLinecap="butt"
          style={arc(unanswFrac, unanswOff)}
          opacity={0.4}
        />
      )}

      {/* Skipped (blue) */}
      {skippedFrac > 0.001 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--skipped)"
          strokeWidth={thickness}
          strokeLinecap="butt"
          style={arc(skippedFrac, skippedOff)}
        />
      )}

      {/* Wrong (red) */}
      {wrongFrac > 0.001 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--wrong)"
          strokeWidth={thickness}
          strokeLinecap="butt"
          style={arc(wrongFrac, wrongOff)}
        />
      )}

      {/* Correct (green) */}
      {correctFrac > 0.001 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--correct)"
          strokeWidth={thickness}
          strokeLinecap="butt"
          style={arc(correctFrac, correctOff)}
        />
      )}

      {/* Center text (counter-rotated) */}
      <text
        x={cx} y={cy - 4}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          transform: `rotate(90deg)`,
          transformOrigin: `${cx}px ${cy}px`,
          fontFamily: 'IBM Plex Mono, monospace',
          fontWeight: 700,
          fontSize: size * 0.185,
          fill: 'var(--text)',
        }}
      >
        {centerLabel}
      </text>
      <text
        x={cx} y={cy + (size * 0.13)}
        textAnchor="middle"
        style={{
          transform: `rotate(90deg)`,
          transformOrigin: `${cx}px ${cy}px`,
          fontFamily: 'IBM Plex Sans, sans-serif',
          fontSize: size * 0.1,
          fill: 'var(--muted)',
        }}
      >
        correct
      </text>
    </svg>
  )
}
