import { useState, useEffect } from 'react';
import { MapPin, Star, Clock, ArrowRight, Phone, Brain, Filter, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StoreDetailModal from './StoreDetailModal';
import ContactModal from './ContactModal';
import { AIRecommendations } from './AIRecommendations';
import { AISmartSearch } from './AISmartSearch';
import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';
import { AIChatAssistant } from './AIChatAssistant';

// Extended stores data with more entries for pagination testing
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
    },
    {
        id: 4,
        name: 'Corner Store',
        category: 'General',
        distance: '400m',
        rating: 4.5,
        isOpen: false,
        closesAt: 'Opens at 7:00 AM',
        hasOffers: false,
        image: '🏪',
        deliveryTime: '20 min',
        phone: '+91 98765 43213',
        address: 'Shop No. 23, Sector 21, Noida, UP 201301',
        description: 'General store with daily necessities',
        reviewCount: 98,
        coordinates: { lat: 28.5385, lng: 77.3940 },
    },
    {
        id: 5,
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
    },
    {
        id: 6,
        name: 'Book World',
        category: 'Stationery',
        distance: '350m',
        rating: 4.4,
        isOpen: true,
        closesAt: '8:00 PM',
        hasOffers: false,
        image: '📚',
        deliveryTime: '25 min',
        phone: '+91 98765 43215',
        address: 'Shop No. 89, Sector 21, Noida, UP 201301',
        description: 'Books, stationery, and office supplies',
        reviewCount: 76,
        coordinates: { lat: 28.5405, lng: 77.3960 },
    },
    // Additional stores for pagination
    {
        id: 7,
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
    },
    {
        id: 8,
        name: 'Fashion Mart',
        category: 'Fashion',
        distance: '380m',
        rating: 4.2,
        isOpen: true,
        closesAt: '10:30 PM',
        hasOffers: false,
        image: '👗',
        deliveryTime: '35 min',
        phone: '+91 98765 43217',
        address: 'Shop No. 67, Sector 21, Noida, UP 201301',
        description: 'Trendy clothing and accessories',
        reviewCount: 145,
        coordinates: { lat: 28.5425, lng: 77.3980 },
    },
    {
        id: 9,
        name: 'Healthy Living Store',
        category: 'Health',
        distance: '520m',
        rating: 4.7,
        isOpen: true,
        closesAt: '8:30 PM',
        hasOffers: true,
        image: '🌿',
        deliveryTime: '22 min',
        phone: '+91 98765 43218',
        address: 'Shop No. 34, Sector 21, Noida, UP 201301',
        description: 'Organic products and health supplements',
        reviewCount: 88,
        coordinates: { lat: 28.5435, lng: 77.3990 },
    },
    {
        id: 10,
        name: 'Quick Bites',
        category: 'Café',
        distance: '310m',
        rating: 4.1,
        isOpen: true,
        closesAt: '11:00 PM',
        hasOffers: false,
        image: '🍔',
        deliveryTime: '20 min',
        phone: '+91 98765 43219',
        address: 'Shop No. 78, Sector 21, Noida, UP 201301',
        description: 'Fast food and quick snacks',
        reviewCount: 167,
        coordinates: { lat: 28.5445, lng: 77.4000 },
    },
    {
        id: 11,
        name: 'Super Groceries',
        category: 'Groceries',
        distance: '600m',
        rating: 4.6,
        isOpen: true,
        closesAt: '10:00 PM',
        hasOffers: true,
        image: '🛒',
        deliveryTime: '25 min',
        phone: '+91 98765 43220',
        address: 'Shop No. 112, Sector 21, Noida, UP 201301',
        description: 'Complete grocery solution with home delivery',
        reviewCount: 203,
        coordinates: { lat: 28.5455, lng: 77.4010 },
    },
    {
        id: 12,
        name: 'City Pharmacy Plus',
        category: 'Pharmacy',
        distance: '480m',
        rating: 4.8,
        isOpen: true,
        closesAt: '12:00 AM',
        hasOffers: false,
        image: '🏥',
        deliveryTime: '15 min',
        phone: '+91 98765 43221',
        address: 'Shop No. 90, Sector 21, Noida, UP 201301',
        description: '24/7 pharmacy with emergency medicines',
        reviewCount: 156,
        coordinates: { lat: 28.5465, lng: 77.4020 },
    }
];

