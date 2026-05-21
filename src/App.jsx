import { useEffect, useState } from 'react'

const STORAGE_KEY = 'fastflow-data'

function getSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved
      ? JSON.parse(saved)
      : {
          fasting: false,
          startTime: null,
          weights: []
        }
  } catch {
    return {
      fasting: false,
      startTime: null,
      weights: []
    }
  }
}

function formatElapsed(startTime) {
  if (!startTime) return '0h 0m 0s'

  const totalSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours}h ${minutes}m ${seconds}s`
}

export default function App() {
  const [savedData, setSavedData] = useState(getSavedData)
  const [weight, setWeight] = useState('')
  const [elapsed, setElapsed] = useState(formatElapsed(savedData.startTime))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData))
  }, [savedData])

  useEffect(() => {
    const timer = setInterval(() => {
      if (savedData.fasting && savedData.startTime) {
        setElapsed(formatElapsed(savedData.startTime))
      } else {
        setElapsed('0h 0m 0s')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [savedData.fasting, savedData.startTime])

  function toggleFast() {
    if (!savedData.fasting) {
      setSavedData({
        ...savedData,
        fasting: true,
        startTime: Date.now()
      })
    } else {
      setSavedData({
        ...savedData,
        fasting: false,
        startTime: null
      })
    }
  }

  function addWeight() {
    if (!weight.trim()) return

    const entry = {
      value: weight.trim(),
      date: new Date().toLocaleString()
    }

    setSavedData({
      ...savedData,
      weights: [entry, ...savedData.weights]
    })

    setWeight('')
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 36, marginBottom: 4 }}>FastFlow</h1>
      <p style={{ color: '#666', marginTop: 0 }}>
        Fasting and weight tracker
      </p>

      <div style={cardStyle}>
        <h2>Fasting Timer</h2>

        <p style={{ fontSize: 34, fontWeight: 'bold', margin: '14px 0' }}>
          {savedData.fasting ? elapsed : 'Not fasting'}
        </p>

        {savedData.fasting && (
          <p style={{ color: '#666' }}>
            Started: {new Date(savedData.startTime).toLocaleString()}
          </p>
        )}

        <button onClick={toggleFast} style={buttonStyle}>
          {savedData.fasting ? 'End Fast' : 'Start Fast'}
        </button>
      </div>

      <div style={cardStyle}>
        <h2>Weight Tracker</h2>

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
            inputMode="decimal"
            style={inputStyle}
          />

          <button onClick={addWeight} style={buttonStyle}>
            Add
          </button>
        </div>

        <ul style={{ paddingLeft: 20 }}>
          {savedData.weights.map((entry, i) => (
            <li key={i} style={{ marginTop: 12 }}>
              <strong>{entry.value}</strong>
              <br />
              <small style={{ color: '#666' }}>{entry.date}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const cardStyle = {
  background: 'white',
  padding: 20,
  borderRadius: 16,
  marginBottom: 20,
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
}

const buttonStyle = {
  padding: '12px 18px',
  borderRadius: 12,
  border: 'none',
  background: 'black',
  color: 'white',
  cursor: 'pointer'
}

const inputStyle = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  border: '1px solid #ccc',
  minWidth: 0
}
