import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  company: [
    { name: 'About Nukkad', href: '/about' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' }
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Order Tracking', href: '/track' },
    { name: 'Returns', href: '/returns' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Refund Policy', href: '/refunds' }
  ]
};

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-gradient-primary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Stay updated with local deals
            </h3>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Get notified about exclusive offers from stores in your neighborhood
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/70"
              />
              <Button className="bg-white text-primary hover:bg-white/90 font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg">
                  N
                </div>
                <span className="text-2xl font-bold text-foreground">Nukkad</span>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Connecting neighborhoods through local commerce. 
                Discover, shop, and support local businesses in your area.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Koramangala, Bangalore, India</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>hello@nukkad.com</span>
                </div>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social & Bottom */}
          <div className="border-t border-border mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 text-muted-foreground mb-4 md:mb-0">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-primary fill-primary" />
                <span>for local communities</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">Follow us:</span>
                <div className="flex space-x-3">
                  <Button size="sm" variant="ghost" className="p-2">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-2">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-2">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8 pt-8 border-t border-border">
              <p className="text-muted-foreground">
                © 2024 Nukkad. All rights reserved. Empowering local commerce, one neighborhood at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};