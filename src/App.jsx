import { useEffect, useMemo, useState } from 'react'
import VoiceButton from './components/VoiceButton'
import ShoppingList from './components/ShoppingList'
import SuggestionPanel from './components/SuggestionPanel'
import SearchBar from './components/SearchBar'
import { parseCommand } from './utils/nlp'
import { PRODUCTS } from './utils/products'
import { getRunningLowSuggestions, getSeasonalSuggestions, getSubstitutes } from './utils/suggestions'
import { exportReceipt, calculateTotal, formatINR } from './utils/export'

const LIST_KEY = 'vsa_list_v1'
const HISTORY_KEY = 'vsa_history_v1'

function findProductMeta(name) {
  const lower = name.toLowerCase()
  return PRODUCTS.find(p => p.name.toLowerCase() === lower)
}

export default function App() {
  const [list, setList] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LIST_KEY)) || [] } catch { return [] }
  })
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] } catch { return [] }
  })
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [lastTranscript, setLastTranscript] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState(null)
  const [substituteFor, setSubstituteFor] = useState(null)

  useEffect(() => {
    localStorage.setItem(LIST_KEY, JSON.stringify(list))
  }, [list])

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const runningLow = useMemo(() => getRunningLowSuggestions(history, list), [history, list])
  const seasonal = useMemo(() => getSeasonalSuggestions(), [])
  const substitutes = useMemo(
    () => (substituteFor ? getSubstitutes(substituteFor) : []),
    [substituteFor]
  )
  const total = useMemo(() => calculateTotal(list), [list])
  const itemCount = useMemo(() => list.reduce((s, i) => s + i.quantity, 0), [list])

  function addItem(name, quantity = 1) {
    if (!name) return
    setList(prev => {
      const existingIdx = prev.findIndex(i => i.name.toLowerCase() === name.toLowerCase())
      if (existingIdx >= 0) {
        const copy = [...prev]
        copy[existingIdx] = { ...copy[existingIdx], quantity: copy[existingIdx].quantity + quantity }
        return copy
      }
      const meta = findProductMeta(name)
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name,
          quantity,
          category: meta?.category || 'Other',
          price: meta?.price || 0,
        },
      ]
    })
    setHistory(prev => [...prev, name])
    setToast(`Added ${quantity > 1 ? quantity + '× ' : ''}${name}`)

    const subs = getSubstitutes(name)
    if (subs.length > 0) setSubstituteFor(name)
  }

  function removeItem(idOrName) {
    setList(prev => {
      const target = prev.find(
        i => i.id === idOrName || i.name.toLowerCase() === String(idOrName).toLowerCase()
      )
      if (!target) return prev
      setToast(`Removed ${target.name}`)
      return prev.filter(i => i.id !== target.id)
    })
  }

  function handleVoiceResult(transcript) {
    setError(null)
    setProcessing(true)
    setLastTranscript(transcript)

    setTimeout(() => {
      const { intent, item, quantity, priceFilter } = parseCommand(transcript)

      if (!item && intent !== 'UNKNOWN') {
        setError("I heard you, but couldn't tell which item you meant. Try again?")
        setProcessing(false)
        return
      }

      switch (intent) {
        case 'ADD':
          addItem(item, quantity)
          break
        case 'REMOVE':
          removeItem(item)
          break
        case 'SEARCH':
          setSearchQuery(item)
          setSearchFilter(priceFilter)
          break
        default:
          setError(`Didn't catch a command in "${transcript}". Try "Add milk" or "Find apples."`)
      }
      setProcessing(false)
    }, 350)
  }

  function handleVoiceError(message) {
    setError(message)
    setProcessing(false)
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="app__brand-mark">🛺</span>
          <div>
            <h1>Basket</h1>
            <p className="topbar__tagline">Say it, and it's on the list.</p>
          </div>
        </div>
        <div className="topbar__summary">
          <span className="topbar__summary-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          <span className="topbar__summary-total">{formatINR(total)}</span>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <section className="panel voice-card">
            <VoiceButton onResult={handleVoiceResult} onError={handleVoiceError} />

            <div className="feedback-zone" aria-live="polite">
              {processing && (
                <p className="feedback feedback--loading"><span className="feedback__dot" />Processing…</p>
              )}
              {!processing && lastTranscript && !error && (
                <p className="feedback feedback--heard">"{lastTranscript}"</p>
              )}
              {error && <p className="feedback feedback--error">{error}</p>}
            </div>
          </section>

          <ManualAdd onAdd={addItem} />

          <SuggestionPanel
            runningLow={runningLow}
            seasonal={seasonal}
            substituteFor={substituteFor}
            substitutes={substitutes}
            onAdd={(name) => addItem(name, 1)}
            onDismissSubstitute={() => setSubstituteFor(null)}
          />
        </aside>

        <main className="content">
          <SearchBar
            query={searchQuery}
            priceFilter={searchFilter}
            onAdd={(name) => addItem(name, 1)}
            onClear={() => { setSearchQuery(''); setSearchFilter(null) }}
          />

          <ShoppingList
            items={list}
            onRemove={removeItem}
            onExport={() => {
              exportReceipt(list)
              setToast('List exported')
            }}
          />
        </main>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function ManualAdd({ onAdd }) {
  const [value, setValue] = useState('')
  return (
    <form
      className="panel manual-add"
      onSubmit={(e) => {
        e.preventDefault()
        if (value.trim()) {
          onAdd(value.trim(), 1)
          setValue('')
        }
      }}
    >
      <input
        type="text"
        placeholder="Or type an item to add…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Add item by typing"
      />
      <button type="submit">Add</button>
    </form>
  )
}