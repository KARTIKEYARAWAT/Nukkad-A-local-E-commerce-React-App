import { useState } from 'react';
import { Search, Sparkles, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchAIService } from '@/services/llm/searchAI.service';

export const AISmartSearch = ({ stores, onStoreSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchService = new SearchAIService();

  const handleAISearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchResults = await searchService.intelligentSearch(query, stores);
      setResults(searchResults);
    } catch (error) {
      console.error('AI Search failed:', error);
      const fallbackResults = stores.filter(store => 
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3);
      
      setResults({
        interpretation: `Searching for "${query}" in available stores`,
        recommendedStores: fallbackResults.map(store => ({
          ...store,
          matchReason: "Matches your search terms"
        }))
      });
    }
    setLoading(false);
  };

  const exampleQueries = [
    "Find fresh vegetables",
    "Best coffee shop", 
    "Pharmacy nearby",
    "Cheap electronics",
    "Bakery for cake",
    "Organic food"
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-purple-900">AI Smart Search</h3>
          <p className="text-sm text-purple-600">Search naturally - "Find fresh vegetables open late"</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
          placeholder="What are you looking for? (e.g., 'fresh bread for breakfast')"
          className="w-full pl-10 pr-24 py-3 border border-purple-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
        />
        <Button
          onClick={handleAISearch}
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white hover:text-white"
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Example Queries */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-purple-600 font-medium">Try:</span>
        {exampleQueries.slice(0, 3).map((example, idx) => (
          <Button
            key={idx}
            variant="ghost"
            size="sm"
            onClick={() => setQuery(example)}
            className="text-xs h-6 bg-white/50 hover:bg-purple-100 text-purple-700 hover:text-purple-900"
          >
            "{example.length > 12 ? `${example.substring(0, 12)}...` : example}"
          </Button>
        ))}
      </div>

      {/* AI Search Results */}
      {results && (
        <div className="space-y-4">
          {/* AI Interpretation */}
          <div className="bg-white/70 rounded-xl p-4">
            <h4 className="font-semibold text-purple-800 mb-2">🤖 AI Understanding:</h4>
            <p className="text-sm text-purple-700">{results.interpretation}</p>
          </div>

          {/* Recommended Stores */}
          <div className="grid gap-3">
            {results.recommendedStores?.map((store, idx) => (
              <div
                key={idx}
                onClick={() => onStoreSelect(store)}
                className="bg-white/80 rounded-xl p-4 border border-purple-100 hover:border-purple-300 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                      <span className="text-sm">{store.image}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-purple-900">{store.name}</h5>
                      <p className="text-sm text-purple-600">{store.category}</p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    #{idx + 1} Match
                  </Badge>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-purple-700 font-medium mb-2">
                    🎯 Why this matches: {store.matchReason}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-purple-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{store.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span className={store.isOpen ? 'text-green-600' : 'text-red-600'}>
                        {store.isOpen ? `Closes ${store.closesAt}` : 'Closed'}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {store.rating}⭐ ({store.reviewCount})
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};