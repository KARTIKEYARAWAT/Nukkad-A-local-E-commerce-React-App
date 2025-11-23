// Centralized data service for all website content

// Import your existing data
const allStores = [
  {
    id: 1,
    name: 'Fresh Market',
    category: 'Groceries',
    distance: '250m',
    rating: 4.8,
    isOpen: true,
    closesAt: '10:00 PM',
    hasOffers: true,
    image: '🥬',
    deliveryTime: '15 min',
    phone: '+91 98765 43210',
    address: 'Shop No. 45, Sector 21, Noida, UP 201301',
    description: 'Fresh vegetables, fruits, and daily essentials',
    reviewCount: 248,
    coordinates: { lat: 28.5355, lng: 77.3910 },
    products: ['Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Beverages'],
    keywords: ['fresh', 'organic', 'vegetables', 'fruits', 'groceries']
  },
  {
    id: 2,
    name: 'MedPlus Pharmacy',
    category: 'Pharmacy',
    distance: '320m',
    rating: 4.9,
    isOpen: true,
    closesAt: '11:00 PM',
    hasOffers: false,
    image: '💊',
    deliveryTime: '10 min',
    phone: '+91 98765 43211',
    address: 'Shop No. 12, Sector 21, Noida, UP 201301',
    description: 'Medicines, health products, and wellness items',
    reviewCount: 189,
    coordinates: { lat: 28.5365, lng: 77.3920 },
    products: ['Medicines', 'Vitamins', 'First Aid', 'Health Supplements', 'Baby Care'],
    keywords: ['medicine', 'pharmacy', 'health', 'medical', 'drugs']
  },
  {
    id: 3,
    name: 'Sweet Delights',
    category: 'Bakery',
    distance: '180m',
    rating: 4.7,
    isOpen: true,
    closesAt: '9:30 PM',
    hasOffers: true,
    image: '🧁',
    deliveryTime: '12 min',
    phone: '+91 98765 43212',
    address: 'Shop No. 78, Sector 21, Noida, UP 201301',
    description: 'Fresh baked goods, cakes, and pastries',
    reviewCount: 156,
    coordinates: { lat: 28.5375, lng: 77.3930 },
    products: ['Cakes', 'Pastries', 'Bread', 'Cookies', 'Custom Cakes'],
    keywords: ['bakery', 'cake', 'bread', 'pastry', 'sweet', 'birthday']
  },
  {
    id: 4,
    name: 'Green Café',
    category: 'Café',
    distance: '290m',
    rating: 4.6,
    isOpen: true,
    closesAt: '11:30 PM',
    hasOffers: true,
    image: '☕',
    deliveryTime: '18 min',
    phone: '+91 98765 43214',
    address: 'Shop No. 56, Sector 21, Noida, UP 201301',
    description: 'Coffee, snacks, and light meals',
    reviewCount: 134,
    coordinates: { lat: 28.5395, lng: 77.3950 },
    products: ['Coffee', 'Tea', 'Sandwiches', 'Snacks', 'Desserts'],
    keywords: ['coffee', 'cafe', 'tea', 'snacks', 'wifi', 'study']
  },
  {
    id: 5,
    name: 'Tech Hub Electronics',
    category: 'Electronics',
    distance: '450m',
    rating: 4.3,
    isOpen: true,
    closesAt: '9:00 PM',
    hasOffers: true,
    image: '📱',
    deliveryTime: '30 min',
    phone: '+91 98765 43216',
    address: 'Shop No. 101, Sector 21, Noida, UP 201301',
    description: 'Mobile phones, accessories, and gadgets',
    reviewCount: 92,
    coordinates: { lat: 28.5415, lng: 77.3970 },
    products: ['Mobile Phones', 'Laptops', 'Accessories', 'Gaming', 'Audio'],
    keywords: ['mobile', 'phone', 'laptop', 'electronics', 'gadgets', 'tech']
  }
];

