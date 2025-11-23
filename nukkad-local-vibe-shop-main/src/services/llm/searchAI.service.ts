import { LLMService } from './base-llm.service';

export class SearchAIService extends LLMService {
  async intelligentSearch(query: string, stores: any[]) {
    const storeData = stores.map(store => ({
      id: store.id,
      name: store.name,
      category: store.category,
      description: store.description,
      rating: store.rating,
      distance: store.distance,
      isOpen: store.isOpen,
      closesAt: store.closesAt,
      hasOffers: store.hasOffers
    }));

    const prompt = `Analyze this search query and find the best matching stores:

User Query: "${query}"

Available Stores:
${JSON.stringify(storeData, null, 2)}

Please analyze the user's intent and provide a JSON response with the following structure:
{
  "interpretation": "Brief explanation of what the user is looking for",
  "extractedIntent": "primary_intent (e.g., product_search, store_type, location_based)",
  "timePreference": "when they want to shop (e.g., now, evening, weekend)",
  "priceRange": "budget preference if mentioned (budget, moderate, premium)",
  "recommendedStores": [
    {
      "id": store_id,
      "name": "store_name",
      "category": "category",
      "matchReason": "specific reason why this store matches the query",
      "image": "store_emoji",
      "distance": "distance",
      "rating": rating,
      "reviewCount": count,
      "isOpen": boolean,
      "closesAt": "time"
    }
  ],
  "alternatives": ["alternative suggestion 1", "alternative suggestion 2"]
}

Consider:
- Store categories and specialties
- Current opening hours
- Ratings and reviews
- Distance from user
- Special offers
- Product availability likelihood

Provide top 3 most relevant stores with specific reasons why they match.`;

    try {
      const response = await this.generateStructuredContent(prompt, {
        temperature: 0.5 // Lower temperature for more consistent JSON
      });
      return response;
    } catch (error) {
      console.error('Intelligent search failed:', error);
      
      // Fallback to simple text matching
      const matchingStores = stores.filter(store =>
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.description.toLowerCase().includes(query.toLowerCase()) ||
        store.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3);

      return {
        interpretation: `Searching for "${query}" in available stores`,
        extractedIntent: "product_search",
        recommendedStores: matchingStores.map(store => ({
          ...store,
          matchReason: "Matches your search terms"
        })),
        alternatives: [
          "Try searching for specific categories",
          "Include time preferences like 'open late'",
          "Mention budget if looking for deals"
        ]
      };
    }
  }
}