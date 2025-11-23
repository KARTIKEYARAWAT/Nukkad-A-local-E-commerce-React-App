interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  avatar: string;
  verified: boolean;
  aspects?: {
    [key: string]: number; // aspect rating out of 5
  };
}

interface ReviewSummary {
  overall: {
    averageRating: number;
    totalReviews: number;
    distribution: { [key: number]: number };
  };
  aspects: {
    [key: string]: {
      rating: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      mentions: number;
      summary: string;
    };
  };
  aiSummary: string;
  highlights: string[];
  concerns: string[];
}

class ReviewService {
  private storeAspects = {
    'Groceries': ['freshness', 'variety', 'price', 'quality', 'delivery', 'packaging'],
    'Pharmacy': ['availability', 'pricing', 'staff_knowledge', 'delivery_speed', 'authenticity', 'service'],
    'Bakery': ['taste', 'freshness', 'variety', 'presentation', 'value', 'custom_orders'],
    'Café': ['taste', 'ambiance', 'service', 'price', 'cleanliness', 'wifi'],
    'Electronics': ['quality', 'price', 'warranty', 'variety', 'staff_knowledge', 'after_sales'],
    'Fashion': ['quality', 'style', 'fit', 'price', 'variety', 'fabric'],
    'Health': ['quality', 'authenticity', 'price', 'variety', 'expiry_dates', 'advice'],
    'General': ['variety', 'price', 'quality', 'convenience', 'staff', 'availability'],
    'Stationery': ['quality', 'variety', 'price', 'availability', 'brand_selection', 'condition']
  };

  private reviewTemplates = {
    'Groceries': [
      "Fresh vegetables and fruits. Good quality products at reasonable prices.",
      "Excellent variety of items. Home delivery is quick and reliable.",
      "Quality is inconsistent sometimes. Prices are competitive though.",
      "Fresh produce daily. Staff is helpful in selecting items.",
      "Good store for daily essentials. Delivery packaging could be better.",
      "Wide range of organic products. Slightly expensive but worth it.",
      "Quick delivery service. Products are usually fresh and well-packaged."
    ],
    'Pharmacy': [
      "All medicines available. Staff is knowledgeable about medications.",
      "Quick service and genuine medicines. Home delivery is excellent.",
      "Good stock of medicines. Prices are reasonable compared to others.",
      "Helpful pharmacist who explains medicine usage properly.",
      "Emergency medicines always available. Open till late hours.",
      "Authentic medicines with proper bills. Delivery is very fast.",
      "Good variety of health products. Staff is professional and courteous."
    ],
    'Bakery': [
      "Fresh baked goods daily. Cakes are delicious and beautifully decorated.",
      "Excellent pastries and bread. Custom cake orders are handled well.",
      "Good taste and quality. Prices are reasonable for fresh items.",
      "Wide variety of baked items. Birthday cakes are their specialty.",
      "Fresh bread every morning. Pastries are always soft and tasty.",
      "Custom designs for cakes are creative. Taste is consistently good.",
      "Good quality ingredients used. Items stay fresh for reasonable time."
    ],
    'Café': [
      "Great coffee and cozy ambiance. Perfect place for meetings.",
      "Excellent food quality. Service is quick and staff is friendly.",
      "Good variety of snacks and beverages. WiFi is reliable.",
      "Nice atmosphere for studying. Coffee quality is consistently good.",
      "Reasonable prices for good quality food. Clean and hygienic.",
      "Quick service during lunch hours. Menu has good variety.",
      "Comfortable seating and good music. Food presentation is nice."
    ],
    'Electronics': [
      "Wide range of mobile phones and accessories. Prices are competitive.",
      "Good quality products with proper warranty. Staff is knowledgeable.",
      "Latest gadgets available. After-sales service is reliable.",
      "Competitive pricing and genuine products. Good variety of brands.",
      "Helpful staff who explain product features well. Good deals.",
      "Quality products with manufacturer warranty. Service is professional.",
      "Good selection of accessories. Prices are better than mall stores."
    ],
    'Fashion': [
      "Trendy clothes with good fabric quality. Reasonable pricing.",
      "Wide variety of styles and sizes. Quality is generally good.",
      "Good collection of casual and formal wear. Fitting rooms available.",
      "Latest fashion trends available. Fabric quality varies by price.",
      "Good variety for all age groups. Some items are overpriced.",
      "Quality clothing with modern designs. Good value for money.",
      "Nice collection of accessories. Clothes are comfortable to wear."
    ],
    'Health': [
      "Genuine organic products with proper certifications. Good quality.",
      "Wide range of health supplements. Staff provides good advice.",
      "Authentic products with clear expiry dates. Prices are reasonable.",
      "Good variety of organic and natural products. Quality is excellent.",
      "Knowledgeable staff who suggest appropriate products. Good prices.",
      "Fresh organic produce and supplements. Packaging is proper.",
      "Reliable source for health products. Good customer service."
    ],
    'General': [
      "Convenient store with all daily necessities. Good variety of items.",
      "Reasonable prices and good variety. Staff is helpful and friendly.",
      "Good stock of household items. Convenient location and hours.",
      "Wide range of products available. Prices are competitive.",
      "Helpful staff and good customer service. Items are well-organized.",
      "Good variety of brands available. Convenient for quick shopping.",
      "Essential items always in stock. Good value for basic necessities."
    ],
    'Stationery': [
      "Good variety of books and stationery items. Quality is reliable.",
      "Wide selection of office supplies. Prices are reasonable.",
      "Good quality pens, papers and books. Helpful for students.",
      "Variety of educational and office materials. Good condition items.",
      "Competitive prices for stationery items. Good brand selection.",
      "Quality books and supplies available. Good for bulk purchases.",
      "Well-organized store with good variety. Staff is knowledgeable."
    ]
  };