const allProducts = [
  // Groceries
  { id: 'p1', name: 'Fresh Tomatoes', category: 'Groceries', price: 40, storeId: 1, storeName: 'Fresh Market', image: '🍅', inStock: true },
  { id: 'p2', name: 'Organic Bananas', category: 'Groceries', price: 60, storeId: 1, storeName: 'Fresh Market', image: '🍌', inStock: true },
  { id: 'p3', name: 'Milk 1L', category: 'Groceries', price: 50, storeId: 1, storeName: 'Fresh Market', image: '🥛', inStock: true },
  
  // Pharmacy
  { id: 'p4', name: 'Paracetamol', category: 'Pharmacy', price: 25, storeId: 2, storeName: 'MedPlus Pharmacy', image: '💊', inStock: true },
  { id: 'p5', name: 'Vitamin C Tablets', category: 'Pharmacy', price: 120, storeId: 2, storeName: 'MedPlus Pharmacy', image: '🌟', inStock: true },
  { id: 'p6', name: 'Hand Sanitizer', category: 'Pharmacy', price: 80, storeId: 2, storeName: 'MedPlus Pharmacy', image: '🧴', inStock: true },
  
  // Bakery
  { id: 'p7', name: 'Chocolate Cake', category: 'Bakery', price: 350, storeId: 3, storeName: 'Sweet Delights', image: '🎂', inStock: true },
  { id: 'p8', name: 'Croissant', category: 'Bakery', price: 45, storeId: 3, storeName: 'Sweet Delights', image: '🥐', inStock: true },
  { id: 'p9', name: 'Whole Wheat Bread', category: 'Bakery', price: 35, storeId: 3, storeName: 'Sweet Delights', image: '🍞', inStock: true },
  
  // Café
  { id: 'p10', name: 'Cappuccino', category: 'Café', price: 120, storeId: 4, storeName: 'Green Café', image: '☕', inStock: true },
  { id: 'p11', name: 'Club Sandwich', category: 'Café', price: 180, storeId: 4, storeName: 'Green Café', image: '🥪', inStock: true },
  { id: 'p12', name: 'Green Tea', category: 'Café', price: 80, storeId: 4, storeName: 'Green Café', image: '🍵', inStock: true },
  
  // Electronics
  { id: 'p13', name: 'iPhone 15', category: 'Electronics', price: 79999, storeId: 5, storeName: 'Tech Hub Electronics', image: '📱', inStock: true },
  { id: 'p14', name: 'Wireless Earbuds', category: 'Electronics', price: 2999, storeId: 5, storeName: 'Tech Hub Electronics', image: '🎧', inStock: true },
  { id: 'p15', name: 'Power Bank', category: 'Electronics', price: 1299, storeId: 5, storeName: 'Tech Hub Electronics', image: '🔋', inStock: true }
];

const allDeals = [
  {
    id: 'd1',
    title: '50% Off Fresh Vegetables',
    category: 'Groceries',
    store: 'Fresh Market',
    storeId: 1,
    originalPrice: 200,
    discountPrice: 100,
    discount: 50,
    image: '🥬',
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    inStock: true,
    rating: 4.8,
    reviewCount: 45,
    distance: 0.25
  },
  {
    id: 'd2',
    title: 'Buy 2 Get 1 Free Medicines',
    category: 'Pharmacy',
    store: 'MedPlus Pharmacy',
    storeId: 2,
    originalPrice: 300,
    discountPrice: 200,
    discount: 33,
    image: '💊',
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    inStock: true,
    rating: 4.9,
    reviewCount: 67,
    distance: 0.32
  },
  {
    id: 'd3',
    title: 'Birthday Cake Special',
    category: 'Bakery',
    store: 'Sweet Delights',
    storeId: 3,
    originalPrice: 500,
    discountPrice: 350,
    discount: 30,
    image: '🎂',
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    inStock: true,
    rating: 4.7,
    reviewCount: 23,
    distance: 0.18
  }
];

