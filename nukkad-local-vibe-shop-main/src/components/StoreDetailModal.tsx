import { useState, useEffect } from 'react';
import { 
  X, Star, MapPin, Clock, Phone, Navigation, 
  ThumbsUp, MessageCircle, Share2, Heart,
  ShoppingBag, Calendar, Users, ExternalLink,
  TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { GoogleMap } from './GoogleMap';
import ContactModal from './ContactModal';
import { reviewService, type Review, type ReviewSummary } from '@/services/reviewService';

const StoreDetailModal = ({ store, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Generate reviews and summary when store changes
  useEffect(() => {
    if (store) {
      const generatedReviews = reviewService.generateReviews(store);
      const summary = reviewService.generateReviewSummary(store, generatedReviews);
      setReviews(generatedReviews);
      setReviewSummary(summary);
    }
  }, [store]);

  // Enhanced store data with coordinates
  const storeWithCoordinates = store ? {
    ...store,
    coordinates: {
      lat: store.coordinates?.lat || 28.5355,
      lng: store.coordinates?.lng || 77.3910
    }
  } : null;

  const handleVisitStore = () => {
    if (storeWithCoordinates) {
      const { lat, lng } = storeWithCoordinates.coordinates;
      const destination = encodeURIComponent(`${lat},${lng}`);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
      window.open(url, '_blank');
    }
  };

  const handleGetDirections = () => {
    if (storeWithCoordinates) {
      const { lat, lng } = storeWithCoordinates.coordinates;
      const destination = encodeURIComponent(`${lat},${lng}`);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  const handleCallStore = () => {
    setIsContactModalOpen(true);
  };

  const formatAspectName = (aspect: string): string => {
    return aspect.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAspectIcon = (aspect: string) => {
    const icons = {
      'freshness': '🌿',
      'variety': '📦',
      'price': '💰',
      'quality': '⭐',
      'delivery': '🚚',
      'service': '👥',
      'taste': '😋',
      'ambiance': '🏪',
      'availability': '✅',
      'staff_knowledge': '🧠',
      'authenticity': '🔒'
    };
    return icons[aspect] || '📊';
  };

  if (!store) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
          {/* Header - Fixed */}
          <div className="relative bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 p-0 z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{store.image}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold truncate">{store.name}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3 flex-wrap">
                  <Badge variant="secondary">{store.category}</Badge>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{store.distance} away</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{store.rating}</span>
                    <span>({store.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${store.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`font-medium ${store.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {store.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-muted-foreground">
                      • {store.isOpen ? `Closes ${store.closesAt}` : store.closesAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-4 flex-wrap gap-2">
              <Button 
                onClick={handleVisitStore}
                className="bg-gradient-primary"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Visit Store
              </Button>
              <Button 
                variant="outline"
                onClick={handleGetDirections}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              <Button 
                variant="outline"
                onClick={handleCallStore}
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-400"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Details
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs - Fixed */}
          <div className="border-b flex-shrink-0">
            <div className="flex space-x-6 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'reviews', label: 'Reviews & AI Analysis' },
                { id: 'hours', label: 'Hours' },
                { id: 'location', label: 'Location & Map' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Store Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{store.rating}</div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{store.deliveryTime}</div>
                      <div className="text-sm text-muted-foreground">Delivery</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{store.reviewCount}</div>
                      <div className="text-sm text-muted-foreground">Reviews</div>
                    </div>
                  </div>

                  {/* Quick Contact Card */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-green-900">Quick Contact</h4>
                          <p className="text-sm text-green-700">{store.phone}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleCallStore}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Store Description */}
                  <div>
                    <h3 className="font-semibold mb-3">About this store</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {store.description}. We pride ourselves on offering fresh, quality products at competitive prices. 
                      Our friendly staff is always ready to help you find what you need. We offer fast delivery and excellent customer service.
                    </p>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="font-semibold mb-3">Services</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Home Delivery</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Online Ordering</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Cash on Delivery</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Return Policy</span>
                      </div>
                    </div>
                  </div>

                  {/* Popular Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Popular Items</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "Fresh Vegetables", price: "₹199", image: "🥬" },
                        { name: "Dairy Products", price: "₹299", image: "🥛" },
                        { name: "Fruits Bundle", price: "₹249", image: "🍎" },
                        { name: "Bread & Bakery", price: "₹89", image: "🍞" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                          <span className="text-2xl">{item.image}</span>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-primary font-semibold">{item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && reviewSummary && (
                <div className="space-y-8">
                  {/* AI Summary Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                        <span className="text-white">🤖</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-purple-900">AI Review Analysis</h3>
                        <p className="text-sm text-purple-600">Generated insights from customer reviews</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 rounded-xl p-4 mb-4">
                      <p className="text-gray-700 leading-relaxed">{reviewSummary.aiSummary}</p>
                    </div>

                    {/* Highlights and Concerns */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Highlights */}
                      {reviewSummary.highlights.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-green-800">Customer Highlights</h4>
                          </div>
                          <ul className="space-y-2">
                            {reviewSummary.highlights.map((highlight, index) => (
                              <li key={index} className="text-sm text-green-700 flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Concerns */}
                      {reviewSummary.concerns.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <h4 className="font-semibold text-amber-800">Areas for Improvement</h4>
                          </div>
                          <ul className="space-y-2">
                            {reviewSummary.concerns.map((concern, index) => (
                              <li key={index} className="text-sm text-amber-700 flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                <span>{concern}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating Summary */}
                  <div className="bg-muted/50 rounded-2xl p-6">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{store.rating}</div>
                        <div className="flex items-center justify-center mt-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{reviewSummary.overall.totalReviews} reviews</div>
                      </div>
                      
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map(rating => (
                          <div key={rating} className="flex items-center space-x-3 mb-2">
                            <span className="text-sm w-8 font-medium">{rating}★</span>
                            <Progress 
                              value={(reviewSummary.overall.distribution[rating] / reviewSummary.overall.totalReviews) * 100} 
                              variant="rating"
                              rating={rating}
                              className="flex-1 h-3"
                            />
                            <span className="text-sm text-muted-foreground w-12 text-right font-medium">
                              {reviewSummary.overall.distribution[rating]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Aspect Ratings */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                        Detailed Ratings by Aspect
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(reviewSummary.aspects).map(([aspect, data]) => (
                          <div key={aspect} className="bg-white/70 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{getAspectIcon(aspect)}</span>
                                <span className="font-medium">{formatAspectName(aspect)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star 
                                      key={star} 
                                      className={`h-3 w-3 ${star <= data.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">{data.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{data.summary}</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge 
                                variant={data.sentiment === 'positive' ? 'default' : data.sentiment === 'negative' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {data.sentiment}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{data.mentions} mentions</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">Customer Reviews</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                      >
                        {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                      </Button>
                    </div>

                    {(showAllReviews ? reviews : reviews.slice(0, 5)).map(review => (
                      <div key={review.id} className="border rounded-xl p-4 bg-white/50">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span>{review.avatar}</span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{review.user}</span>
                                  {review.verified && (
                                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <Star 
                                        key={star} 
                                        className={`h-3 w-3 ${star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span>•</span>
                                  <span>{review.date}</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-3 leading-relaxed">{review.comment}</p>
                            
                            {/* Aspect ratings for this review */}
                            {review.aspects && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {Object.entries(review.aspects).slice(0, 3).map(([aspect, rating]) => (
                                  <Badge key={aspect} variant="outline" className="text-xs">
                                    {formatAspectName(aspect)}: {rating.toFixed(1)}⭐
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm" className="h-8">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Helpful ({review.helpful})
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hours' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Store Hours</h3>
                    <div className="space-y-3">
                      {storeHours.map((schedule, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            schedule.isToday ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                          }`}
                        >
                          <span className={`font-medium ${schedule.isToday ? 'text-primary' : ''}`}>
                            {schedule.day}
                            {schedule.isToday && <span className="ml-2 text-xs">(Today)</span>}
                          </span>
                          <span className={schedule.isToday ? 'text-primary font-medium' : 'text-muted-foreground'}>
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-amber-700">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">Holiday Hours</span>
                    </div>
                    <p className="text-amber-600 text-sm mt-2">
                      Store hours may vary during holidays. Please call ahead to confirm.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'location' && storeWithCoordinates && (
                <div className="space-y-6">
                  {/* Google Map Component */}
                  <GoogleMap
                    address={store.address}
                    storeName={store.name}
                    lat={storeWithCoordinates.coordinates.lat}
                    lng={storeWithCoordinates.coordinates.lng}
                    phone={store.phone}
                  />

                  {/* Address Details */}
                  <div>
                    <h3 className="font-semibold mb-3">Address Details</h3>
                    <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-muted-foreground">{store.address}</div>
                        </div>
                      </div>
                      
                      {store.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <span>{store.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nearby Landmarks */}
                  <div>
                    <h3 className="font-semibold mb-3">Nearby Landmarks</h3>
                    <div className="space-y-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
                      <div>• Near City Center Mall (200m)</div>
                      <div>• Opposite Metro Station (150m)</div>
                      <div>• Next to HDFC Bank (50m)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <ContactModal 
        store={store}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

export default StoreDetailModal;