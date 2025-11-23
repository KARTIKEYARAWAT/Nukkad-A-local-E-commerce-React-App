import { Heart, ShoppingBag, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const recommendations = [
  {
    id: 1,
    title: "Your usual morning coffee",
    store: "Green Café",
    item: "Masala Chai + Biscuits",
    price: "₹45",
    lastOrdered: "2 days ago",
    image: "☕",
    rating: 4.8,
    quickAdd: true
  },
  {
    id: 2,
    title: "Weekly grocery essentials",
    store: "Fresh Market",
    item: "Milk, Bread, Eggs Bundle",
    price: "₹180",
    lastOrdered: "5 days ago",
    image: "🥛",
    rating: 4.9,
    quickAdd: true
  },
  {
    id: 3,
    title: "Your favorite snacks",
    store: "Corner Store",
    item: "Chips & Namkeen Pack",
    price: "₹120",
    lastOrdered: "1 week ago",
    image: "🍿",
    rating: 4.6,
    quickAdd: false
  }
];

const recentStores = [
  { name: "Fresh Market", category: "Groceries", lastVisit: "Yesterday", emoji: "🥬" },
  { name: "Sweet Delights", category: "Bakery", lastVisit: "3 days ago", emoji: "🧁" },
  { name: "MedPlus", category: "Pharmacy", lastVisit: "1 week ago", emoji: "💊" }
];

export const RecommendationsSection = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* For You Section */}
          <div className="fade-in-up">
            <div className="flex items-center space-x-2 mb-8">
              <Heart className="h-6 w-6 text-muted-foreground/60" />
              <h2 className="text-3xl font-bold">
                <span className="text-foreground">For </span>
                <span className="bg-gradient-primary bg-clip-text text-transparent">You</span>
              </h2>
            </div>
            
            <p className="text-muted-foreground mb-8">
              Based on your shopping habits and preferences
            </p>

            <div className="space-y-6">
              {recommendations.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl p-6 shadow-card hover:shadow-floating transition-smooth card-3d animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-secondary-light rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">{item.image}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.store}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">{item.price}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-muted-foreground/50 text-muted-foreground/50" />
                            <span className="text-xs text-muted-foreground">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground mb-3">{item.item}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 text-muted-foreground/60" />
                          <span>Last ordered {item.lastOrdered}</span>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className={item.quickAdd ? "bg-gradient-primary" : ""}
                          variant={item.quickAdd ? "default" : "outline"}
                        >
                          {item.quickAdd ? "Quick Add" : "View Item"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="fade-in-up">
            <div className="flex items-center space-x-2 mb-8">
              <ShoppingBag className="h-6 w-6 text-muted-foreground/60" />
              <h2 className="text-3xl font-bold">
                <span className="text-foreground">Recent </span>
                <span className="bg-gradient-primary bg-clip-text text-transparent">Activity</span>
              </h2>
            </div>
            
            <p className="text-muted-foreground mb-8">
              Your recently visited stores and favorite picks
            </p>

            {/* Recent Stores */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-foreground mb-4">Recently Visited</h3>
              {recentStores.map((store, index) => (
                <div
                  key={store.name}
                  className="bg-card rounded-xl p-4 shadow-card hover:shadow-lg transition-smooth cursor-pointer animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-accent-light rounded-xl flex items-center justify-center">
                        <span className="text-lg">{store.emoji}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{store.name}</h4>
                        <p className="text-sm text-muted-foreground">{store.category}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{store.lastVisit}</p>
                      <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                        Visit Again
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-accent rounded-2xl p-6 text-accent-foreground">
              <h3 className="font-bold text-lg mb-4">Your Shopping Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">₹1,240</div>
                  <div className="text-sm opacity-90">This month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm opacity-90">Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">₹180</div>
                  <div className="text-sm opacity-90">Avg order</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm opacity-90">Fav stores</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};