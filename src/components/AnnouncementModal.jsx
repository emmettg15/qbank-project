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
  id: 'may-17-2026-qbank',
  title: "Lippencott Image Inaccuracy",
  body: "Hey everyone, you have probably noticed some incorrect/absent images from a lot of the qbanks, so sorry about that. The GI relevant histo questions have been fixed and I'm working on  the rest. If you see that a qbank has been updated, that means it's been fixed. Happy studying!",
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
