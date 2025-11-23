const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from server directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Deal = require('../models/Deal');

// Cities data
const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 
  'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow'
];

// Base deals template
const baseDealTemplates = [
  {
    title: "Fresh Vegetables Bundle",
    description: "Fresh tomatoes, onions, potatoes, carrots, and seasonal vegetables",
    store: "Green Mart",
    category: "Groceries",
    originalPrice: 299,
    discountPrice: 199,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 128,
    fastDelivery: true,
    featured: true,
    tags: ["fresh", "organic", "vegetables"]
  },
  {
    title: "Artisan Bread & Pastries",
    description: "Freshly baked bread, croissants, and assorted pastries",
    store: "Baker's Corner",
    category: "Bakery",
    originalPrice: 450,
    discountPrice: 299,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 95,
    fastDelivery: false,
    featured: true,
    tags: ["fresh", "baked", "artisan"]
  },
  {
    title: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation",
    store: "Tech Hub",
    category: "Electronics",
    originalPrice: 2999,
    discountPrice: 1999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    rating: 4.3,
    reviewCount: 67,
    fastDelivery: true,
    featured: false,
    tags: ["wireless", "audio", "electronics"]
  },
  {
    title: "Winter Jacket Collection",
    description: "Stylish winter jackets for men and women",
    store: "Style Studio",
    category: "Fashion",
    originalPrice: 1599,
    discountPrice: 999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 203,
    fastDelivery: false,
    featured: true,
    tags: ["winter", "fashion", "clothing"]
  },
  {
    title: "Home Decor Items",
    description: "Beautiful decorative items for your home",
    store: "Decor Dreams",
    category: "Home",
    originalPrice: 899,
    discountPrice: 599,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 89,
    fastDelivery: true,
    featured: false,
    tags: ["decor", "home", "interior"]
  },
  {
    title: "Organic Health Foods",
    description: "Organic supplements and health foods",
    store: "Wellness Store",
    category: "Health",
    originalPrice: 799,
    discountPrice: 499,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    fastDelivery: true,
    featured: true,
    tags: ["organic", "health", "supplements"]
  },
  {
    title: "Premium Coffee Beans",
    description: "100% Arabica coffee beans, freshly roasted",
    store: "Coffee Corner",
    category: "Café",
    originalPrice: 599,
    discountPrice: 399,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 134,
    fastDelivery: true,
    featured: false,
    tags: ["coffee", "arabica", "premium"]
  },
  {
    title: "Pain Relief Medicine",
    description: "Effective pain relief tablets and ointments",
    store: "HealthPlus Pharmacy",
    category: "Pharmacy",
    originalPrice: 150,
    discountPrice: 120,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop",
    rating: 4.2,
    reviewCount: 45,
    fastDelivery: false,
    featured: false,
    tags: ["medicine", "pain relief", "pharmacy"]
  },
  {
    title: "Notebook & Stationery Set",
    description: "Quality notebooks, pens, and office supplies",
    store: "Paper World",
    category: "Stationery",
    originalPrice: 299,
    discountPrice: 199,
    image: "https://images.unsplash.com/photo-1544716278-e513176f20a5?w=400&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 67,
    fastDelivery: true,
    featured: false,
    tags: ["stationery", "notebooks", "office"]
  },
  {
    title: "Skincare Essential Kit",
    description: "Complete skincare routine with cleanser, toner, and moisturizer",
    store: "Beauty Corner",
    category: "Personal Care",
    originalPrice: 1299,
    discountPrice: 899,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 189,
    fastDelivery: true,
    featured: true,
    tags: ["skincare", "beauty", "routine"]
  },
  {
    title: "Sports Equipment Bundle",
    description: "Badminton rackets, shuttlecocks, and sports accessories",
    store: "Sports Zone",
    category: "Sports",
    originalPrice: 1899,
    discountPrice: 1299,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    rating: 4.3,
    reviewCount: 78,
    fastDelivery: false,
    featured: false,
    tags: ["sports", "badminton", "equipment"]
  },
  {
    title: "Children's Book Collection",
    description: "Educational and story books for children aged 5-12",
    store: "Book Haven",
    category: "Books",
    originalPrice: 799,
    discountPrice: 499,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 123,
    fastDelivery: true,
    featured: false,
    tags: ["books", "children", "education"]
  },
  {
    title: "Educational Toy Set",
    description: "STEM learning toys for kids aged 6-10",
    store: "Toy Kingdom",
    category: "Toys",
    originalPrice: 1599,
    discountPrice: 999,
    image: "https://images.unsplash.com/photo-1558877385-17fcc2d7b499?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 94,
    fastDelivery: true,
    featured: true,
    tags: ["toys", "educational", "STEM"]
  },
  {
    title: "Makeup Starter Kit",
    description: "Essential makeup items for beginners",
    store: "Beauty Palace",
    category: "Beauty",
    originalPrice: 2199,
    discountPrice: 1599,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 167,
    fastDelivery: false,
    featured: false,
    tags: ["makeup", "beauty", "starter kit"]
  },
  {
    title: "Organic Fruits Basket",
    description: "Fresh seasonal fruits including apples, oranges, bananas",
    store: "Fresh Fruits Co",
    category: "Groceries",
    originalPrice: 599,
    discountPrice: 399,
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 201,
    fastDelivery: true,
    featured: true,
    tags: ["fruits", "organic", "fresh"]
  },
  {
    title: "Designer Handbags",
    description: "Stylish handbags for women in various colors",
    store: "Fashion Hub",
    category: "Fashion",
    originalPrice: 2499,
    discountPrice: 1799,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    rating: 4.2,
    reviewCount: 85,
    fastDelivery: false,
    featured: false,
    tags: ["handbags", "fashion", "designer"]
  },
  {
    title: "Kitchen Appliance Set",
    description: "Essential kitchen appliances including blender and toaster",
    store: "Home Essentials",
    category: "Home",
    originalPrice: 3499,
    discountPrice: 2499,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 112,
    fastDelivery: true,
    featured: true,
    tags: ["kitchen", "appliances", "home"]
  },
  {
    title: "Vitamin Supplements",
    description: "Essential vitamins and minerals for daily health",
    store: "Health Store",
    category: "Health",
    originalPrice: 999,
    discountPrice: 699,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 143,
    fastDelivery: true,
    featured: false,
    tags: ["vitamins", "supplements", "health"]
  },
  {
    title: "Gourmet Tea Collection",
    description: "Premium tea varieties from around the world",
    store: "Tea Garden",
    category: "Café",
    originalPrice: 799,
    discountPrice: 549,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 76,
    fastDelivery: false,
    featured: false,
    tags: ["tea", "gourmet", "premium"]
  },
  {
    title: "Cold & Flu Medicine",
    description: "Complete cold and flu relief medicine kit",
    store: "MediCare Pharmacy",
    category: "Pharmacy",
    originalPrice: 299,
    discountPrice: 199,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    rating: 4.3,
    reviewCount: 58,
    fastDelivery: true,
    featured: false,
    tags: ["medicine", "cold", "flu"]
  }
];

