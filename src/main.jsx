import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './theme.css'
import { getQuestionSets, importQuestionSet } from './hooks/useStorage.js'
import { SEED_CONFIG, SEED_QUESTIONS } from './data/seedQuestions.js'

// ── Seed before first render so Dashboard sees the data immediately ──────────
if (getQuestionSets().length === 0) {
  importQuestionSet({
    title: `${SEED_CONFIG.title} — ${SEED_CONFIG.subtitle}`,
    questions: SEED_QUESTIONS,
    source: 'seed',
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
