const CATEGORY_ORDER = ['Produce', 'Dairy', 'Bakery', 'Beverages', 'Snacks', 'Household', 'Other']

export default function ShoppingList({ items, onRemove }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>Your list is empty.</p>
        <p className="empty-state__hint">Try saying "Add milk" or "I need two apples."</p>
      </div>
    )
  }

  const grouped = {}
  items.forEach(item => {
    const cat = item.category || 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(item)
  })

  const categories = Object.keys(grouped).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  )

  return (
    <div className="list">
      {categories.map(cat => (
        <div key={cat} className="list__group">
          <h3 className="list__category">{cat}</h3>
          <ul className="list__items">
            {grouped[cat].map(item => (
              <li key={item.id} className="list__item">
                <span className="list__item-name">
                  {item.quantity > 1 ? `${item.quantity}× ` : ''}{item.name}
                </span>
                <button
                  className="list__remove"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
