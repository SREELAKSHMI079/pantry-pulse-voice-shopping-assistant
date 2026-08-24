import { PRODUCTS } from '../utils/products'
import { formatINR } from '../utils/export'

export default function SearchBar({ query, priceFilter, onAdd, onClear }) {
  if (!query) return null

  const lower = query.toLowerCase()
  const results = PRODUCTS.filter(p => {
    const matchesText = p.name.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower)
    if (!matchesText) return false
    if (priceFilter?.max != null && p.price > priceFilter.max) return false
    if (priceFilter?.min != null && p.price < priceFilter.min) return false
    return true
  })

  return (
    <div className="panel search-panel">
      <div className="panel__header">
        <span className="panel__title">
          Results for &ldquo;{query}&rdquo;{priceFilter?.max != null ? ` under ₹${priceFilter.max}` : ''}
        </span>
        <button className="text-button" onClick={onClear}>Clear</button>
      </div>
      {results.length === 0 ? (
        <p className="empty-hint">No matches. Try a different item or brand.</p>
      ) : (
        <ul className="search-panel__results">
          {results.map((p, i) => (
            <li key={i} className="search-panel__item">
              <div>
                <span className="search-panel__name">{p.name}</span>
                <span className="search-panel__brand"> · {p.brand}</span>
              </div>
              <div className="search-panel__actions">
                <span className="search-panel__price">{formatINR(p.price)}</span>
                <button className="chip" onClick={() => onAdd(p.name)}>+ Add</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}