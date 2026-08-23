import { getSeasonalPicks, SUBSTITUTES } from './products'

// "Running low" suggestions: items that appear often in purchase history
// but are not currently on the active list. A real system would use
// purchase-interval prediction; this uses frequency as a simple, explainable
// stand-in that's easy to justify in an interview.
export function getRunningLowSuggestions(history, currentList) {
  const counts = {}
  history.forEach(name => {
    counts[name] = (counts[name] || 0) + 1
  })

  const currentNames = new Set(currentList.map(i => i.name.toLowerCase()))

  return Object.entries(counts)
    .filter(([name, count]) => count >= 2 && !currentNames.has(name.toLowerCase()))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name)
}

export function getSeasonalSuggestions() {
  return getSeasonalPicks().map(p => p.name)
}

export function getSubstitutes(itemName) {
  const key = itemName.toLowerCase().trim()
  return SUBSTITUTES[key] || []
}
