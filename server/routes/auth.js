const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const router = express.Router();

// Configure Google OAuth Strategy only if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth Profile:', profile);
      
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        console.log('Existing Google user found:', user.email);
        return done(null, user);
      }
      
      // Check if user exists with the same email
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        if (!user.avatar && profile.photos && profile.photos.length > 0) {
          user.avatar = profile.photos[0].value;
        }
        user.isEmailVerified = true;
        await user.save();
        console.log('Linked Google account to existing user:', user.email);
        return done(null, user);
      }
      
      // Create new user
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        isEmailVerified: true
      });
      
      await user.save();
      console.log('Created new Google user:', user.email);
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

// Helper function to determine if input is email or phone
const isEmail = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

const isPhone = (input) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(input.replace(/\D/g, ''));
};

// JWT token generation
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Google OAuth routes
router.get('/google', (req, res, next) => {
  console.log('Initiating Google OAuth...');
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('Google OAuth not configured');
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_not_configured`);
  }
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }),
  (req, res) => {
    try {
      console.log('Google OAuth callback successful:', req.user.email);
      
      const token = generateToken(req.user._id);
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        avatar: req.user.avatar
      }))}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
    }
  }
);

// Test route to check if Google OAuth is configured
router.get('/google/status', (req, res) => {
  res.json({
    configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set'
  });
});

// Signup with email/password or phone/password
router.post('/signup', async (req, res) => {
  try {
    const { name, emailOrPhone, password } = req.body;

    if (!name || !emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email/phone, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Determine if input is email or phone
    let email = null;
    let phone = null;
    
    if (isEmail(emailOrPhone)) {
      email = emailOrPhone.toLowerCase();
    } else if (isPhone(emailOrPhone)) {
      phone = emailOrPhone.replace(/\D/g, '');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address or 10-digit phone number'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'phone number';
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isEmailVerified: email ? false : true, // If phone signup, mark email as verified
      isPhoneVerified: phone ? false : true  // If email signup, mark phone as verified
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login with email/phone and password
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required'
      });
    }

    // Determine if input is email or phone
    let query = {};
    if (isEmail(emailOrPhone)) {
      query.email = emailOrPhone.toLowerCase();
    } else if (isPhone(emailOrPhone)) {
      query.phone = emailOrPhone.replace(/\D/g, '');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address or phone number'
      });
    }

    // Find user
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send signup OTP (for phone verification)
router.post('/send-signup-otp', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required'
      });
    }

    if (!isPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    const cleanPhone = phone.replace(/\D/g, '');

    // Check if user already exists
    const existingUser = await User.findOne({ phone: cleanPhone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in memory/session (in production, use Redis or database)
    req.session.signupOtp = {
      otp,
      name,
      phone: cleanPhone,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    // In production, send SMS here
    console.log(`Signup OTP for ${cleanPhone}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Send signup OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify signup OTP and create account
router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { name, phone, otp } = req.body;

    if (!name || !phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and OTP are required'
      });
    }

    const cleanPhone = phone.replace(/\D/g, '');

    // Check session OTP
    if (!req.session.signupOtp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new OTP.'
      });
    }

    const { otp: sessionOtp, name: sessionName, phone: sessionPhone, expiresAt } = req.session.signupOtp;

    if (Date.now() > expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    if (otp !== sessionOtp || name !== sessionName || cleanPhone !== sessionPhone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP or details'
      });
    }

    // Check if user already exists (double-check)
    const existingUser = await User.findOne({ phone: cleanPhone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Create user
    const user = new User({
      name,
      phone: cleanPhone,
      isPhoneVerified: true
    });

    await user.save();

    // Clear OTP from session
    delete req.session.signupOtp;

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('Verify signup OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;