// A small static catalog standing in for a product database / search index.
// Prices are in INR (₹). Each item carries enough metadata to support
// category grouping, price filtering, brand search, and substitute suggestions.

export const PRODUCTS = [
  { name: 'Milk', category: 'Dairy', price: 58, brand: 'Meadow Farms', tags: ['dairy', 'breakfast'] },
  { name: 'Almond Milk', category: 'Dairy', price: 249, brand: 'Silk', tags: ['dairy-alt', 'vegan', 'breakfast'] },
  { name: 'Oat Milk', category: 'Dairy', price: 269, brand: 'Oatly', tags: ['dairy-alt', 'vegan', 'breakfast'] },
  { name: 'Cheddar Cheese', category: 'Dairy', price: 340, brand: 'Tillamook', tags: ['dairy', 'snack'] },
  { name: 'Greek Yogurt', category: 'Dairy', price: 220, brand: 'Fage', tags: ['dairy', 'breakfast', 'protein'] },
  { name: 'Butter', category: 'Dairy', price: 260, brand: 'Land O Lakes', tags: ['dairy', 'baking'] },
  { name: 'Eggs', category: 'Dairy', price: 90, brand: 'Happy Egg Co', tags: ['breakfast', 'protein'] },

  { name: 'Bananas', category: 'Produce', price: 40, brand: 'Generic', tags: ['fruit', 'seasonal-year-round'] },
  { name: 'Apples', category: 'Produce', price: 180, brand: 'Generic', tags: ['fruit'] },
  { name: 'Organic Apples', category: 'Produce', price: 260, brand: "Nature's Best", tags: ['fruit', 'organic'] },
  { name: 'Oranges', category: 'Produce', price: 90, brand: 'Generic', tags: ['fruit', 'seasonal-winter'] },
  { name: 'Spinach', category: 'Produce', price: 35, brand: 'Generic', tags: ['vegetable', 'leafy-green'] },
  { name: 'Tomatoes', category: 'Produce', price: 45, brand: 'Generic', tags: ['vegetable', 'seasonal-summer'] },
  { name: 'Pumpkin', category: 'Produce', price: 55, brand: 'Generic', tags: ['vegetable', 'seasonal-fall'] },
  { name: 'Avocado', category: 'Produce', price: 120, brand: 'Generic', tags: ['fruit'] },

  { name: 'Bread', category: 'Bakery', price: 55, brand: "Dave's Killer Bread", tags: ['bakery', 'breakfast'] },
  { name: 'Bagels', category: 'Bakery', price: 150, brand: "Thomas'", tags: ['bakery', 'breakfast'] },

  { name: 'Toothpaste', category: 'Household', price: 95, brand: 'Colgate', tags: ['hygiene'] },
  { name: 'Toothpaste', category: 'Household', price: 210, brand: 'Sensodyne', tags: ['hygiene', 'sensitive'] },
  { name: 'Paper Towels', category: 'Household', price: 320, brand: 'Bounty', tags: ['cleaning'] },
  { name: 'Dish Soap', category: 'Household', price: 110, brand: 'Dawn', tags: ['cleaning'] },

  { name: 'Water Bottles', category: 'Beverages', price: 180, brand: 'Bisleri', tags: ['drinks'] },
  { name: 'Orange Juice', category: 'Beverages', price: 150, brand: 'Tropicana', tags: ['drinks', 'breakfast'] },
  { name: 'Coffee', category: 'Beverages', price: 420, brand: "Peet's", tags: ['drinks', 'breakfast'] },

  { name: 'Potato Chips', category: 'Snacks', price: 40, brand: "Lay's", tags: ['snack'] },
  { name: 'Almonds', category: 'Snacks', price: 550, brand: 'Blue Diamond', tags: ['snack', 'protein'] },
  { name: 'Granola Bars', category: 'Snacks', price: 320, brand: 'Nature Valley', tags: ['snack', 'breakfast'] },
]

export const SUBSTITUTES = {
  milk: ['Almond Milk', 'Oat Milk'],
  bread: ['Bagels'],
  'potato chips': ['Almonds', 'Granola Bars'],
  butter: ['Greek Yogurt'],
}

export function getSeasonalPicks(date = new Date()) {
  const month = date.getMonth()
  if (month >= 8 && month <= 10) return PRODUCTS.filter(p => p.tags.includes('seasonal-fall'))
  if (month === 11 || month <= 1) return PRODUCTS.filter(p => p.tags.includes('seasonal-winter'))
  if (month >= 5 && month <= 7) return PRODUCTS.filter(p => p.tags.includes('seasonal-summer'))
  return PRODUCTS.filter(p => p.tags.includes('seasonal-year-round'))
}