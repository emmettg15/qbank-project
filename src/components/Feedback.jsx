import React from 'react'

// Replace this URL with your Google Form embed URL
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true'

export default function FeedbackModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-title">Send Feedback</div>
        <div style={{ marginBottom: 16, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <iframe
            src={GOOGLE_FORM_URL}
            title="Feedback Form"
            style={{ width: '100%', height: '60vh', border: 'none', display: 'block' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
