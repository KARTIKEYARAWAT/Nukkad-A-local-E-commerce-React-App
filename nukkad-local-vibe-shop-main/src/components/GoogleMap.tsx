import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleMapProps {
  address: string;
  storeName: string;
  lat?: number;
  lng?: number;
  phone?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const GoogleMap = ({ address, storeName, lat = 28.5355, lng = 77.3910, phone }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initializeMap;
    script.onload = () => {
      setIsLoaded(true);
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapOptions = {
      center: { lat, lng },
      zoom: 16,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          "featureType": "all",
          "elementType": "geometry.fill",
          "stylers": [{"weight": "2.00"}]
        },
        {
          "featureType": "all",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#9c9c9c"}]
        },
        {
          "featureType": "all",
          "elementType": "labels.text",
          "stylers": [{"visibility": "on"}]
        },
        {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [{"color": "#f2f2f2"}]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#ffffff"}]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#ffffff"}]
        },
        {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "road",
          "elementType": "all",
          "stylers": [{"saturation": -100}, {"lightness": 45}]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#eeeeee"}]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#7b7b7b"}]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [{"color": "#ffffff"}]
        },
        {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [{"visibility": "simplified"}]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#c8d7d4"}]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#070707"}]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [{"color": "#ffffff"}]
        }
      ]
    };

    const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(googleMap);

    // Add marker for store
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: googleMap,
      title: storeName,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="4"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20)
      }
    });

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${storeName}</h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${address}</p>
          ${phone ? `<p style="margin: 0; color: #3b82f6; font-size: 14px;">📞 ${phone}</p>` : ''}
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(googleMap, marker);
    });

    // Open info window by default
    setTimeout(() => {
      infoWindow.open(googleMap, marker);
    }, 500);
  };

  const handleGetDirections = () => {
    const destination = encodeURIComponent(`${lat},${lng}`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleOpenInMaps = () => {
    const destination = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${destination}`;
    window.open(url, '_blank');
  };

  const handleCallStore = () => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  if (!isLoaded && !window.google) {
    return (
      <div className="w-full h-64 bg-muted/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg border border-border"
          style={{ minHeight: '256px' }}
        />
        
        {/* Map overlay with store info */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-xs">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{storeName}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{address}</p>
              {phone && (
                <p className="text-xs text-primary font-medium mt-1">{phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={handleGetDirections}
          className="bg-gradient-primary"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Get Directions
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleOpenInMaps}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Maps
        </Button>
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-2 gap-3">
        {phone && (
          <Button 
            variant="outline"
            onClick={handleCallStore}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Store
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: storeName,
                text: `Check out ${storeName} on Nukkad`,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(`${storeName} - ${address}`);
            }
          }}
        >
          📱 Share Location
        </Button>
      </div>
    </div>
  );
};