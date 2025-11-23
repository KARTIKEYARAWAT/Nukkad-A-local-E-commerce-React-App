const mongoose = require('mongoose');
require('dotenv').config();
const Deal = require('../models/Deal');

const updateDiscounts = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nukkad');
    console.log('✅ Connected to MongoDB');
    
    // Find all deals that don't have discount calculated
    const deals = await Deal.find({
      $or: [
        { discount: { $exists: false } },
        { discount: null },
        { discount: 0 }
      ]
    });
    
    console.log(`🔢 Found ${deals.length} deals to update`);
    
    let updated = 0;
    
    for (const deal of deals) {
      if (deal.originalPrice && deal.discountPrice) {
        const discount = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);
        const savings = deal.originalPrice - deal.discountPrice;
        
        await Deal.findByIdAndUpdate(deal._id, {
          discount: discount,
          savings: savings
        });
        
        updated++;
        console.log(`✅ Updated ${deal.title}: ${discount}% discount`);
      }
    }
    
    console.log(`🎉 Updated ${updated} deals with discount percentages`);
    
  } catch (error) {
    console.error('❌ Error updating discounts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
};

updateDiscounts();