const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function() {
        // Either email or phone must be provided (unless it's a Google OAuth user)
        return this.email || this.phone || this.googleId;
      },
      message: 'Either email or phone number is required'
    }
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function() {
        // Either email or phone must be provided (unless it's a Google OAuth user)
        return this.email || this.phone || this.googleId;
      },
      message: 'Either email or phone number is required'
    }
  },
  password: {
    type: String,
    minlength: 6,
    // Password is not required for Google OAuth users
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user'
  },
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' }
  }
}, {
  timestamps: true
});

// Ensure unique email and phone (when provided)
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);