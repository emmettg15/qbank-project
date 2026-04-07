import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const DISMISSED_KEY = 'qbp_last_dismissed_announcement'

/**
 * One-time announcement modal.
 *
 * To push a new announcement: change the `id` below (must be unique),
 * then update `title` and `body`. Deploy — every user sees it once.
 * Set to `null` when there's no active announcement.
 */
const CURRENT_ANNOUNCEMENT = {
  id: 'apr-2026-performance',
  title: "Exam Week Delays",
  body: "Hey everyone, you may have noticed some long wait times or some inconsistencies with past data. Unfortunately due to the number of people using the site and my (free) backend storage system there may be some delays while traffic is high, but you should still be able to use all of the features of the site once it loads! I made some backend changes to hopefully help with the issue as well. Happy studying!",
}

export default function AnnouncementModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!CURRENT_ANNOUNCEMENT) return
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    if (dismissed === CURRENT_ANNOUNCEMENT.id) return
    setVisible(true)
  }, [])

  if (!visible || !CURRENT_ANNOUNCEMENT) return null

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, CURRENT_ANNOUNCEMENT.id)
    setVisible(false)
  }

  return createPortal(
    <div className="modal-overlay" onClick={handleDismiss}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-title">{CURRENT_ANNOUNCEMENT.title}</div>
        <div style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: 20 }}>
          {CURRENT_ANNOUNCEMENT.body}
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
