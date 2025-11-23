import { LLMService } from './base-llm.service';

export class ChatAIService extends LLMService {
  async getChatResponse(userMessage: string, stores: any[], conversationHistory: any[] = []) {
    const storeContext = stores.map(store => 
      `${store.name} (${store.category}) - ${store.rating}★, ${store.distance}, ${store.isOpen ? 'Open' : 'Closed'}, ${store.description}`
    ).join('\n');

    const systemPrompt = `You are a helpful local shopping assistant for a neighborhood in India. Help users find stores, products, and make shopping decisions.

Available Stores:
${storeContext}

Instructions:
- Be friendly, helpful, and conversational
- Provide specific store recommendations with reasons
- Include practical details like distance, ratings, and opening hours
- Suggest alternatives when appropriate
- Keep responses concise but informative (max 2-3 sentences)
- Use Indian context and cultural understanding
- If asked about products, suggest which stores would likely have them

Current conversation:`;

    // Prepare conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-4), // Keep last 4 messages for context
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await this.generateChatContent(messages, {
        temperature: 0.8,
        maxOutputTokens: 300
      });

      // Extract recommended stores from the response
      const recommendedStores = this.extractStoreRecommendations(response, stores);
      
      return {
        content: response,
        recommendedStores: recommendedStores,
        suggestedActions: this.generateSuggestedActions(userMessage, stores)
      };
    } catch (error) {
      console.error('Chat AI Error:', error);
      return {
        content: this.getFallbackChatResponse(userMessage, stores),
        recommendedStores: stores.slice(0, 2),
        suggestedActions: ["Find nearby stores", "Get recommendations", "Check store hours"]
      };
    }
  }

  private extractStoreRecommendations(response: string, stores: any[]) {
    // Simple extraction - look for store names mentioned in response
    const mentioned = stores.filter(store => 
      response.toLowerCase().includes(store.name.toLowerCase())
    );
    
    return mentioned.slice(0, 3).map(store => ({
      ...store,
      reason: "Mentioned in AI recommendation"
    }));
  }

  private generateSuggestedActions(userMessage: string, stores: any[]) {
    const actions = [];
    
    if (userMessage.toLowerCase().includes('grocery') || userMessage.toLowerCase().includes('food')) {
      actions.push("Find grocery stores", "Show fresh markets", "Check organic options");
    } else if (userMessage.toLowerCase().includes('medicine') || userMessage.toLowerCase().includes('pharmacy')) {
      actions.push("Find pharmacies", "24-hour medical stores", "Health supplements");
    } else if (userMessage.toLowerCase().includes('coffee') || userMessage.toLowerCase().includes('cafe')) {
      actions.push("Best coffee shops", "Study-friendly cafes", "Quick snacks");
    } else {
      actions.push("Show all categories", "Find nearby stores", "Get recommendations");
    }
    
    return actions.slice(0, 3);
  }

  private getFallbackChatResponse(userMessage: string, stores: any[]) {
    if (userMessage.toLowerCase().includes('grocery') || userMessage.toLowerCase().includes('food')) {
      const groceryStores = stores.filter(s => s.category === 'Groceries');
      if (groceryStores.length > 0) {
        const best = groceryStores[0];
        return `For groceries, I'd recommend ${best.name}! It's ${best.distance} away with a ${best.rating}★ rating. They have ${best.description.toLowerCase()} and are ${best.isOpen ? `open until ${best.closesAt}` : 'currently closed'}.`;
      }
    }
    
    if (userMessage.toLowerCase().includes('pharmacy') || userMessage.toLowerCase().includes('medicine')) {
      const pharmacies = stores.filter(s => s.category === 'Pharmacy');
      if (pharmacies.length > 0) {
        const best = pharmacies[0];
        return `For medicines, ${best.name} is your best bet! Located ${best.distance} away with ${best.rating}★ rating. They're ${best.isOpen ? `open until ${best.closesAt}` : 'currently closed'}.`;
      }
    }

    return `I can help you find information about local stores! We have ${stores.length} stores including groceries, pharmacies, cafes, and more. What are you looking for?`;
  }
}