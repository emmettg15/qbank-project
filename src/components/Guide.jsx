import React from 'react'
import { generateGuidePdf } from '../utils/generateGuidePdf.js'

export default function Guide({ onNavigate }) {
  return (
    <div className="view-enter">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('dashboard')} style={{ marginBottom: 8 }}>
            ← Dashboard
          </button>
          <h2 style={{ fontSize: 22 }}>Guide</h2>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
            Everything you need to know about QBank Forge
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={generateGuidePdf}>
          Download QBank Guide (PDF)
        </button>
      </div>

      {/* Getting Started */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Getting Started</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="intro-step">
            <div className="intro-step-num">1</div>
            <div className="intro-step-text">
              <strong>Upload a question bank</strong> — drag & drop a <code>.json</code> or <code>.html</code> file onto the upload zone on the Dashboard, or use the pre-loaded seed questions.
            </div>
          </div>
          <div className="intro-step">
            <div className="intro-step-num">2</div>
            <div className="intro-step-text">
              <strong>Configure your session</strong> — filter by topic, set question count, choose <strong>Tutor</strong> or <strong>Test</strong> mode, and set a per-question timer goal.
            </div>
          </div>
          <div className="intro-step">
            <div className="intro-step-num">3</div>
            <div className="intro-step-text">
              <strong>Practice & review</strong> — answer questions, flag items for review. Access the <strong>Labs reference</strong> and <strong>Calculator</strong> anytime during a session via the toolbar.
            </div>
          </div>
          <div className="intro-step">
            <div className="intro-step-num">4</div>
            <div className="intro-step-text">
              <strong>Analyze your performance</strong> — after each session, review accuracy by topic, time per question, and a full question-by-question breakdown.
            </div>
          </div>
        </div>
      </div>

      {/* Session Modes */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Session Modes</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--accent)', marginBottom: 6 }}>Tutor Mode</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
            Select an answer, then click <strong>Submit</strong> to reveal whether you're correct. The explanation and key points appear immediately.
            You can then click <strong>Next</strong> to move on. Great for learning new material.
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--accent)', marginBottom: 6 }}>Test Mode</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
            Simulates exam conditions. Select answers for each question — you can change your answer at any time by navigating back.
            No answers are revealed until you <strong>End Session</strong>. No score or topic breakdown is shown during the test.
          </div>
        </div>
      </div>

      {/* Session Controls */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Session Controls</div>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text)' }}>
          <div style={{ marginBottom: 8 }}>
            The <strong style={{ color: 'var(--wrong)' }}>End</strong> button in the top bar gives you three options:
          </div>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li><strong>Cancel</strong> — closes the menu, no action taken</li>
            <li><strong>Pause</strong> — saves your progress and returns to the Dashboard. Resume anytime from the "In Progress" section.</li>
            <li><strong>End Session</strong> — completes the session. All answers are finalized, and you can view your summary and review each question.</li>
          </ul>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Keyboard Shortcuts</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="font-mono">← / →</td><td>Previous / Next question</td></tr>
              <tr><td className="font-mono">1–9, 0</td><td>Select choice 1–10</td></tr>
              <tr><td className="font-mono">Space</td><td>Pause / Resume timer</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* During a Session */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>During a Session</div>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text)' }}>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li><strong>Left-click</strong> a choice to select it</li>
            <li><strong>Right-click</strong> a choice (or click ✕) to cross it out for process of elimination</li>
            <li>Use the <strong>Labs</strong> and <strong>Calculator</strong> buttons in the toolbar to access reference tools</li>
            <li>The question navigation grid on the left lets you jump to any question</li>
          </ul>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Data & Privacy</div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
          All data is stored locally in your browser's localStorage. Nothing leaves your computer.
          To back up data, export any session as JSON from the analysis page.
        </div>
      </div>

      {/* Generating Questions */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Generating Questions with Claude</div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
          You can generate USMLE-style question banks using Claude. See the project README for a complete copy-pasteable prompt
          that produces properly formatted JSON files ready for upload.
        </div>
      </div>
    </div>
  )
}