// Function to generate random variations
const getRandomVariation = (base, max) => {
  const variation = Math.random() * 0.4 - 0.2; // -20% to +20%
  return Math.max(base + (base * variation), max * 0.1);
};

const getRandomDistance = () => {
  return Math.round((Math.random() * 4.5 + 0.5) * 10) / 10; // 0.5 to 5.0 km
};

const getRandomEndTime = () => {
  const hours = Math.floor(Math.random() * 120) + 4; // 4 to 124 hours from now
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

// City-specific store variations
const cityStoreVariations = {
  'Mumbai': ['Local Mart', 'Mumbai Fresh', 'Gateway Store', 'Marine Drive Shop'],
  'Delhi': ['Delhi Bazaar', 'Capital Store', 'Red Fort Market', 'Connaught Hub'],
  'Bangalore': ['Garden City Store', 'Silicon Valley Shop', 'Bengaluru Fresh', 'IT Park Mart'],
  'Hyderabad': ['Nizam Store', 'Charminar Market', 'Hitec City Shop', 'Pearls Plaza'],
  'Ahmedabad': ['Gujarat Mart', 'Sabarmati Store', 'Heritage Shop', 'Textile Hub'],
  'Chennai': ['Marina Store', 'Chennai Express', 'Tamil Fresh', 'Beach Road Shop'],
  'Kolkata': ['Kolkata Bazaar', 'Howrah Store', 'Cultural Hub', 'Metro Market'],
  'Pune': ['Pune Fresh', 'IT City Store', 'Oxford Shop', 'Deccan Market'],
  'Jaipur': ['Pink City Store', 'Rajasthani Mart', 'Palace Market', 'Heritage Shop'],
  'Lucknow': ['Nawab Store', 'Lucknow Fresh', 'Gomti Market', 'Heritage Hub']
};

// Generate deals for all cities
const generateDealsForAllCities = () => {
  const allDeals = [];
  
  cities.forEach(city => {
    console.log(`🏙️  Generating deals for ${city}...`);
    
    // Generate 15-25 deals per city
    const dealsCount = Math.floor(Math.random() * 11) + 15; // 15-25 deals
    
    for (let i = 0; i < dealsCount; i++) {
      const template = baseDealTemplates[i % baseDealTemplates.length];
      const cityStores = cityStoreVariations[city] || [template.store];
      
      // Create variations for each deal
      const deal = {
        ...template,
        // Vary the store name for city context
        store: Math.random() > 0.6 ? 
          cityStores[Math.floor(Math.random() * cityStores.length)] : 
          template.store,
        
        // Vary prices slightly for each city
        originalPrice: Math.round(getRandomVariation(template.originalPrice, template.originalPrice)),
        discountPrice: Math.round(getRandomVariation(template.discountPrice, template.discountPrice)),
        
        // Vary ratings and reviews
        rating: Math.round((getRandomVariation(template.rating, 1) * 10)) / 10,
        reviewCount: Math.round(getRandomVariation(template.reviewCount, 10)),
        
        // Random distance
        distance: getRandomDistance(),
        
        // Set location
        location: city,
        
        // Random end time
        endTime: getRandomEndTime(),
        
        // Random stock status (95% in stock)
        inStock: Math.random() > 0.05,
        
        // Vary featured status (30% chance to be featured)
        featured: Math.random() > 0.7,
        
        // Vary fast delivery (60% chance)
        fastDelivery: Math.random() > 0.4,
        
        // Add some city-specific tags
        tags: [
          ...template.tags,
          ...(Math.random() > 0.5 ? [city.toLowerCase()] : [])
        ]
      };
      
      // Ensure discount price is less than original price
      if (deal.discountPrice >= deal.originalPrice) {
        deal.discountPrice = Math.round(deal.originalPrice * 0.7);
      }
      
      allDeals.push(deal);
    }
  });
  
  return allDeals;
};

const seedDeals = async () => {
  try {
    console.log('🚀 Starting multi-city deal seeding process...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nukkad';
    console.log(`📡 Connecting to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing deals
    const deleteResult = await Deal.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing deals`);

    // Generate deals for all cities
    console.log('🏗️  Generating deals for all cities...');
    const allDeals = generateDealsForAllCities();
    
    console.log(`📊 Generated ${allDeals.length} deals across ${cities.length} cities`);
    
    // Show distribution
    cities.forEach(city => {
      const cityDeals = allDeals.filter(deal => deal.location === city);
      const featuredCount = cityDeals.filter(deal => deal.featured).length;
      console.log(`   ${city}: ${cityDeals.length} deals (${featuredCount} featured)`);
    });

    // Insert deals in batches for better performance
    console.log('📝 Inserting deals in batches...');
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < allDeals.length; i += batchSize) {
      const batch = allDeals.slice(i, i + batchSize);
      
      try {
        const insertedBatch = await Deal.insertMany(batch, { 
          ordered: false // Continue inserting even if some fail
        });
        insertedCount += insertedBatch.length;
        console.log(`   ✅ Inserted batch ${Math.floor(i/batchSize) + 1}: ${insertedBatch.length} deals`);
      } catch (error) {
        console.error(`   ❌ Error in batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        if (error.insertedDocs) {
          insertedCount += error.insertedDocs.length;
        }
      }
    }
    
    console.log(`🎉 Successfully inserted ${insertedCount} deals out of ${allDeals.length}`);
    
    // Verify the insertion
    const totalDeals = await Deal.countDocuments();
    console.log(`📊 Total deals in database: ${totalDeals}`);
    
    // Show city-wise distribution in database
    console.log('\n📍 Final distribution by city:');
    for (const city of cities) {
      const count = await Deal.countDocuments({ location: city });
      const featuredCount = await Deal.countDocuments({ location: city, featured: true });
      const activeCount = await Deal.countDocuments({ 
        location: city, 
        endTime: { $gt: new Date() }, 
        inStock: true 
      });
      console.log(`   ${city}: ${count} total, ${featuredCount} featured, ${activeCount} active`);
    }
    
    console.log('\n✨ Multi-city seed data insertion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    
    if (error.writeErrors) {
      console.error('💥 Write errors:');
      error.writeErrors.forEach((err, index) => {
        console.error(`   Deal ${index + 1}: ${err.errmsg}`);
      });
    }
    
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
};

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Received SIGINT. Closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

// Run the seed function
seedDeals();