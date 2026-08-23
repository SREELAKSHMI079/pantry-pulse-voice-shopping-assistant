import { useEffect, useRef, useState } from 'react'

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'fr-FR', label: 'French' },
]

export default function VoiceButton({ onResult, onError }) {
  const [isListening, setIsListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [lang, setLang] = useState('en-US')
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }
    recognition.onerror = (event) => {
      onError(event.error === 'no-speech' ? 'No speech detected — try again.' : `Mic error: ${event.error}`)
      setIsListening(false)
    }
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    return () => recognition.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (recognitionRef.current) recognitionRef.current.lang = lang
  }, [lang])

  const toggleListening = () => {
    if (!supported) {
      onError('Voice recognition is not supported in this browser. Try Chrome on desktop or Android.')
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch {
      // start() throws if called twice in a row too fast — safe to ignore.
    }
  }

  return (
    <div className="voice-panel">
      <button
        className={`mic-button ${isListening ? 'mic-button--active' : ''}`}
        onClick={toggleListening}
        aria-pressed={isListening}
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
      >
        <MicIcon />
        <span className="mic-ring" aria-hidden="true" />
      </button>

      <div className="voice-panel__meta">
        <span className="voice-panel__status">
          {!supported ? 'Voice not supported here' : isListening ? 'Listening…' : 'Tap to speak'}
        </span>
        <select
          className="lang-select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label="Voice recognition language"
          disabled={!supported}
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function MicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
