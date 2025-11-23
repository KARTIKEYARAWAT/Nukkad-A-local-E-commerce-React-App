import { useState, useEffect } from 'react';
import { Brain, Clock, Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const AIRecommendations = ({ stores, userPreferences, currentTime }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    generateRecommendations();
  }, [stores, currentTime]);

  const generateRecommendations = () => {
    // Simple mock recommendations based on time and ratings
    const hour = currentTime.getHours();
    let timeBasedRecs = [];

    if (hour >= 6 && hour <= 10) {
      // Morning recommendations
      timeBasedRecs = stores.filter(s => 
        s.category === 'Bakery' || s.category === 'Café' || s.category === 'Groceries'
      ).slice(0, 3);
    } else if (hour >= 11 && hour <= 14) {
      // Lunch recommendations
      timeBasedRecs = stores.filter(s => 
        s.category === 'Café' || s.category === 'Groceries'
      ).slice(0, 3);
    } else if (hour >= 15 && hour <= 18) {
      // Afternoon recommendations
      timeBasedRecs = stores.filter(s => 
        s.category === 'Pharmacy' || s.category === 'Electronics' || s.category === 'Stationery'
      ).slice(0, 3);
    } else {
      // Evening recommendations
      timeBasedRecs = stores.filter(s => 
        s.isOpen && (s.category === 'Groceries' || s.category === 'Pharmacy')
      ).slice(0, 3);
    }

    setRecommendations(timeBasedRecs);
  };

  const getTimeBasedMessage = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour <= 10) return "Good morning! Here are some breakfast and morning essentials:";
    if (hour >= 11 && hour <= 14) return "Lunch time! Consider these options:";
    if (hour >= 15 && hour <= 18) return "Afternoon picks for your errands:";
    return "Evening essentials still open:";
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-blue-900">AI Recommendations</h3>
          <p className="text-sm text-blue-600">{getTimeBasedMessage()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {recommendations.map((store, idx) => (
          <div key={store.id} className="bg-white/70 rounded-xl p-4 border border-blue-100 hover:border-blue-300 transition-all cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
                <span className="text-sm">{store.image}</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">{store.name}</h4>
                <p className="text-xs text-blue-600">{store.category}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-blue-700">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-current text-yellow-400" />
                <span>{store.rating} ({store.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{store.distance} away</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span className={store.isOpen ? 'text-green-600' : 'text-red-600'}>
                  {store.isOpen ? `Closes ${store.closesAt}` : 'Closed'}
                </span>
              </div>
            </div>

            {store.hasOffers && (
              <Badge className="mt-2 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs">
                Special Offers
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};