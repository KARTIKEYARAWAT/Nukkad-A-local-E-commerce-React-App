import { useState } from 'react';
import { 
  X, Phone, MapPin, Clock, Copy, MessageCircle, 
  Mail, Globe, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ContactModal = ({ store, isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleCall = () => {
    if (store?.phone) {
      window.open(`tel:${store.phone}`, '_self');
    }
  };

  const handleSMS = () => {
    if (store?.phone) {
      window.open(`sms:${store.phone}`, '_self');
    }
  };

  const handleWhatsApp = () => {
    if (store?.phone) {
      // Remove spaces and special characters from phone number
      const cleanPhone = store.phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
      const message = encodeURIComponent(`Hi! I found your store "${store.name}" on Nukkad. I'd like to know more about your products.`);
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    }
  };

  if (!store) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <span className="text-xl">{store.image}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{store.name}</h3>
                <p className="text-sm text-muted-foreground">{store.category}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Phone Section */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center">
              <Phone className="h-5 w-5 mr-2 text-primary" />
              Contact Details
            </h4>
            
            {/* Phone Number */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium text-lg">{store.phone}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(store.phone, 'phone')}
                  className="h-8 w-8 p-0"
                >
                  {copiedField === 'phone' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={handleCall}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button 
                  onClick={handleSMS}
                  variant="outline"
                  size="sm"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  SMS
                </Button>
                <Button 
                  onClick={handleWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  💬 WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Address
            </h4>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{store.address}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    📍 {store.distance} away from you
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(store.address, 'address')}
                  className="h-8 w-8 p-0"
                >
                  {copiedField === 'address' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Store Hours */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Store Hours
            </h4>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="font-medium">7:00 AM - 10:00 PM</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${store.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${store.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {store.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {store.isOpen ? `Closes ${store.closesAt}` : store.closesAt}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Quick Info</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Delivery Time:</span>
                <span className="font-medium text-blue-900">{store.deliveryTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Rating:</span>
                <span className="font-medium text-blue-900">⭐ {store.rating} ({store.reviewCount} reviews)</span>
              </div>
              {store.hasOffers && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Special Offers:</span>
                  <span className="font-medium text-green-600">🎉 Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Copy Success Message */}
          {copiedField && (
            <div className="text-center text-sm text-green-600 font-medium">
              ✅ {copiedField === 'phone' ? 'Phone number' : 'Address'} copied to clipboard!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;