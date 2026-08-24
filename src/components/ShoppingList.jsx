import { formatINR, calculateTotal } from '../utils/export'

const CATEGORY_ORDER = ['Produce', 'Dairy', 'Bakery', 'Beverages', 'Snacks', 'Household', 'Other']

export default function ShoppingList({ items, onRemove, onExport }) {
  const total = calculateTotal(items)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="panel list-panel">
        <div className="empty-state">
          <p className="empty-state__title">Your list is empty</p>
          <p className="empty-hint">Try saying &ldquo;Add milk&rdquo; or &ldquo;I need two apples.&rdquo;</p>
        </div>
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
    <div className="panel list-panel">
      <div className="list-panel__header">
        <h2 className="list-panel__title">Your List</h2>
        <span className="list-panel__count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
      </div>

      <div className="list-table">
        <div className="list-table__head">
          <span>Item</span>
          <span>Qty</span>
          <span className="list-table__price-col">Price</span>
          <span className="list-table__action-col" aria-hidden="true" />
        </div>

        {categories.map(cat => (
          <div key={cat} className="list-table__group">
            <div className="list-table__category">{cat}</div>
            {grouped[cat].map(item => (
              <div key={item.id} className="list-table__row">
                <span className="list-table__name">{item.name}</span>
                <span className="list-table__qty">{item.quantity}</span>
                <span className="list-table__price">
                  {item.price ? formatINR(item.price * item.quantity) : '—'}
                </span>
                <button
                  className="list-table__remove"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="checkout-bar">
        <div className="checkout-bar__total">
          <span className="checkout-bar__label">Total</span>
          <span className="checkout-bar__amount">{formatINR(total)}</span>
        </div>
        <button className="finalize-button" onClick={onExport}>
          Finalize &amp; Export List
        </button>
      </div>
    </div>
  )
}