const allCategories = [
  { id: 'cat1', name: 'Groceries', icon: '🛒', description: 'Fresh food and daily essentials' },
  { id: 'cat2', name: 'Pharmacy', icon: '💊', description: 'Medicines and health products' },
  { id: 'cat3', name: 'Bakery', icon: '🧁', description: 'Fresh baked goods and cakes' },
  { id: 'cat4', name: 'Café', icon: '☕', description: 'Coffee, tea and light meals' },
  { id: 'cat5', name: 'Electronics', icon: '📱', description: 'Mobile phones and gadgets' },
  { id: 'cat6', name: 'Fashion', icon: '👗', description: 'Clothing and accessories' }
];

// Search service class
export class SearchService {
  constructor() {
    this.stores = allStores;
    this.products = allProducts;
    this.deals = allDeals;
    this.categories = allCategories;
  }

  // Main search function
  search(query, filters = {}) {
    const searchQuery = query.toLowerCase().trim();
    if (!searchQuery) return this.getEmptyResults();

    const results = {
      stores: this.searchStores(searchQuery, filters),
      products: this.searchProducts(searchQuery, filters),
      deals: this.searchDeals(searchQuery, filters),
      categories: this.searchCategories(searchQuery),
      suggestions: []
    };

    // Generate suggestions based on search
    results.suggestions = this.generateSuggestions(searchQuery, results);

    // Sort results by relevance
    results.stores = this.sortByRelevance(results.stores, searchQuery);
    results.products = this.sortByRelevance(results.products, searchQuery);
    results.deals = this.sortByRelevance(results.deals, searchQuery);

    return results;
  }

  // Search stores
  searchStores(query, filters = {}) {
    return this.stores.filter(store => {
      const matchesQuery = (
        store.name.toLowerCase().includes(query) ||
        store.category.toLowerCase().includes(query) ||
        store.description.toLowerCase().includes(query) ||
        store.keywords?.some(keyword => keyword.includes(query)) ||
        store.products?.some(product => product.toLowerCase().includes(query))
      );

      const matchesCategory = !filters.category || filters.category === 'All' || store.category === filters.category;
      const matchesLocation = !filters.location || true; // Location filtering can be added
      const matchesOpenStatus = !filters.openOnly || store.isOpen;

      return matchesQuery && matchesCategory && matchesLocation && matchesOpenStatus;
    }).map(store => ({
      ...store,
      type: 'store',
      relevanceScore: this.calculateRelevance(store, query, ['name', 'category', 'description'])
    }));
  }

  // Search products
  searchProducts(query, filters = {}) {
    return this.products.filter(product => {
      const matchesQuery = (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.storeName.toLowerCase().includes(query)
      );

      const matchesCategory = !filters.category || filters.category === 'All' || product.category === filters.category;
      const matchesPrice = this.matchesPriceRange(product.price, filters.priceRange);
      const matchesStock = !filters.inStockOnly || product.inStock;

      return matchesQuery && matchesCategory && matchesPrice && matchesStock;
    }).map(product => ({
      ...product,
      type: 'product',
      relevanceScore: this.calculateRelevance(product, query, ['name', 'category', 'storeName'])
    }));
  }

