import { useEffect, useState } from 'react'

export default function App() {
  const [weight, setWeight] = useState('')
  const [weights, setWeights] = useState([])
  const [fasting, setFasting] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [hours, setHours] = useState(0)

  useEffect(() => {
    let timer
    if (fasting && startTime) {
      timer = setInterval(() => {
        const diff = (Date.now() - startTime) / 3600000
        setHours(diff.toFixed(1))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [fasting, startTime])

  function toggleFast() {
    if (!fasting) {
      setStartTime(Date.now())
      setHours(0)
    }
    setFasting(!fasting)
  }

  function addWeight() {
    if (!weight) return
    setWeights([weight, ...weights])
    setWeight('')
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h1>FastFlow</h1>

      <div style={{ background: 'white', padding: 20, borderRadius: 16, marginBottom: 20 }}>
        <h2>Fasting Timer</h2>
        <p>{fasting ? `${hours} hours` : 'Not fasting'}</p>

        <button
          onClick={toggleFast}
          style={{
            padding: '12px 18px',
            borderRadius: 12,
            border: 'none',
            background: 'black',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {fasting ? 'End Fast' : 'Start Fast'}
        </button>
      </div>

      <div style={{ background: 'white', padding: 20, borderRadius: 16 }}>
        <h2>Weight Tracker</h2>

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: '1px solid #ccc'
            }}
          />

          <button
            onClick={addWeight}
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              border: 'none',
              background: 'black',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>

        <ul>
          {weights.map((w, i) => (
            <li key={i} style={{ marginTop: 10 }}>
              {w} lbs
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
