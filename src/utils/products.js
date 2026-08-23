// A small static catalog standing in for a product database / search index.
// Each item carries enough metadata to support category grouping, price
// filtering, brand search, and substitute suggestions.

export const PRODUCTS = [
  { name: 'Milk', category: 'Dairy', price: 3.49, brand: 'Meadow Farms', tags: ['dairy', 'breakfast'] },
  { name: 'Almond Milk', category: 'Dairy', price: 4.29, brand: 'Silk', tags: ['dairy-alt', 'vegan', 'breakfast'] },
  { name: 'Oat Milk', category: 'Dairy', price: 4.49, brand: 'Oatly', tags: ['dairy-alt', 'vegan', 'breakfast'] },
  { name: 'Cheddar Cheese', category: 'Dairy', price: 5.99, brand: 'Tillamook', tags: ['dairy', 'snack'] },
  { name: 'Greek Yogurt', category: 'Dairy', price: 4.99, brand: 'Fage', tags: ['dairy', 'breakfast', 'protein'] },
  { name: 'Butter', category: 'Dairy', price: 4.79, brand: 'Land O Lakes', tags: ['dairy', 'baking'] },
  { name: 'Eggs', category: 'Dairy', price: 3.99, brand: 'Happy Egg Co', tags: ['breakfast', 'protein'] },

  { name: 'Bananas', category: 'Produce', price: 0.59, brand: 'Generic', tags: ['fruit', 'seasonal-year-round'] },
  { name: 'Apples', category: 'Produce', price: 1.29, brand: 'Generic', tags: ['fruit'] },
  { name: 'Organic Apples', category: 'Produce', price: 2.19, brand: 'Nature\'s Best', tags: ['fruit', 'organic'] },
  { name: 'Oranges', category: 'Produce', price: 0.99, brand: 'Generic', tags: ['fruit', 'seasonal-winter'] },
  { name: 'Spinach', category: 'Produce', price: 2.49, brand: 'Generic', tags: ['vegetable', 'leafy-green'] },
  { name: 'Tomatoes', category: 'Produce', price: 1.99, brand: 'Generic', tags: ['vegetable', 'seasonal-summer'] },
  { name: 'Pumpkin', category: 'Produce', price: 3.99, brand: 'Generic', tags: ['vegetable', 'seasonal-fall'] },
  { name: 'Avocado', category: 'Produce', price: 1.49, brand: 'Generic', tags: ['fruit'] },

  { name: 'Bread', category: 'Bakery', price: 2.99, brand: 'Dave\'s Killer Bread', tags: ['bakery', 'breakfast'] },
  { name: 'Bagels', category: 'Bakery', price: 3.49, brand: 'Thomas\'', tags: ['bakery', 'breakfast'] },

  { name: 'Toothpaste', category: 'Household', price: 3.29, brand: 'Colgate', tags: ['hygiene'] },
  { name: 'Toothpaste', category: 'Household', price: 6.99, brand: 'Sensodyne', tags: ['hygiene', 'sensitive'] },
  { name: 'Paper Towels', category: 'Household', price: 7.99, brand: 'Bounty', tags: ['cleaning'] },
  { name: 'Dish Soap', category: 'Household', price: 3.19, brand: 'Dawn', tags: ['cleaning'] },

  { name: 'Water Bottles', category: 'Beverages', price: 4.99, brand: 'Poland Spring', tags: ['drinks'] },
  { name: 'Orange Juice', category: 'Beverages', price: 3.79, brand: 'Tropicana', tags: ['drinks', 'breakfast'] },
  { name: 'Coffee', category: 'Beverages', price: 8.49, brand: 'Peet\'s', tags: ['drinks', 'breakfast'] },

  { name: 'Potato Chips', category: 'Snacks', price: 3.49, brand: 'Lay\'s', tags: ['snack'] },
  { name: 'Almonds', category: 'Snacks', price: 6.49, brand: 'Blue Diamond', tags: ['snack', 'protein'] },
  { name: 'Granola Bars', category: 'Snacks', price: 4.29, brand: 'Nature Valley', tags: ['snack', 'breakfast'] },
]

// Simple substitute map used when an item is "unavailable" or the user
// hints at a preference (e.g. "milk" -> dairy-free alternatives).
export const SUBSTITUTES = {
  milk: ['Almond Milk', 'Oat Milk'],
  bread: ['Bagels'],
  'potato chips': ['Almonds', 'Granola Bars'],
  butter: ['Greek Yogurt'],
}

// Items considered "in season" this month, keyed by a simplified month bucket.
// A real system would pull this from a seasonal-produce API; this is a
// deliberately simple stand-in that's easy to swap out later.
export function getSeasonalPicks(date = new Date()) {
  const month = date.getMonth() // 0-11
  if (month >= 8 && month <= 10) return PRODUCTS.filter(p => p.tags.includes('seasonal-fall'))
  if (month === 11 || month <= 1) return PRODUCTS.filter(p => p.tags.includes('seasonal-winter'))
  if (month >= 5 && month <= 7) return PRODUCTS.filter(p => p.tags.includes('seasonal-summer'))
  return PRODUCTS.filter(p => p.tags.includes('seasonal-year-round'))
}
