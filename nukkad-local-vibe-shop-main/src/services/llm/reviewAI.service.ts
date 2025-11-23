import { LLMService } from './base-llm.service';

interface ReviewAnalysisRequest {
  storeData: any;
  existingReviews: any[];
  analysisType: 'generate' | 'summarize' | 'sentiment' | 'aspects';
}

export class ReviewAIService extends LLMService {
  async generateRealisticReviews(store: any, count: number) {
    const prompt = `
    Generate ${count} realistic customer reviews for "${store.name}", a ${store.category} store.
    
    Store Details:
    - Name: ${store.name}
    - Category: ${store.category}
    - Rating: ${store.rating}/5
    - Location: ${store.address}
    - Description: ${store.description}
    
    Generate diverse reviews with:
    - Varied writing styles (casual, detailed, brief)
    - Different customer personas (families, students, professionals)
    - Specific mentions of products/services
    - Realistic complaints and praise
    - Cultural context appropriate for Indian local stores
    
    Return as JSON array with: rating, title, comment, customerName, date, verified, helpful
    `;

    return await this.generateContent(prompt);
  }

  async generateAmazonStyleSummary(reviews: any[], storeCategory: string) {
    const prompt = `
    Analyze these customer reviews and create an Amazon-style AI summary:
    
    Reviews: ${JSON.stringify(reviews)}
    Store Category: ${storeCategory}
    
    Generate:
    1. Overall sentiment analysis
    2. Key positive aspects (top 3)
    3. Areas for improvement (top 2)
    4. Specific product/service mentions
    5. Customer recommendation score
    6. Brief 2-sentence summary
    
    Format as structured JSON with sections for highlights, concerns, and summary.
    `;

    return await this.generateContent(prompt);
  }
}