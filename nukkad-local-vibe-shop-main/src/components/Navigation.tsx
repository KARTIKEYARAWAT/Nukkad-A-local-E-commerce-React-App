import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ShoppingCart, 
  Search, 
  MapPin, 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  Heart,
  Package,
  ChevronDown,
  X,
  Clock,
  TrendingUp,
  Star,
  Tag
} from 'lucide-react';
import { searchService } from '@/services/dataService';

// Popular cities data
const popularCities = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'delhi', name: 'Delhi', state: 'Delhi' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh' }
];

export const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  
  // Enhanced search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Initialize data
  useEffect(() => {
    checkAuthStatus();
    
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }

    updateCartCount();
    loadSearchData();

    const handleAuthChange = (event) => {
      console.log('Auth change event received:', event.detail);
      const { type } = event.detail;
      
      if (type === 'login') {
        setTimeout(() => {
          checkAuthStatus();
        }, 100);
      } else if (type === 'logout') {
        setIsLoggedIn(false);
        setUser(null);
        setCartCount(0);
        console.log('Auth changed - user logged out');
      }
    };

    window.addEventListener('authChanged', handleAuthChange);

    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        console.log('Storage change detected:', e.key);
        checkAuthStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Load search-related data
  const loadSearchData = () => {
    setSearchHistory(searchService.getSearchHistory());
    setTrendingSearches(searchService.getTrendingSearches());
  };

  // Update cart count function
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalItems);
  };

  // Check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    
    setIsLoggedIn(false);
    setUser(null);
    setCartCount(0);
    
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { type: 'logout' } }));
    
    navigate('/');
    console.log('Logged out successfully');
  };

  // Enhanced search functionality
  const handleSearchInput = (value) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim()) {
      setSearchLoading(true);
      
      // Debounce search to avoid too many calls
      searchTimeoutRef.current = setTimeout(() => {
        const results = searchService.search(value.trim(), {
          location: selectedLocation,
          openOnly: false
        });
        
        setSearchResults(results);
        setShowSearchSuggestions(true);
        setSearchLoading(false);
      }, 300);
    } else {
      setSearchResults(null);
      setShowSearchSuggestions(false);
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (query = searchQuery) => {
    if (query.trim()) {
      console.log('Searching for:', query);
      
      // Save to history
      searchService.saveSearchHistory(query.trim());
      setSearchHistory(searchService.getSearchHistory());
      
      setShowSearchSuggestions(false);
      setIsSearchFocused(false);
      
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(query.trim())}&location=${encodeURIComponent(selectedLocation)}`);
      
      // Dispatch search event for other components
      window.dispatchEvent(new CustomEvent('globalSearch', { 
        detail: { query: query.trim(), location: selectedLocation } 
      }));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearchSubmit(suggestion);
  };

  const handleResultClick = (result) => {
    switch (result.type) {
      case 'store':
        navigate(`/store/${result.id}`);
        break;
      case 'product':
        navigate(`/product/${result.id}`);
        break;
      case 'deal':
        navigate(`/deals?id=${result.id}`);
        break;
      case 'category':
        navigate(`/category/${result.name}`);
        break;
      default:
        handleSearchSubmit(result.name || result.title);
    }
    setShowSearchSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowSearchSuggestions(false);
    setSearchLoading(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle search focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery.trim() || searchHistory.length > 0 || trendingSearches.length > 0) {
      setShowSearchSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setIsSearchFocused(false);
      setShowSearchSuggestions(false);
    }, 150);
  };

  // Handle location selection
  const handleLocationSelect = (cityName, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setSelectedLocation(cityName);
    localStorage.setItem('selectedLocation', cityName);
    setLocationSearch('');
    
    console.log(`Location changed to: ${cityName}`);
    
    window.dispatchEvent(new CustomEvent('locationChanged', { detail: cityName }));
    
    setTimeout(() => {
      setIsLocationOpen(false);
    }, 150);
  };

  // Filter cities based on search
  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    city.state.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Render search result item
  const renderSearchResultItem = (result, index) => {
    const getResultIcon = () => {
      switch (result.type) {
        case 'store': return <MapPin className="h-4 w-4 text-blue-600" />;
        case 'product': return <Package className="h-4 w-4 text-green-600" />;
        case 'deal': return <Tag className="h-4 w-4 text-red-600" />;
        case 'category': return <Menu className="h-4 w-4 text-purple-600" />;
        default: return <Search className="h-4 w-4 text-gray-600" />;
      }
    };

    return (
      <div
        key={`${result.type}-${result.id || index}`}
        onClick={() => handleResultClick(result)}
        className="flex items-center space-x-3 p-3 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          {getResultIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {result.name || result.title}
          </div>
          <div className="text-xs text-gray-600 flex items-center space-x-2">
            <span>{result.category}</span>
            {result.rating && (
              <>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{result.rating}</span>
                </div>
              </>
            )}
            {result.distance && (
              <>
                <span>•</span>
                <span>{result.distance}km</span>
              </>
            )}
            {result.price && (
              <>
                <span>•</span>
                <span>₹{result.price}</span>
              </>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-xs capitalize">
          {result.type}
        </Badge>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Nukkad
            </span>
          </Link>

          {/* Enhanced Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for stores, products, deals..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                className="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>

            {/* Enhanced Search Suggestions Dropdown */}
            {showSearchSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  
                  {/* Search Results */}
                  {searchResults && searchQuery.trim() && (
                    <>
                      {/* Stores */}
                      {searchResults.stores.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs font-medium text-muted-foreground mb-2 px-2 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            STORES ({searchResults.stores.length})
                          </div>
                          {searchResults.stores.slice(0, 3).map((store, idx) => renderSearchResultItem(store, idx))}
                        </div>
                      )}

                      {/* Products */}
                      {searchResults.products.length > 0 && (
                        <div className="p-2 border-t border-gray-100">
                          <div className="text-xs font-medium text-muted-foreground mb-2 px-2 flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            PRODUCTS ({searchResults.products.length})
                          </div>
                          {searchResults.products.slice(0, 3).map((product, idx) => renderSearchResultItem(product, idx))}
                        </div>
                      )}

                      {/* Deals */}
                      {searchResults.deals.length > 0 && (
                        <div className="p-2 border-t border-gray-100">
                          <div className="text-xs font-medium text-muted-foreground mb-2 px-2 flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            DEALS ({searchResults.deals.length})
                          </div>
                          {searchResults.deals.slice(0, 2).map((deal, idx) => renderSearchResultItem(deal, idx))}
                        </div>
                      )}

                      {/* View All Results */}
                      <div className="border-t border-gray-100 p-2">
                        <div
                          onClick={() => handleSearchSubmit()}
                          className="flex items-center space-x-2 p-2 cursor-pointer rounded-lg hover:bg-primary/5 text-primary font-medium"
                        >
                          <Search className="h-4 w-4" />
                          <span className="text-sm">
                            View all results for "{searchQuery}"
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Search History */}
                  {!searchQuery.trim() && searchHistory.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-medium text-muted-foreground mb-2 px-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        RECENT SEARCHES
                      </div>
                      {searchHistory.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSuggestionClick(item)}
                          className="flex items-center space-x-3 p-2 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Trending Searches */}
                  {!searchQuery.trim() && trendingSearches.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="text-xs font-medium text-muted-foreground mb-2 px-2 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        TRENDING
                      </div>
                      {trendingSearches.slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSuggestionClick(item)}
                          className="flex items-center space-x-3 p-2 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {searchResults && searchQuery.trim() && 
                   searchResults.stores.length === 0 && 
                   searchResults.products.length === 0 && 
                   searchResults.deals.length === 0 && (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-2">🔍</div>
                      <div className="text-sm font-medium mb-1">No results found</div>
                      <div className="text-xs text-muted-foreground">Try different keywords or check spelling</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Location Selector */}
          <div className="hidden lg:block">
            <DropdownMenu open={isLocationOpen} onOpenChange={setIsLocationOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">Deliver to</span>
                    <span className="font-medium text-foreground">{selectedLocation}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <div className="p-3" onClick={(e) => e.stopPropagation()}>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search for your city..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                    POPULAR CITIES
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <div
                          key={city.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLocationSelect(city.name, e);
                          }}
                          className={`flex items-center justify-between p-2 cursor-pointer rounded hover:bg-gray-100 ${
                            selectedLocation === city.name ? 'bg-primary/10 text-primary' : ''
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{city.name}</span>
                            <span className="text-xs text-muted-foreground">{city.state}</span>
                          </div>
                          {selectedLocation === city.name && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No cities found matching "{locationSearch}"
                      </div>
                    )}
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <div className="p-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs hover:bg-accent hover:text-accent-foreground"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              console.log('Current location:', position.coords);
                              handleLocationSelect('Current Location', e);
                            },
                            (error) => {
                              console.error('Location access denied:', error);
                            }
                          );
                        }
                      }}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Use Current Location
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm" className="relative hover:bg-accent hover:text-accent-foreground">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Authentication */}
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium overflow-hidden">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name || 'User'} 
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <span className={user.avatar ? 'hidden' : 'block'}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground">
                        {user.name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email || user.phone || 'Account'}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium">{user.name || 'User'}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email || user.phone || 'Account'}
                    </p>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button size="sm" className="bg-gradient-primary hover:scale-105 transition-smooth" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden hover:bg-accent hover:text-accent-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search for stores, products, deals..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              className="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Search Suggestions */}
          {showSearchSuggestions && (
            <div className="mt-2 bg-white border rounded-xl shadow-lg max-h-80 overflow-y-auto">
              {/* Similar structure as desktop but optimized for mobile */}
              <div className="p-2">
                {searchResults && searchQuery.trim() ? (
                  <>
                    {/* Mobile search results */}
                    {[...searchResults.stores.slice(0, 2), ...searchResults.products.slice(0, 2), ...searchResults.deals.slice(0, 1)].map((result, idx) => renderSearchResultItem(result, idx))}
                    
                    <div className="border-t pt-2 mt-2">
                      <div
                        onClick={() => handleSearchSubmit()}
                        className="flex items-center space-x-2 p-2 cursor-pointer rounded-lg hover:bg-primary/5 text-primary font-medium"
                      >
                        <Search className="h-4 w-4" />
                        <span className="text-sm">View all results</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Mobile trending searches */}
                    {trendingSearches.slice(0, 4).map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSuggestionClick(item)}
                        className="flex items-center space-x-3 p-2 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Mobile Location Selector */}
          <div className="mt-3 lg:hidden">
            <DropdownMenu open={isLocationOpen} onOpenChange={setIsLocationOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between hover:bg-accent hover:text-accent-foreground"
                  size="sm"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Deliver to {selectedLocation}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full" align="start">
                <div className="p-3" onClick={(e) => e.stopPropagation()}>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search for your city..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLocationSelect(city.name, e);
                        }}
                        className={`flex items-center justify-between p-2 cursor-pointer rounded hover:bg-gray-100 ${
                          selectedLocation === city.name ? 'bg-primary/10 text-primary' : ''
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{city.name}</span>
                          <span className="text-xs text-muted-foreground">{city.state}</span>
                        </div>
                        {selectedLocation === city.name && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};