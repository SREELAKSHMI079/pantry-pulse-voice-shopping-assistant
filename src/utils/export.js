export function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
}

// Builds a plain-text receipt and triggers a browser download —
// no backend or PDF library needed for this scope.
export function exportReceipt(items) {
  const now = new Date()
  const lines = []
  lines.push('BASKET — SHOPPING LIST')
  lines.push(now.toLocaleString('en-IN'))
  lines.push('-'.repeat(34))

  const grouped = {}
  items.forEach(item => {
    const cat = item.category || 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(item)
  })

  Object.entries(grouped).forEach(([cat, catItems]) => {
    lines.push(`\n${cat.toUpperCase()}`)
    catItems.forEach(item => {
      const lineTotal = (item.price || 0) * item.quantity
      const qtyLabel = item.quantity > 1 ? `${item.quantity}x ` : ''
      const priceLabel = item.price ? formatINR(lineTotal) : 'price n/a'
      lines.push(`  ${qtyLabel}${item.name.padEnd(20)} ${priceLabel}`)
    })
  })

  lines.push('\n' + '-'.repeat(34))
  lines.push(`TOTAL: ${formatINR(calculateTotal(items))}`)

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `basket-list-${now.toISOString().slice(0, 10)}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}