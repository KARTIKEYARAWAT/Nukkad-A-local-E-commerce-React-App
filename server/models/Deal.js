const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  store: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Groceries', 'Bakery', 'Electronics', 'Fashion', 'Home', 'Health', 'Personal Care', 'Stationery', 'Café', 'Pharmacy', 'Sports', 'Books', 'Toys', 'Beauty']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Original price must be positive']
  },
  discountPrice: {
    type: Number,
    required: [true, 'Discount price is required'],
    min: [0, 'Discount price must be positive']
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  savings: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 4.0
  },
  reviewCount: {
    type: Number,
    required: [true, 'Review count is required'],
    min: [0, 'Review count cannot be negative'],
    default: 0
  },
  distance: {
    type: Number,
    required: [true, 'Distance is required'],
    min: [0, 'Distance cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    default: 'Mumbai'
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  fastDelivery: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Custom validation to ensure discount price is less than original price
dealSchema.path('discountPrice').validate(function(value) {
  return value < this.originalPrice;
}, 'Discount price must be less than original price');

// Calculate discount percentage and savings before saving
dealSchema.pre('save', function(next) {
  if (this.originalPrice && this.discountPrice) {
    // Calculate discount percentage
    this.discount = Math.round(((this.originalPrice - this.discountPrice) / this.originalPrice) * 100);
    // Calculate savings
    this.savings = this.originalPrice - this.discountPrice;
  }
  next();
});

// Also calculate on find operations (for existing data)
dealSchema.post(['find', 'findOne', 'findOneAndUpdate'], function(docs) {
  if (!docs) return;
  
  const deals = Array.isArray(docs) ? docs : [docs];
  
  deals.forEach(deal => {
    if (deal && deal.originalPrice && deal.discountPrice) {
      if (!deal.discount) {
        deal.discount = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);
      }
      if (!deal.savings) {
        deal.savings = deal.originalPrice - deal.discountPrice;
      }
    }
  });
});

// Index for better query performance
dealSchema.index({ category: 1, location: 1 });
dealSchema.index({ endTime: 1 });
dealSchema.index({ discount: -1 });
dealSchema.index({ rating: -1 });
dealSchema.index({ discountPrice: 1 });

// Virtual for checking if deal is active
dealSchema.virtual('isActive').get(function() {
  return new Date() < this.endTime;
});

module.exports = mongoose.model('Deal', dealSchema);