export const NearbyStoresSection = () => {
    const [selectedStore, setSelectedStore] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contactStore, setContactStore] = useState(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [showAIFeatures, setShowAIFeatures] = useState(true);

    // Filter and pagination state
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('distance');
    const [showFilters, setShowFilters] = useState(false);
    const [displayedStores, setDisplayedStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        total: 0,
        hasMore: false
    });

    // Get unique categories
    const categories = ['All', ...new Set(allStores.map(store => store.category))];

    // Filter and sort stores
    const getFilteredStores = () => {
        let filtered = [...allStores];

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(store => store.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(store => 
                store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort stores
        switch (sortBy) {
            case 'distance':
                filtered.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'delivery-time':
                filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
                break;
            default:
                break;
        }

        return filtered;
    };

    // Load stores with pagination
    const loadStores = (reset = false) => {
        setLoading(true);
        
        // Simulate API delay
        setTimeout(() => {
            const filteredStores = getFilteredStores();
            const currentPage = reset ? 1 : pagination.page;
            const startIndex = (currentPage - 1) * pagination.limit;
            const endIndex = startIndex + pagination.limit;
            const pageStores = filteredStores.slice(startIndex, endIndex);

            if (reset) {
                setDisplayedStores(pageStores);
            } else {
                setDisplayedStores(prev => [...prev, ...pageStores]);
            }

            setPagination({
                page: currentPage,
                limit: pagination.limit,
                total: filteredStores.length,
                hasMore: endIndex < filteredStores.length
            });

            setLoading(false);
        }, 500);
    };

    // Load more stores
    const loadMoreStores = () => {
      if (!loading && pagination.hasMore) {
        setPagination(prev => ({ ...prev, page: prev.page + 1 }));
      }
    };

    // Handle load more
    useEffect(() => {
      if (pagination.page > 1) {
        loadStores(false); // Append to existing stores
      }
    }, [pagination.page]);

    // Clear filters
    const clearFilters = () => {
        setSelectedCategory('All');
        setSearchTerm('');
        setSortBy('distance');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Handle filters change
    useEffect(() => {
        loadStores(true); // Reset and load from page 1
    }, [selectedCategory, searchTerm, sortBy]);

    // Initial load
    useEffect(() => {
        loadStores(true);
    }, []);

    const handleStoreClick = (store) => {
        setSelectedStore(store);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStore(null);
    };

    const handleContactClick = (e, store) => {
        e.stopPropagation();
        setContactStore(store);
        setIsContactModalOpen(true);
    };

    const handleCloseContactModal = () => {
        setIsContactModalOpen(false);
        setContactStore(null);
    };

    const handleAIStoreSelect = (store) => {
        setSelectedStore(store);
        setIsModalOpen(true);
    };

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 fade-in-up">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-foreground">Nearby </span>
                            <span className="bg-gradient-secondary bg-clip-text text-transparent">
                                Stores
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Discover shops with AI-powered recommendations
                        </p>
                    </div>

                    <div className="flex items-center space-x-3 mt-4 md:mt-0">
                        <Button
                            variant={showAIFeatures ? 'default' : 'outline'}
                            onClick={() => setShowAIFeatures(!showAIFeatures)}
                            className="group"
                        >
                            <Brain className="h-4 w-4 mr-2" />
                            AI Features
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowFilters(!showFilters)}
                            className="group"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </div>

                {/* Filters Section */}
                {showFilters && (
                    <div className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search stores..."
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

                            {/* Sort By */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="distance">Nearest First</option>
                                <option value="rating">Highest Rating</option>
                                <option value="name">Name A-Z</option>
                                <option value="delivery-time">Fastest Delivery</option>
                            </select>

                            {/* Clear Filters */}
                            <Button 
                                variant="outline" 
                                onClick={clearFilters}
                                className="flex items-center justify-center"
                            >
                                Clear All
                            </Button>
                        </div>

                        {/* Active Filters */}
                        <div className="flex items-center gap-2 flex-wrap mt-4">
                            {selectedCategory !== 'All' && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    {selectedCategory}
                                    <X 
                                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                        onClick={() => setSelectedCategory('All')}
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
                            {sortBy !== 'distance' && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Sort: {sortBy === 'rating' ? 'Highest Rating' : 
                                           sortBy === 'name' ? 'Name A-Z' : 
                                           sortBy === 'delivery-time' ? 'Fastest Delivery' : sortBy}
                                    <X 
                                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                        onClick={() => setSortBy('distance')}
                                    />
                                </Badge>
                            )}
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 text-sm text-muted-foreground">
                            Showing {displayedStores.length} of {pagination.total} stores
                            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                            {searchTerm && ` • Search: "${searchTerm}"`}
                        </div>
                    </div>
                )}

                {/* AI Features Section */}
                {showAIFeatures && (
                    <div className="space-y-8 mb-12">
                        <AISmartSearch
                            stores={displayedStores}
                            onStoreSelect={handleAIStoreSelect}
                        />
                        <AIRecommendations
                            stores={displayedStores}
                            userPreferences={{}}
                            currentTime={new Date()}
                        />
                        <AIAnalyticsDashboard stores={allStores} />
                    </div>
                )}

                {/* Store Grid */}
                {displayedStores.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">No stores found</h3>
                        <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                        <Button onClick={clearFilters} variant="outline">
                          Clear Filters
                        </Button>
                      </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedStores.map((store, index) => (
                                <div
                                    key={store.id}
                                    onClick={() => handleStoreClick(store)}
                                    className="store-card bg-card rounded-3xl p-6 shadow-card hover:shadow-floating transition-smooth card-3d cursor-pointer animate-zoom-in group relative"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Store Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-primary-light rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="text-xl">{store.image}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                                                    {store.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {store.category}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {store.hasOffers && (
                                                <Badge className="bg-gradient-accent text-accent-foreground">
                                                    Offers
                                                </Badge>
                                            )}

                                            {showAIFeatures && (
                                                <Badge className="bg-purple-100 text-purple-700 text-xs">
                                                    AI: {Math.round(store.rating * 20)}%
                                                </Badge>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => handleContactClick(e, store)}
                                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-green-100 hover:bg-green-400 text-green-700"
                                                title="Contact Store"
                                            >
                                                <Phone className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Store Info */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-1 text-muted-foreground">
                                                <MapPin className="h-4 w-4 text-muted-foreground/60" />
                                                <span>{store.distance} away</span>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <Star className="h-4 w-4 fill-primary text-primary" />
                                                <span className="font-medium">{store.rating}</span>
                                                <span className="text-muted-foreground">
                                                    ({store.reviewCount})
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4 text-muted-foreground/60" />
                                                <span
                                                    className={
                                                        store.isOpen
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }
                                                >
                                                    {store.isOpen
                                                        ? `Closes ${store.closesAt}`
                                                        : store.closesAt}
                                                </span>
                                            </div>

                                            <span className="text-muted-foreground">
                                                🚚 {store.deliveryTime}
                                            </span>
                                        </div>

                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {store.description}
                                        </p>

                                        {showAIFeatures && (
                                            <div className="bg-purple-50 rounded-lg p-2 text-xs">
                                                <span className="text-purple-700 font-medium">
                                                    🤖 AI says: Perfect for{' '}
                                                    {store.category.toLowerCase()} shopping
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Store Status */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    store.isOpen
                                                        ? 'bg-green-500 animate-pulse'
                                                        : 'bg-red-500'
                                                }`}
                                            ></div>
                                            <span className="text-sm font-medium">
                                                {store.isOpen ? 'Open Now' : 'Closed'}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-muted-foreground">
                                                Click for details
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                            ))}
                        </div>

                        {/* Loading skeleton while loading more */}
                        {loading && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {[...Array(3)].map((_, index) => (
                              <div key={index} className="bg-card rounded-3xl p-6 animate-pulse">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                                    <div>
                                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div className="h-3 bg-gray-200 rounded"></div>
                                  <div className="h-3 bg-gray-200 rounded"></div>
                                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Load More Button */}
                        {pagination.hasMore && !loading && (
                            <div className="text-center mt-12 fade-in-up">
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="group border-primary/20 hover:bg-primary/5 bg-white shadow-md hover:shadow-lg transition-all duration-300"
                                    onClick={loadMoreStores}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-base font-medium">
                                          Load More Stores
                                        </span>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                                          {pagination.total - displayedStores.length} remaining
                                        </Badge>
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Button>
                                
                                {/* Progress indicator */}
                                <div className="mt-4 max-w-xs mx-auto">
                                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                    <span>Showing {displayedStores.length}</span>
                                    <span>of {pagination.total} stores</span>
                                  </div>
                                  <Progress 
                                    value={(displayedStores.length / pagination.total) * 100}
                                    className="h-2"
                                  />
                                </div>
                            </div>
                        )}

                        {/* End of results message */}
                        {!pagination.hasMore && displayedStores.length > 0 && (
                          <div className="text-center mt-12 py-8 border-t border-border">
                            <div className="text-4xl mb-3">🎉</div>
                            <h3 className="text-lg font-semibold mb-2">You've seen all stores!</h3>
                            <p className="text-muted-foreground">
                              Showing all {displayedStores.length} stores
                              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                            </p>
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => {
                                setSelectedCategory('All');
                                setSearchTerm('');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              Browse All Categories
                            </Button>
                          </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <StoreDetailModal
                store={selectedStore}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />

            <ContactModal
                store={contactStore}
                isOpen={isContactModalOpen}
                onClose={handleCloseContactModal}
            />

            {/* Add the floating chat assistant */}
            <AIChatAssistant stores={allStores} />
        </section>
    );
};