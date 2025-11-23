import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, ShoppingCart } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const DealsSection = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  // Fetch featured deals from API
  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const selectedLocation = localStorage.getItem('selectedLocation') || 'Mumbai';
      const apiUrl = `${API_BASE_URL}/deals/featured?location=${selectedLocation}&limit=6`;
      
      console.log('🔍 Fetching deals from:', apiUrl);
      console.log('🌐 API_BASE_URL:', API_BASE_URL);
      
      const response = await fetch(apiUrl);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        // Try to get error message from response
        const errorText = await response.text();
        console.error('📡 Response error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📊 Received data:', data);
      
      if (data.success && Array.isArray(data.data)) {
        console.log('✅ Setting deals:', data.data.length, 'deals');
        setDeals(data.data);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching deals:', error);
      setError(error.message);
      // Set empty array as fallback
      setDeals([]);
    } finally {
      setLoading(false);
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

  // Fetch deals on component mount
  useEffect(() => {
    fetchDeals();
  }, []);

  const formatTimeLeft = (time) => {
    if (!time) return "00:00:00";
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  };

  const handleAddToCart = (deal) => {
    console.log('Adding to cart:', deal.title);
    // Add to cart logic here
  };

  // Loading skeleton
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

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🔥</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Hot Deals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Limited time offers from your favorite local stores. Grab them before they're gone!
            </p>
          </div>

          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Unable to load deals</h3>
            <p className="text-gray-600 mb-4">Error: {error}</p>
            <Button onClick={fetchDeals} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🔥</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Hot Deals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Limited time offers from your favorite local stores. Grab them before they're gone!
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <LoadingSkeleton />
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No deals available</h3>
            <p className="text-gray-600 mb-4">Check back soon for new deals!</p>
            <Button onClick={fetchDeals} variant="outline">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Card key={deal._id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  {/* Deal Image with overlays */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={deal.image} 
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop';
                      }}
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 text-sm">
                        {deal.discount}% OFF
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
                  </div>

                  {/* Deal Content */}
                  <div className="p-4">
                    {/* Category and Distance */}
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        {deal.category}
                      </Badge>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {deal.distance} km
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {deal.title}
                    </h3>

                    {/* Store name */}
                    <p className="text-sm text-gray-500 mb-2">
                      from <span className="font-medium text-gray-700">{deal.store}</span>
                    </p>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{deal.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({deal.reviewCount} reviews)</span>
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
                          <span className="text-2xl font-bold text-orange-600">
                            ₹{deal.discountPrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
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
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {deal.inStock ? 'Grab Deal' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View All Deals Button */}
        <div className="text-center mt-12">
          <Link to="/deals">
            <Button size="lg" className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              View All Deals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};