import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  const [userName, setUserName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');

  useEffect(() => {
    // Function to update user data
    const updateUserData = () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      // Only set user name if both token and user data exist
      if (userData && token) {
        try {
          const user = JSON.parse(userData);
          // Extract first name from full name
          const firstName = user.name ? user.name.split(' ')[0] : '';
          setUserName(firstName);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUserName('');
        }
      } else {
        // Clear user name if no token or user data
        setUserName('');
      }
    };

    // Initial load
    updateUserData();

    // Get selected location
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }

    // Listen for location changes from Navigation component
    const handleLocationChange = (event) => {
      setSelectedLocation(event.detail);
    };

    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      updateUserData();
    };

    // Listen for storage changes (for logout/login detection)
    const handleStorageChange = (event) => {
      if (event.key === 'user' || event.key === 'token') {
        updateUserData();
      }
      if (event.key === 'selectedLocation') {
        setSelectedLocation(event.newValue || 'Mumbai');
      }
    };

    // Add event listeners
    window.addEventListener('locationChanged', handleLocationChange);
    window.addEventListener('authChanged', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('locationChanged', handleLocationChange);
      window.removeEventListener('authChanged', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-secondary rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-accent rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{selectedLocation}</span>
                <Clock className="h-4 w-4 ml-4" />
                <span>Most shops close by 9 PM</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {userName ? (
                  <>
                    <span className="text-foreground">{getGreeting()}, </span>
                    <span className="bg-gradient-primary bg-clip-text text-transparent">{userName}!</span>
                  </>
                ) : (
                  <>
                    <span className="text-foreground">Welcome to </span>
                    <span className="bg-gradient-primary bg-clip-text text-transparent">Nukkad!</span>
                  </>
                )}
                <br />
                <span className="text-foreground">Get essentials from</span>
                <br />
                <span className="text-purple">nearby shops</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {userName ? (
                  `Discover local stores around you in ${selectedLocation}. Fresh groceries, daily essentials, and more - delivered from your neighborhood shops.`
                ) : (
                  'Discover local stores around you. Fresh groceries, daily essentials, and more - delivered from your neighborhood shops.'
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:scale-105 transition-smooth group" asChild>
                <Link to={userName ? "/stores" : "/login"}>
                  {userName ? "Start Shopping" : "Sign In to Shop"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-accent transition-smooth" asChild>
                <Link to="/deals">View All Deals</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Local Stores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1000+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple">15min</div>
                <div className="text-sm text-muted-foreground">Avg Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-slide-in-right">
            <div className="relative w-full h-96 lg:h-[500px]">
              {/* Main Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl transform rotate-3 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-secondary rounded-3xl transform -rotate-2 opacity-30"></div>
              <div className="absolute inset-0 bg-card rounded-3xl shadow-floating flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-primary-foreground">🏪</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Local Shopping</h3>
                  <p className="text-muted-foreground">
                    {userName ? 
                      `Connect with neighborhood stores in ${selectedLocation}` : 
                      'Connect with neighborhood stores'
                    }
                  </p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center animate-bounce shadow-lg">
                <span className="text-xl">🛒</span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse-glow shadow-lg">
                <span className="text-2xl">📱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};