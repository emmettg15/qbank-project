import React from 'react'
import { createPortal } from 'react-dom'

// Replace this URL with your Google Form embed URL
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfeCob-PmuAtLjCyYbIj9f6cdEHZShIUCHapdu6o6T4ANZaBg/viewform?usp=publish-editor'

export default function FeedbackModal({ onClose }) {
  return createPortal(
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-title">Send Feedback</div>
        <div style={{ marginBottom: 16, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <iframe
            src={GOOGLE_FORM_URL}
            title="Feedback Form"
            style={{ width: '100%', height: 'min(55vh, 500px)', border: 'none', display: 'block' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  )
}
