export default function SuggestionPanel({ runningLow, seasonal, substituteFor, substitutes, onAdd, onDismissSubstitute }) {
  const hasAny = runningLow.length > 0 || seasonal.length > 0 || (substituteFor && substitutes.length > 0)
  if (!hasAny) return null

  return (
    <div className="panel suggestions">
      {substituteFor && substitutes.length > 0 && (
        <div className="suggestions__row suggestions__row--alert">
          <span className="suggestions__label">Out of {substituteFor}? Try instead</span>
          <div className="chip-row">
            {substitutes.map(name => (
              <button key={name} className="chip chip--alt" onClick={() => onAdd(name)}>+ {name}</button>
            ))}
            <button className="chip chip--ghost" onClick={onDismissSubstitute}>Dismiss</button>
          </div>
        </div>
      )}

      {runningLow.length > 0 && (
        <div className="suggestions__row">
          <span className="suggestions__label">Running low on</span>
          <div className="chip-row">
            {runningLow.map(name => (
              <button key={name} className="chip" onClick={() => onAdd(name)}>+ {name}</button>
            ))}
          </div>
        </div>
      )}

      {seasonal.length > 0 && (
        <div className="suggestions__row">
          <span className="suggestions__label">In season now</span>
          <div className="chip-row">
            {seasonal.map(name => (
              <button key={name} className="chip chip--seasonal" onClick={() => onAdd(name)}>+ {name}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}