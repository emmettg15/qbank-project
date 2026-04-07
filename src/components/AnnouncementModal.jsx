import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const STORAGE_KEY = 'qbp_announcement'
const DISMISSED_KEY = 'qbp_last_dismissed_announcement'

/**
 * One-time announcement modal driven entirely by localStorage.
 *
 * To push an announcement, set this in the browser console (or via a script):
 *
 *   localStorage.setItem('qbp_announcement', JSON.stringify({
 *     id: 'apr-2026-update',
 *     title: 'What\'s New — April 2026',
 *     body: 'Image descriptions are now hidden during active sessions to avoid spoilers.\n\nYou can still see them in review mode after completing a session.'
 *   }))
 *
 * The modal shows once per unique `id`. After the user dismisses it,
 * the id is saved to `qbp_last_dismissed_announcement` and won't appear again.
 */
export default function AnnouncementModal() {
  const [announcement, setAnnouncement] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (!parsed || !parsed.id || !parsed.title) return

      const dismissed = localStorage.getItem(DISMISSED_KEY)
      if (dismissed === parsed.id) return

      setAnnouncement(parsed)
    } catch {
      // malformed JSON — ignore
    }
  }, [])

  if (!announcement) return null

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, announcement.id)
    setAnnouncement(null)
  }

  return createPortal(
    <div className="modal-overlay" onClick={handleDismiss}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-title">{announcement.title}</div>
        <div style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: 20 }}>
          {announcement.body}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleDismiss}>
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
