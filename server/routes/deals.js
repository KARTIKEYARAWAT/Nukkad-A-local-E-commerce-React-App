const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

// Get all deals with filtering
router.get('/', async (req, res) => {
  try {
    const {
      category,
      location = 'Mumbai',
      minPrice,
      maxPrice,
      minDiscount,
      search,
      sortBy = 'discount',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    console.log('📋 Deals query params:', req.query);

    // Build filter object
    const filter = {};
    
    // Location filter
    if (location && location !== 'all') {
      filter.location = { $regex: new RegExp(location, 'i') };
    }
    
    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
        { store: { $regex: new RegExp(search, 'i') } }
      ];
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.discountPrice = {};
      if (minPrice) filter.discountPrice.$gte = Number(minPrice);
      if (maxPrice) filter.discountPrice.$lte = Number(maxPrice);
    }
    
    // Discount filter
    if (minDiscount) {
      filter.discount = { $gte: Number(minDiscount) };
    }
    
    // Only active deals (not expired)
    filter.endTime = { $gt: new Date() };
    filter.inStock = true;

    console.log('🔍 Applied filter:', filter);

    // Build sort object - More explicit handling
    let sort = {};
    console.log('🔄 Sort by:', sortBy);
    
    switch (sortBy) {
      case 'discount':
        sort = { discount: -1, createdAt: -1 }; // Secondary sort by creation date
        break;
      case 'price-low':
        sort = { discountPrice: 1 };
        break;
      case 'price-high':
        sort = { discountPrice: -1 };
        break;
      case 'rating':
        sort = { rating: -1, reviewCount: -1 };
        break;
      case 'ending-soon':
        sort = { endTime: 1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { discount: -1, createdAt: -1 };
    }
    
    console.log('📊 Applied sort:', sort);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Query deals with explicit logging
    console.log('🔍 Executing query...');
    const deals = await Deal.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Log the first few results for debugging
    if (deals.length > 0) {
      console.log('🎯 First 3 results:');
      deals.slice(0, 3).forEach((deal, index) => {
        console.log(`  ${index + 1}. ${deal.title} - Discount: ${deal.discount}% - Price: ₹${deal.discountPrice}`);
      });
    }

    // Get total count for pagination
    const total = await Deal.countDocuments(filter);

    console.log(`📊 Found ${deals.length} deals out of ${total} total`);

    // Calculate pagination info
    const pages = Math.ceil(total / limit);
    const currentPage = Number(page);

    res.json({
      success: true,
      data: deals,
      pagination: {
        page: currentPage,
        limit: Number(limit),
        total,
        pages,
        hasNext: currentPage < pages,
        hasPrev: currentPage > 1
      }
    });
  } catch (error) {
    console.error('❌ Error fetching deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deals',
      error: error.message
    });
  }
});

// Get featured deals
router.get('/featured', async (req, res) => {
  try {
    const { location = 'Mumbai', limit = 6 } = req.query;
    
    console.log(`🔥 Fetching featured deals for location: ${location}, limit: ${limit}`);
    
    // Build filter for featured deals
    const filter = {
      endTime: { $gt: new Date() }, // Only active deals
      inStock: true
    };
    
    // Add location filter if provided
    if (location && location !== 'all') {
      filter.location = { $regex: new RegExp(location, 'i') };
    }
    
    console.log('🔍 Featured deals filter:', filter);
    
    // First try to get featured deals
    let deals = await Deal.find({ ...filter, featured: true })
      .sort({ discount: -1, createdAt: -1 })
      .limit(Number(limit))
      .lean();
    
    console.log(`🎯 Found ${deals.length} featured deals`);
    
    // If not enough featured deals, get more deals with high discounts
    if (deals.length < limit) {
      const additionalFilter = {
        ...filter,
        discount: { $gte: 20 } // At least 20% discount
      };
      
      // Exclude already selected deals
      if (deals.length > 0) {
        additionalFilter._id = { $nin: deals.map(deal => deal._id) };
      }
      
      const additionalDeals = await Deal.find(additionalFilter)
        .sort({ discount: -1, rating: -1 })
        .limit(Number(limit) - deals.length)
        .lean();
      
      deals = [...deals, ...additionalDeals];
      console.log(`➕ Added ${additionalDeals.length} more deals. Total: ${deals.length}`);
    }
    
    res.json({
      success: true,
      data: deals,
      count: deals.length
    });
  } catch (error) {
    console.error('❌ Error fetching featured deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured deals',
      error: error.message
    });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Deal.distinct('category');
    
    // Add "All" as the first option
    const categoriesWithAll = ['All', ...categories.sort()];
    
    res.json({
      success: true,
      data: categoriesWithAll
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Get deal by ID
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).lean();
    
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    
    res.json({
      success: true,
      data: deal
    });
  } catch (error) {
    console.error('❌ Error fetching deal:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deal',
      error: error.message
    });
  }
});

module.exports = router;