  generateReviews(store: any): Review[] {
    const reviews: Review[] = [];
    const reviewCount = store.reviewCount;
    const category = store.category;
    const templates = this.reviewTemplates[category] || this.reviewTemplates['General'];
    const aspects = this.storeAspects[category] || this.storeAspects['General'];

    const names = [
      'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Gupta',
      'Anita Verma', 'Rahul Jain', 'Pooja Agarwal', 'Sanjay Mehta', 'Kavya Reddy',
      'Arjun Malhotra', 'Ritu Kapoor', 'Deepak Sharma', 'Nisha Thakur', 'Rohit Bansal',
      'Meera Singh', 'Karan Gupta', 'Shweta Joshi', 'Vivek Kumar', 'Preeti Agarwal'
    ];

    const avatars = ['👨', '👩', '👨‍💼', '👩‍💼', '🧑', '👨‍🎓', '👩‍🎓', '🧑‍💻', '👨‍🔬', '👩‍⚕️'];

    // Generate distribution based on overall rating
    const ratingDistribution = this.generateRatingDistribution(store.rating, reviewCount);

    for (let i = 0; i < reviewCount; i++) {
      const rating = this.selectRatingFromDistribution(ratingDistribution);
      const template = templates[Math.floor(Math.random() * templates.length)];
      const comment = this.generateVariedComment(template, rating, category);
      
      // Generate aspect ratings
      const aspectRatings: { [key: string]: number } = {};
      aspects.forEach(aspect => {
        // Aspect ratings generally follow overall rating but with some variation
        aspectRatings[aspect] = Math.max(1, Math.min(5, 
          rating + (Math.random() - 0.5) * 1.5
        ));
      });

      reviews.push({
        id: i + 1,
        user: names[Math.floor(Math.random() * names.length)],
        rating: rating,
        date: this.generateRandomDate(),
        comment: comment,
        helpful: Math.floor(Math.random() * 25),
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        verified: Math.random() > 0.3, // 70% verified purchases
        aspects: aspectRatings
      });
    }

    return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  generateReviewSummary(store: any, reviews: Review[]): ReviewSummary {
    const aspects = this.storeAspects[store.category] || this.storeAspects['General'];
    const aspectSummaries: { [key: string]: any } = {};

    // Calculate aspect summaries
    aspects.forEach(aspect => {
      const aspectRatings = reviews
        .filter(r => r.aspects && r.aspects[aspect])
        .map(r => r.aspects![aspect]);
      
      if (aspectRatings.length > 0) {
        const avgRating = aspectRatings.reduce((a, b) => a + b, 0) / aspectRatings.length;
        aspectSummaries[aspect] = {
          rating: Math.round(avgRating * 10) / 10,
          sentiment: avgRating >= 4 ? 'positive' : avgRating >= 3 ? 'neutral' : 'negative',
          mentions: aspectRatings.length,
          summary: this.generateAspectSummary(aspect, avgRating, store.category)
        };
      }
    });

    // Calculate rating distribution
    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });

    const aiSummary = this.generateAISummary(store, reviews, aspectSummaries);
    const highlights = this.extractHighlights(reviews, aspectSummaries);
    const concerns = this.extractConcerns(reviews, aspectSummaries);

    return {
      overall: {
        averageRating: store.rating,
        totalReviews: reviews.length,
        distribution
      },
      aspects: aspectSummaries,
      aiSummary,
      highlights,
      concerns
    };
  }

  private generateRatingDistribution(avgRating: number, totalReviews: number): { [key: number]: number } {
    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    // Generate realistic distribution based on average
    if (avgRating >= 4.5) {
      distribution[5] = Math.floor(totalReviews * 0.6);
      distribution[4] = Math.floor(totalReviews * 0.3);
      distribution[3] = Math.floor(totalReviews * 0.08);
      distribution[2] = Math.floor(totalReviews * 0.02);
    } else if (avgRating >= 4.0) {
      distribution[5] = Math.floor(totalReviews * 0.4);
      distribution[4] = Math.floor(totalReviews * 0.4);
      distribution[3] = Math.floor(totalReviews * 0.15);
      distribution[2] = Math.floor(totalReviews * 0.05);
    } else if (avgRating >= 3.5) {
      distribution[5] = Math.floor(totalReviews * 0.25);
      distribution[4] = Math.floor(totalReviews * 0.35);
      distribution[3] = Math.floor(totalReviews * 0.25);
      distribution[2] = Math.floor(totalReviews * 0.15);
    }

    // Ensure total adds up
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    if (total < totalReviews) {
      distribution[Math.round(avgRating)] += totalReviews - total;
    }

    return distribution;
  }

  private selectRatingFromDistribution(distribution: { [key: number]: number }): number {
    const ratings: number[] = [];
    Object.entries(distribution).forEach(([rating, count]) => {
      for (let i = 0; i < count; i++) {
        ratings.push(parseInt(rating));
      }
    });
    return ratings[Math.floor(Math.random() * ratings.length)] || 4;
  }

  private generateVariedComment(template: string, rating: number, category: string): string {
    let comment = template;
    
    // Add rating-specific modifications
    if (rating >= 5) {
      const positive = ["Excellent", "Outstanding", "Perfect", "Amazing", "Fantastic"];
      comment = positive[Math.floor(Math.random() * positive.length)] + " " + comment.toLowerCase();
    } else if (rating <= 2) {
      const negative = ["Disappointing", "Poor quality", "Not satisfied", "Could be better"];
      comment = negative[Math.floor(Math.random() * negative.length)] + ". " + comment;
    }

    // Add specific details based on category
    const specificDetails = {
      'Groceries': [" Fresh items delivered on time.", " Good packaging and quality.", " Wide variety available."],
      'Pharmacy': [" Medicines are genuine.", " Quick home delivery.", " Professional service."],
      'Bakery': [" Cakes are beautifully decorated.", " Fresh baked daily.", " Custom orders handled well."],
      'Café': [" Great ambiance for meetings.", " Coffee quality is excellent.", " Good WiFi connectivity."]
    };

    if (specificDetails[category] && Math.random() > 0.5) {
      const details = specificDetails[category];
      comment += details[Math.floor(Math.random() * details.length)];
    }

    return comment;
  }

  private generateRandomDate(): string {
    const days = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return date.toLocaleDateString();
  }

  private generateAspectSummary(aspect: string, rating: number, category: string): string {
    const aspectDescriptions = {
      'freshness': rating >= 4 ? 'Customers consistently praise the freshness of products' : 'Some concerns about product freshness',
      'variety': rating >= 4 ? 'Wide selection appreciated by customers' : 'Limited variety mentioned in reviews',
      'price': rating >= 4 ? 'Competitive pricing and good value for money' : 'Some customers find prices higher than expected',
      'quality': rating >= 4 ? 'High quality products that meet expectations' : 'Quality concerns raised by some customers',
      'delivery': rating >= 4 ? 'Fast and reliable delivery service' : 'Delivery timing could be improved',
      'service': rating >= 4 ? 'Excellent customer service and helpful staff' : 'Customer service needs improvement',
      'taste': rating >= 4 ? 'Delicious taste that customers love' : 'Taste could be better according to some reviews',
      'ambiance': rating >= 4 ? 'Pleasant and comfortable atmosphere' : 'Ambiance could be more welcoming'
    };

    return aspectDescriptions[aspect] || `${rating >= 4 ? 'Positive' : 'Mixed'} customer feedback on ${aspect}`;
  }

  private generateAISummary(store: any, reviews: Review[], aspects: any): string {
    const category = store.category;
    const avgRating = store.rating;
    const positiveAspects = Object.entries(aspects)
      .filter(([_, data]: [string, any]) => data.sentiment === 'positive')
      .map(([aspect, _]) => aspect);
    
    const negativeAspects = Object.entries(aspects)
      .filter(([_, data]: [string, any]) => data.sentiment === 'negative')
      .map(([aspect, _]) => aspect);

    let summary = `Based on ${reviews.length} customer reviews, ${store.name} has earned a ${avgRating}-star rating. `;

    if (avgRating >= 4.5) {
      summary += "Customers are highly satisfied with their experience. ";
    } else if (avgRating >= 4.0) {
      summary += "Most customers have positive experiences. ";
    } else {
      summary += "Customer experiences are mixed. ";
    }

    if (positiveAspects.length > 0) {
      summary += `Customers particularly appreciate the ${positiveAspects.slice(0, 2).join(' and ')}. `;
    }

    if (negativeAspects.length > 0) {
      summary += `Some areas for improvement include ${negativeAspects.slice(0, 2).join(' and ')}. `;
    }

    // Add category-specific insights
    const categoryInsights = {
      'Groceries': 'The store is recommended for daily grocery needs with emphasis on fresh produce.',
      'Pharmacy': 'Reliable for medicine needs with good availability and professional service.',
      'Bakery': 'Popular for fresh baked goods and custom cake orders.',
      'Café': 'Good choice for casual dining and meetings with decent coffee.',
      'Electronics': 'Trusted for electronic purchases with competitive pricing.',
    };

    summary += categoryInsights[category] || 'Good choice for your shopping needs.';

    return summary;
  }

  private extractHighlights(reviews: Review[], aspects: any): string[] {
    const highlights: string[] = [];
    
    // Extract top positive aspects
    const topAspects = Object.entries(aspects)
      .filter(([_, data]: [string, any]) => data.sentiment === 'positive')
      .sort(([_, a]: [string, any], [__, b]: [string, any]) => b.rating - a.rating)
      .slice(0, 3);

    topAspects.forEach(([aspect, data]: [string, any]) => {
      highlights.push(`Excellent ${aspect.replace('_', ' ')} (${data.rating}/5)`);
    });

    // Add specific highlights based on high ratings
    const highRatedReviews = reviews.filter(r => r.rating >= 5);
    if (highRatedReviews.length > reviews.length * 0.5) {
      highlights.push("Over 50% customers gave 5-star ratings");
    }

    return highlights.slice(0, 4);
  }

  private extractConcerns(reviews: Review[], aspects: any): string[] {
    const concerns: string[] = [];
    
    // Extract negative aspects
    const negativeAspects = Object.entries(aspects)
      .filter(([_, data]: [string, any]) => data.sentiment === 'negative')
      .sort(([_, a]: [string, any], [__, b]: [string, any]) => a.rating - b.rating)
      .slice(0, 2);

    negativeAspects.forEach(([aspect, data]: [string, any]) => {
      concerns.push(`${aspect.replace('_', ' ').charAt(0).toUpperCase() + aspect.slice(1)} needs improvement (${data.rating}/5)`);
    });

    // Add delivery or service concerns if ratings are low
    const lowRatedReviews = reviews.filter(r => r.rating <= 2);
    if (lowRatedReviews.length > reviews.length * 0.1) {
      concerns.push("Some customers reported service issues");
    }

    return concerns.slice(0, 3);
  }
}

export const reviewService = new ReviewService();
export type { Review, ReviewSummary };