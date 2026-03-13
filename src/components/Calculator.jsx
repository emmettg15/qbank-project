import React, { useState, useCallback } from 'react'

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
]

export default function Calculator() {
  const [display,    setDisplay]    = useState('0')
  const [prev,       setPrev]       = useState(null)
  const [operator,   setOperator]   = useState(null)
  const [waitingNew, setWaitingNew] = useState(false)
  const [expression, setExpression] = useState('')

  const handleBtn = useCallback((val) => {
    if (val === 'C') {
      setDisplay('0')
      setPrev(null)
      setOperator(null)
      setWaitingNew(false)
      setExpression('')
      return
    }

    if (val === '±') {
      setDisplay(d => String(-parseFloat(d)))
      return
    }

    if (val === '%') {
      setDisplay(d => String(parseFloat(d) / 100))
      return
    }

    if (['+', '−', '×', '÷'].includes(val)) {
      const current = parseFloat(display)
      if (prev !== null && operator && !waitingNew) {
        const result = compute(prev, current, operator)
        setDisplay(String(result))
        setExpression(`${result} ${val}`)
        setPrev(result)
      } else {
        setExpression(`${current} ${val}`)
        setPrev(current)
      }
      setOperator(val)
      setWaitingNew(true)
      return
    }

    if (val === '=') {
      if (prev === null || !operator) return
      const current = parseFloat(display)
      const result  = compute(prev, current, operator)
      setExpression(`${prev} ${operator} ${current} =`)
      setDisplay(String(result))
      setPrev(null)
      setOperator(null)
      setWaitingNew(true)
      return
    }

    // Digit / decimal
    if (val === '.') {
      if (waitingNew) {
        setDisplay('0.')
        setWaitingNew(false)
        return
      }
      if (display.includes('.')) return
      setDisplay(d => d + '.')
      return
    }

    if (waitingNew) {
      setDisplay(val)
      setWaitingNew(false)
    } else {
      setDisplay(d => d === '0' ? val : (d.length < 14 ? d + val : d))
    }
  }, [display, prev, operator, waitingNew])

  function compute(a, b, op) {
    switch (op) {
      case '+': return round(a + b)
      case '−': return round(a - b)
      case '×': return round(a * b)
      case '÷': return b !== 0 ? round(a / b) : 'Error'
      default:  return b
    }
  }

  function round(n) {
    return Math.round(n * 1e10) / 1e10
  }

  // Keyboard support
  const handleKey = useCallback((e) => {
    const map = {
      'Enter': '=', 'Escape': 'C', 'Backspace': 'DEL',
      '*': '×', '/': '÷', '-': '−', '+': '+',
    }
    const v = map[e.key] || e.key
    if (v === 'DEL') {
      setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0')
      return
    }
    if ('0123456789.C±%÷×−+='.includes(v) || ['+', '−', '×', '÷', '=', 'C'].includes(v)) {
      handleBtn(v)
    }
  }, [handleBtn])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, textAlign: 'center' }}>Calculator</h2>
        <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', marginTop: 4 }}>Keyboard supported</div>
      </div>

      <div
        className="calc-wrap"
        tabIndex={0}
        onKeyDown={handleKey}
        style={{ outline: 'none' }}
      >
        {/* Display */}
        <div className="calc-display">
          <div className="calc-expression">{expression || '\u00a0'}</div>
          <div className="calc-value">{display}</div>
        </div>

        {/* Buttons */}
        <div className="calc-grid">
          {BUTTONS.flat().map((btn, i) => {
            const isOp  = ['+', '−', '×', '÷'].includes(btn)
            const isEq  = btn === '='
            const isCl  = btn === 'C'
            const isZero = btn === '0'

            if (btn === '0') {
              return (
                <button
                  key={i}
                  className="calc-btn"
                  style={{ gridColumn: 'span 2' }}
                  onClick={() => handleBtn('0')}
                >
                  0
                </button>
              )
            }

            return (
              <button
                key={i}
                className={`calc-btn${isOp ? ' op' : isEq ? ' eq' : isCl ? ' clear' : ''}`}
                onClick={() => handleBtn(btn)}
              >
                {btn}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
