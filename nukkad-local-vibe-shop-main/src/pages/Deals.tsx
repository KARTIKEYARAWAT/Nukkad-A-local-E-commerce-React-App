import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MapPin, Star, ShoppingCart, Filter, X, Search, Heart } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Deals = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('discount');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['All']);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const filtersParam = searchParams.get('filters');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (filtersParam === 'true') {
      setShowFilters(true);
    }
  }, [searchParams]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      console.log('🏷️ Fetching categories...');
      const response = await fetch(`${API_BASE_URL}/deals/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      console.log('📊 Categories response:', data);
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      // Fallback categories if API fails
      setCategories(['All', 'Groceries', 'Electronics', 'Fashion', 'Health', 'Home']);
    }
  };

  // Fetch deals from API
  const fetchDeals = async (page = 1) => {
    try {
      setLoading(true);
      const selectedLocation = localStorage.getItem('selectedLocation') || 'Mumbai';
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        location: selectedLocation,
        sortBy: sortBy
      });

      // Add optional filters
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      // Add price range filters
      const priceRanges = {
        'Under ₹200': { min: 0, max: 200 },
        '₹200-₹400': { min: 200, max: 400 },
        'Above ₹400': { min: 400, max: 999999 }
      };

      if (priceRange !== 'All' && priceRanges[priceRange]) {
        params.append('minPrice', priceRanges[priceRange].min.toString());
        params.append('maxPrice', priceRanges[priceRange].max.toString());
      }

      console.log('🔍 Fetching deals with params:', {
        selectedCategory,
        priceRange,
        sortBy,
        searchTerm,
        page,
        location: selectedLocation
      });
      
      console.log('📡 API URL:', `${API_BASE_URL}/deals?${params}`);

      const response = await fetch(`${API_BASE_URL}/deals?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }
      
      const data = await response.json();
      console.log('📊 API Response:', data);
      
      if (data.success) {
        if (page === 1) {
          setDeals(data.data);
        } else {
          setDeals(prev => [...prev, ...data.data]);
        }
        setPagination(data.pagination);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch deals');
      }
    } catch (error) {
      console.error('❌ Error fetching deals:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load more deals
  const loadMore = () => {
    if (pagination.hasNext && !loading) {
      fetchDeals(pagination.page + 1);
    }
  };

  // Calculate time left for each deal
  useEffect(() => {
    if (deals.length === 0) return;

    const timer = setInterval(() => {
      const newTimeLeft = {};
      deals.forEach(deal => {
        const now = new Date();
        const end = new Date(deal.endTime);
        const diff = end - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeft[deal._id] = { hours, minutes, seconds };
        } else {
          newTimeLeft[deal._id] = { hours: 0, minutes: 0, seconds: 0 };
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [deals]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDeals(1);
  }, [selectedCategory, priceRange, sortBy, searchTerm]);

  // Fix the clear filters function
  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange('All');
    setSortBy('discount'); // Use 'discount' instead of 'highest-discount'
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  };

  const formatTimeLeft = (time) => {
    if (!time) return "00:00:00";
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  };

  const handleAddToCart = (deal) => {
    console.log('Adding to cart:', deal.title);
    // Add to cart logic here
  };

  const handleToggleWishlist = (dealId) => {
    console.log('Toggle wishlist for deal:', dealId);
    // Wishlist logic here
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="border-0 bg-white rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Today's Best Deals
              </h1>
              <p className="text-muted-foreground">Limited time offers from local stores</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-card/90 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Price Range Filter */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="All">All Prices</option>
                <option value="Under ₹200">Under ₹200</option>
                <option value="₹200-₹400">₹200-₹400</option>
                <option value="Above ₹400">Above ₹400</option>
              </select>

              {/* Sort By - Fixed options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="discount">Highest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="ending-soon">Ending Soon</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Active Filters & Clear */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategory !== 'All' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCategory}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setSelectedCategory('All')}
                    />
                  </Badge>
                )}
                {priceRange !== 'All' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {priceRange}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setPriceRange('All')}
                    />
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{searchTerm}"
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setSearchTerm('')}
                    />
                  </Badge>
                )}
                {sortBy !== 'discount' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Sort: {sortBy === 'price-low' ? 'Price Low-High' : 
                           sortBy === 'price-high' ? 'Price High-Low' : 
                           sortBy === 'rating' ? 'Highest Rating' : 
                           sortBy === 'ending-soon' ? 'Ending Soon' : 
                           sortBy === 'newest' ? 'Newest First' : sortBy}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setSortBy('discount')}
                    />
                  </Badge>
                )}
              </div>
              
              {/* Fixed Clear All Button */}
              {(selectedCategory !== 'All' || priceRange !== 'All' || searchTerm || sortBy !== 'discount') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground hover:bg-destructive/10"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-2 text-sm text-muted-foreground">
              Showing {deals.length} of {pagination.total} deals
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {priceRange !== 'All' && ` • ${priceRange}`}
              {searchTerm && ` • Search: "${searchTerm}"`}
            </div>
          </div>
        </div>
      )}

      {/* Deals Grid */}
      <div className="container mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Unable to load deals</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchDeals(1)} variant="outline">
              Try Again
            </Button>
          </div>
        ) : loading && deals.length === 0 ? (
          <LoadingSkeleton />
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No deals found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Card key={deal._id} className="group hover:shadow-floating transition-all duration-300 hover:-translate-y-2 border-0 bg-white rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  {/* Deal Image with overlays */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={deal.image} 
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 text-sm">
                        {deal.discount || 0}% OFF
                      </Badge>
                    </div>

                    {/* Fast Delivery Badge */}
                    {deal.fastDelivery && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1">
                          Fast Delivery
                        </Badge>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md"
                      onClick={() => handleToggleWishlist(deal._id)}
                    >
                      <Heart className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>

                  {/* Deal Content */}
                  <div className="p-4">
                    {/* Category and Distance */}
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        {deal.category}
                      </Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {deal.distance} km
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {deal.title}
                    </h3>

                    {/* Store name */}
                    <p className="text-sm text-muted-foreground mb-2">
                      from <span className="font-medium text-foreground">{deal.store}</span>
                    </p>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{deal.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({deal.reviewCount} reviews)</span>
                    </div>

                    {/* Time Left */}
                    <div className="flex items-center justify-center bg-orange-50 border border-orange-200 rounded-lg p-2 mb-4">
                      <Clock className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="text-sm font-bold text-orange-700">
                        Ends in: {formatTimeLeft(timeLeft[deal._id])}
                      </span>
                    </div>

                    {/* Price Section */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-primary">
                            ₹{deal.discountPrice}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{deal.originalPrice}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          Save ₹{deal.savings || (deal.originalPrice - deal.discountPrice)}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-medium py-2 rounded-lg transition-all duration-300 hover:scale-105"
                      onClick={() => handleAddToCart(deal)}
                      disabled={!deal.inStock}
                    >
                      {deal.inStock ? 'Grab Deal' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {pagination.hasNext && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/20 hover:bg-primary/5"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Deals'}
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full shadow-floating bg-gradient-primary hover:scale-110 transition-smooth">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Deals;