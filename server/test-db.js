const mongoose = require('mongoose');
require('dotenv').config();
const Deal = require('./models/Deal');

const testDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nukkad');
    console.log('✅ Connected to MongoDB');
    
    // Count all deals
    const totalDeals = await Deal.countDocuments();
    console.log(`📊 Total deals in database: ${totalDeals}`);
    
    // Count active deals
    const activeDeals = await Deal.countDocuments({
      endTime: { $gt: new Date() },
      inStock: true
    });
    console.log(`🔥 Active deals: ${activeDeals}`);
    
    // Count featured deals
    const featuredDeals = await Deal.countDocuments({
      featured: true,
      endTime: { $gt: new Date() },
      inStock: true
    });
    console.log(`⭐ Featured deals: ${featuredDeals}`);
    
    // Sample deals
    const sampleDeals = await Deal.find().limit(3).lean();
    console.log('\n📋 Sample deals:');
    sampleDeals.forEach((deal, index) => {
      console.log(`${index + 1}. ${deal.title} - ${deal.category} - Featured: ${deal.featured} - Expires: ${deal.endTime}`);
    });
    
    // Test the specific query used by featured endpoint
    console.log('\n🔍 Testing featured deals query...');
    const featuredQuery = {
      featured: true,
      endTime: { $gt: new Date() },
      inStock: true,
      location: { $regex: new RegExp('Mumbai', 'i') }
    };
    
    const testFeatured = await Deal.find(featuredQuery).limit(6).lean();
    console.log(`🎯 Featured deals query result: ${testFeatured.length} deals`);
    
    if (testFeatured.length === 0) {
      console.log('⚠️  No featured deals found. Trying alternative query...');
      
      const altQuery = {
        endTime: { $gt: new Date() },
        inStock: true,
        location: { $regex: new RegExp('Mumbai', 'i') }
      };
      
      const altResults = await Deal.find(altQuery).limit(6).lean();
      console.log(`🔄 Alternative query result: ${altResults.length} deals`);
      
      if (altResults.length > 0) {
        console.log('💡 Found deals! The issue might be that no deals are marked as featured.');
        console.log('First deal details:', {
          title: altResults[0].title,
          featured: altResults[0].featured,
          inStock: altResults[0].inStock,
          endTime: altResults[0].endTime,
          location: altResults[0].location
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
};

testDatabase();