  // Search deals
  searchDeals(query, filters = {}) {
    return this.deals.filter(deal => {
      const matchesQuery = (
        deal.title.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query) ||
        deal.store.toLowerCase().includes(query)
      );

      const matchesCategory = !filters.category || filters.category === 'All' || deal.category === filters.category;
      const isActive = new Date(deal.endTime) > new Date();

      return matchesQuery && matchesCategory && isActive;
    }).map(deal => ({
      ...deal,
      type: 'deal',
      relevanceScore: this.calculateRelevance(deal, query, ['title', 'category', 'store'])
    }));
  }

  // Search categories
  searchCategories(query) {
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    ).map(category => ({
      ...category,
      type: 'category',
      relevanceScore: this.calculateRelevance(category, query, ['name', 'description'])
    }));
  }

  // Calculate relevance score
  calculateRelevance(item, query, fields) {
    let score = 0;
    const queryWords = query.split(' ');

    fields.forEach(field => {
      if (item[field]) {
        const fieldValue = item[field].toLowerCase();
        
        // Exact match gets highest score
        if (fieldValue === query) score += 100;
        
        // Starts with query gets high score
        if (fieldValue.startsWith(query)) score += 80;
        
        // Contains all query words
        const containsAllWords = queryWords.every(word => fieldValue.includes(word));
        if (containsAllWords) score += 60;
        
        // Contains any query word
        queryWords.forEach(word => {
          if (fieldValue.includes(word)) score += 20;
        });
      }
    });

    // Boost score based on rating for stores and deals
    if (item.rating) {
      score += item.rating * 2;
    }

    return score;
  }

  // Sort by relevance
  sortByRelevance(items, query) {
    return items.sort((a, b) => {
      // Primary sort by relevance score
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      
      // Secondary sort by rating if available
      if (a.rating && b.rating) {
        return b.rating - a.rating;
      }
      
      // Tertiary sort by name
      return a.name?.localeCompare(b.name) || 0;
    });
  }

  // Check if price matches range
  matchesPriceRange(price, priceRange) {
    if (!priceRange || priceRange === 'All') return true;
    
    const ranges = {
      'Under ₹100': { min: 0, max: 100 },
      '₹100-₹500': { min: 100, max: 500 },
      '₹500-₹1000': { min: 500, max: 1000 },
      'Above ₹1000': { min: 1000, max: Infinity }
    };
    
    const range = ranges[priceRange];
    return range && price >= range.min && price <= range.max;
  }

  // Generate search suggestions
  generateSuggestions(query, results) {
    const suggestions = [];
    
    // Add popular searches based on results
    if (results.stores.length > 0) {
      suggestions.push(`${query} stores`);
    }
    
    if (results.products.length > 0) {
      suggestions.push(`${query} products`);
    }
    
    if (results.deals.length > 0) {
      suggestions.push(`${query} deals`);
    }

    // Add category suggestions
    results.categories.forEach(cat => {
      suggestions.push(`${query} in ${cat.name}`);
    });

    // Add related suggestions
    const relatedTerms = this.getRelatedTerms(query);
    relatedTerms.forEach(term => {
      suggestions.push(term);
    });

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

  // Get related search terms
  getRelatedTerms(query) {
    const relations = {
      'coffee': ['tea', 'café', 'espresso', 'latte'],
      'medicine': ['pharmacy', 'drugs', 'health', 'medical'],
      'cake': ['bakery', 'birthday', 'dessert', 'sweet'],
      'phone': ['mobile', 'smartphone', 'electronics', 'gadgets'],
      'food': ['groceries', 'restaurant', 'café', 'snacks'],
      'grocery': ['vegetables', 'fruits', 'milk', 'bread']
    };

    const related = [];
    Object.keys(relations).forEach(key => {
      if (query.includes(key)) {
        related.push(...relations[key]);
      }
    });

    return related;
  }

  // Get empty results structure
  getEmptyResults() {
    return {
      stores: [],
      products: [],
      deals: [],
      categories: [],
      suggestions: [
        'fresh vegetables',
        'pharmacy near me',
        'coffee shop',
        'birthday cake',
        'mobile phones',
        'deals today'
      ]
    };
  }

  // Get all data for specific category
  getByCategory(category) {
    return {
      stores: this.stores.filter(store => store.category === category),
      products: this.products.filter(product => product.category === category),
      deals: this.deals.filter(deal => deal.category === category)
    };
  }

  // Get trending searches (mock data)
  getTrendingSearches() {
    return [
      'Fresh vegetables',
      'Coffee delivery',
      'Birthday cake',
      'Pharmacy 24/7',
      'Mobile accessories',
      'Grocery deals'
    ];
  }

  // Get search history from localStorage
  getSearchHistory() {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  }

  // Save search to history
  saveSearchHistory(query) {
    try {
      const history = this.getSearchHistory();
      const newHistory = [query, ...history.filter(item => item !== query)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }
}

// Export singleton instance
export const searchService = new SearchService();

// Export data for other components
export { allStores, allProducts, allDeals, allCategories };