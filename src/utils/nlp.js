// Lightweight, rule-based intent parser.
//
// This intentionally avoids a heavyweight NLP/ML dependency: for a bounded
// shopping-list vocabulary, pattern matching on intent verbs + word-number
// extraction covers the required phrasing variety ("add milk" / "I need
// apples" / "I want to buy bananas") without the latency or setup cost of
// calling an external model. See README for the tradeoff discussion.

const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
}

const ADD_PATTERNS = [
  /\b(?:add|i need|i want to buy|i want|buy|get|put)\b/i,
]
const REMOVE_PATTERNS = [
  /\b(?:remove|delete|take off|cross off)\b/i,
]
const SEARCH_PATTERNS = [
  /\b(?:find|search for|search|show me|look for)\b/i,
]

function extractQuantity(text) {
  const digitMatch = text.match(/\b(\d+)\b/)
  if (digitMatch) return parseInt(digitMatch[1], 10)

  const words = text.toLowerCase().split(/\s+/)
  for (const w of words) {
    if (NUMBER_WORDS[w]) return NUMBER_WORDS[w]
  }
  return 1
}

function extractPriceFilter(text) {
  const under = text.match(/under\s*\$?(\d+(\.\d+)?)/i)
  if (under) return { max: parseFloat(under[1]) }
  const over = text.match(/over\s*\$?(\d+(\.\d+)?)/i)
  if (over) return { min: parseFloat(over[1]) }
  return null
}

function stripFillerWords(text) {
  return text
    .replace(/\b(?:add|remove|delete|find|search for|search|show me|look for|i need|i want to buy|i want|buy|get|put|take off|cross off|to my list|from my list|please)\b/gi, '')
    .replace(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/gi, '')
    .replace(/\bunder\s*\$?\d+(\.\d+)?\b/gi, '')
    .replace(/\bover\s*\$?\d+(\.\d+)?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseCommand(rawTranscript) {
  const transcript = rawTranscript.trim()
  const lower = transcript.toLowerCase()

  let intent = 'UNKNOWN'
  if (SEARCH_PATTERNS.some(p => p.test(lower))) intent = 'SEARCH'
  else if (REMOVE_PATTERNS.some(p => p.test(lower))) intent = 'REMOVE'
  else if (ADD_PATTERNS.some(p => p.test(lower))) intent = 'ADD'

  const quantity = extractQuantity(lower)
  const priceFilter = extractPriceFilter(lower)
  let item = stripFillerWords(transcript)

  // Title-case the extracted item for display purposes.
  item = item
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return { intent, item, quantity, priceFilter, raw: transcript }
}
