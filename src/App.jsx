import React, { useState } from 'react'
import NavBar from './components/shared/NavBar.jsx'
import Dashboard from './components/Dashboard.jsx'
import ActiveSession from './components/ActiveSession.jsx'
import SessionAnalysis from './components/SessionAnalysis.jsx'
import AllSessions from './components/AllSessions.jsx'
import Labs from './components/Labs.jsx'
import Calculator from './components/Calculator.jsx'
import Guide from './components/Guide.jsx'
import ReviewSession from './components/ReviewSession.jsx'
import QBanksPage from './components/QBanks.jsx'

export default function App() {
  // view: 'dashboard' | 'session' | 'analysis' | 'history' | 'labs' | 'calculator' | 'guide' | 'review' | 'qbanks'
  const [view,              setView]              = useState('dashboard')
  const [activeSessionId,   setActiveSessionId]   = useState(null)
  const [activeQuestions,   setActiveQuestions]   = useState(null)
  const [analysisSessionId, setAnalysisSessionId] = useState(null)
  const [reviewSessionId,   setReviewSessionId]   = useState(null)

  function navigate(dest, params = {}) {
    setView(dest)
    if (dest === 'session' && params.sessionId) {
      setActiveSessionId(params.sessionId)
      setActiveQuestions(params.questions || null)
    }
    if (dest === 'analysis' && params.sessionId) {
      setAnalysisSessionId(params.sessionId)
    }
    if (dest === 'review' && params.sessionId) {
      setReviewSessionId(params.sessionId)
    }
  }

  return (
    <div className="app-shell">
      <NavBar view={view} onNavigate={navigate} />
      <main className="app-main">
        {view === 'dashboard' && (
          <Dashboard onNavigate={navigate} />
        )}
        {view === 'session' && activeSessionId && (
          <ActiveSession
            sessionId={activeSessionId}
            questionsOverride={activeQuestions}
            onNavigate={navigate}
          />
        )}
        {view === 'analysis' && analysisSessionId && (
          <SessionAnalysis
            sessionId={analysisSessionId}
            onNavigate={navigate}
          />
        )}
        {view === 'history' && (
          <AllSessions onNavigate={navigate} />
        )}
        {view === 'qbanks' && (
          <QBanksPage onNavigate={navigate} />
        )}
        {view === 'guide' && (
          <Guide onNavigate={navigate} />
        )}
        {view === 'review' && reviewSessionId && (
          <ReviewSession sessionId={reviewSessionId} onNavigate={navigate} />
        )}
        {view === 'labs' && <Labs />}
        {view === 'calculator' && <Calculator />}
      </main>
    </div>
  )
}
