import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  Package, 
  Tag, 
  Grid, 
  List, 
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Phone,
  ExternalLink,
  Heart,
  ShoppingCart,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { searchService } from '@/services/dataService';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || 'Mumbai';
  
  // State management
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: '',
    distance: '',
    isOpen: false
  });
  const [showFilters, setShowFilters] = useState(false);

  // Search and filter logic
  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, location, filters, sortBy]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const results = searchService.search(query, {
        location,
        ...filters,
        sortBy
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ stores: [], products: [], deals: [], categories: [] });
    }
    setLoading(false);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      rating: '',
      distance: '',
      isOpen: false
    });
  };

  const getTotalResults = () => {
    if (!searchResults) return 0;
    return searchResults.stores.length + 
           searchResults.products.length + 
           searchResults.deals.length;
  };

  const getFilteredResults = () => {
    if (!searchResults) return [];
    
    let results = [];
    
    if (activeTab === 'all') {
      results = [
        ...searchResults.stores,
        ...searchResults.products,
        ...searchResults.deals
      ];
    } else if (activeTab === 'stores') {
      results = searchResults.stores;
    } else if (activeTab === 'products') {
      results = searchResults.products;
    } else if (activeTab === 'deals') {
      results = searchResults.deals;
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'distance':
        results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
      case 'price_low':
        results.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_high':
        results.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default: // relevance
        // Keep original order (already sorted by relevance)
        break;
    }

    return results;
  };

  // Render functions
  const renderStoreCard = (store, index) => (
    <div 
      key={`store-${store.id}-${index}`}
      className={`bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
        viewMode === 'list' ? 'flex items-center space-x-6 p-6' : 'p-6'
      }`}
      onClick={() => navigate(`/store/${store.id}`)}
    >
      <div className={`${viewMode === 'list' ? 'w-20 h-20' : 'w-full h-48'} bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
        <span className="text-3xl">{store.image}</span>
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all">{store.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{store.category}</p>
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <MapPin className="h-3 w-3 mr-1" />
            Store
          </Badge>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{store.description}</p>

        <div className="flex items-center space-x-6 text-xs text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{store.rating}</span>
            <span>({store.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span>{store.distance}km away</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span className={store.isOpen ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {store.isOpen ? `Closes ${store.closesAt}` : 'Closed'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Store
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300 hover:text-green-700">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-300 hover:text-red-700">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProductCard = (product, index) => (
    <div 
      key={`product-${product.id}-${index}`}
      className={`bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
        viewMode === 'list' ? 'flex items-center space-x-6 p-6' : 'p-6'
      }`}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className={`${viewMode === 'list' ? 'w-20 h-20' : 'w-full h-48'} bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
        <Package className="h-12 w-12 text-pink-400" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all">{product.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{product.category}</p>
          </div>
          <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
            <Package className="h-3 w-3 mr-1" />
            Product
          </Badge>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span>{product.storeName}</span>
            </div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            ₹{product.price}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-300 hover:text-red-700">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDealCard = (deal, index) => (
    <div 
      key={`deal-${deal.id}-${index}`}
      className={`bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden ${
        viewMode === 'list' ? 'flex items-center space-x-6 p-6' : 'p-6'
      }`}
      onClick={() => navigate(`/deals?id=${deal.id}`)}
    >
      <div className={`${viewMode === 'list' ? 'w-20 h-20' : 'w-full h-48'} bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform relative`}>
        <Tag className="h-12 w-12 text-orange-500" />
        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {deal.discount}% OFF
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all">{deal.title}</h3>
            <p className="text-sm text-gray-600 font-medium">{deal.storeName}</p>
          </div>
          <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Deal
          </Badge>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{deal.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Valid till {deal.validTill}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">₹{deal.finalPrice}</div>
            <div className="text-sm text-gray-500 line-through">₹{deal.originalPrice}</div>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all">
          <Tag className="h-4 w-4 mr-2" />
          Claim Deal
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl border p-6">
                  <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded-xl mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-xl w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span>Search Results</span>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Search results for "{query}"
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {getTotalResults()} results found in {location}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-none ${viewMode === 'grid' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-none ${viewMode === 'list' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : ''}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none pr-10"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Nearest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {Object.values(filters).some(f => f) && (
                  <Badge className="ml-2 bg-orange-100 text-orange-700">
                    Active
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="hover:bg-red-50 hover:text-red-700">
                  Clear All
                </Button>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Café">Café</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="">Any Price</option>
                    <option value="0-100">₹0 - ₹100</option>
                    <option value="100-500">₹100 - ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value="1000+">₹1000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4+">4+ Stars</option>
                    <option value="3+">3+ Stars</option>
                    <option value="2+">2+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Distance</label>
                  <select
                    value={filters.distance}
                    onChange={(e) => handleFilterChange('distance', e.target.value)}
                    className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="">Any Distance</option>
                    <option value="1">Within 1km</option>
                    <option value="3">Within 3km</option>
                    <option value="5">Within 5km</option>
                    <option value="10">Within 10km</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.isOpen}
                    onChange={(e) => handleFilterChange('isOpen', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-orange-100 border-orange-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Open now only</span>
                </label>
              </div>
            </div>
          )}

          {/* Result Tabs */}
          <div className="flex items-center space-x-2 bg-white rounded-2xl border border-gray-200 p-2 shadow-sm">
            {[
              { key: 'all', label: 'All', count: getTotalResults() },
              { key: 'stores', label: 'Stores', count: searchResults?.stores.length || 0 },
              { key: 'products', label: 'Products', count: searchResults?.products.length || 0 },
              { key: 'deals', label: 'Deals', count: searchResults?.deals.length || 0 }
            ].map(tab => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 ${
                  activeTab === tab.key 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg' 
                    : 'hover:bg-orange-50'
                }`}
              >
                <span>{tab.label}</span>
                <Badge variant={activeTab === tab.key ? 'secondary' : 'outline'} className={`ml-1 ${
                  activeTab === tab.key ? 'bg-white/20 text-white border-white/30' : ''
                }`}>
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {searchResults && getTotalResults() > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {getFilteredResults().map((result, index) => {
              if (result.type === 'store') {
                return renderStoreCard(result, index);
              } else if (result.type === 'product') {
                return renderProductCard(result, index);
              } else if (result.type === 'deal') {
                return renderDealCard(result, index);
              }
              return null;
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-3">No results found</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg">
                Go Home
              </Button>
              <Button variant="outline" onClick={clearFilters} className="border-orange-300 hover:bg-orange-50 hover:border-orange-400">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;