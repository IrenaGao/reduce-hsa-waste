'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  provider: string;
  rating: number;
  image: string;
  hsaEligible: boolean;
  conditions: string[];
  location: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface GoogleMapProps {
  services: Service[];
  onServiceClick?: (service: Service) => void;
  selectedServiceId?: string;
}

const MapComponent: React.FC<{
  services: Service[];
  onServiceClick?: (service: Service) => void;
  selectedServiceId?: string;
}> = ({ services, onServiceClick, selectedServiceId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (ref.current && !map && window.google && window.google.maps) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: { lat: 40.7589, lng: -73.9851 }, // NYC center
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_TOP,
        },
      });
      setMap(newMap);
    }
  }, [ref, map]);

  useEffect(() => {
    if (map && services && window.google && window.google.maps) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));

      const newMarkers = services.map(service => {
        const marker = new window.google.maps.Marker({
          position: service.coordinates,
          map: map,
          title: service.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: service.id === selectedServiceId ? 12 : 8,
            fillColor: getMarkerColor(service.category),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          animation: service.id === selectedServiceId ? window.google.maps.Animation.BOUNCE : undefined,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                ${service.name}
              </h3>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
                ${service.provider}
              </p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #9ca3af;">
                ${service.address}
              </p>
              <div style="margin: 8px 0; display: flex; align-items: center; gap: 4px;">
                <span style="color: #fbbf24;">★</span>
                <span style="font-size: 14px; color: #374151;">${service.rating}</span>
                <span style="margin-left: 8px; font-size: 14px; font-weight: 600; color: #059669;">
                  $${service.price}
                </span>
              </div>
              <div style="margin: 8px 0;">
                <span style="display: inline-block; padding: 2px 8px; background-color: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 12px;">
                  ${service.category}
                </span>
              </div>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280; line-height: 1.4;">
                ${service.description.substring(0, 100)}...
              </p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          // Close all other info windows
          markers.forEach(m => {
            const infoWindow = (m as any).infoWindow;
            if (infoWindow) infoWindow.close();
          });
          
          infoWindow.open(map, marker);
          (marker as any).infoWindow = infoWindow;
          
          if (onServiceClick) {
            onServiceClick(service);
          }
        });

        (marker as any).infoWindow = infoWindow;
        return marker;
      });

      setMarkers(newMarkers);

      // Fit bounds to show all markers
      if (services.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        services.forEach(service => {
          bounds.extend(service.coordinates);
        });
        map.fitBounds(bounds);
        
        // Don't zoom in too much if there's only one marker
        if (services.length === 1) {
          map.setZoom(15);
        }
      }
    }
  }, [map, services, selectedServiceId, onServiceClick]);

  const getMarkerColor = (category: string): string => {
    switch (category) {
      case 'Wellness':
        return '#10b981'; // green
      case 'Alternative Medicine':
        return '#3b82f6'; // blue
      case 'Fitness':
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  return <div ref={ref} style={{ height: '100%', width: '100%' }} />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-600 mb-2">Failed to load map</p>
            <p className="text-sm text-gray-500">Please check your Google Maps API key</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const GoogleMap: React.FC<GoogleMapProps> = ({ services, onServiceClick, selectedServiceId }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Safety check for services
  if (!services || !Array.isArray(services)) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (!apiKey || apiKey === 'your_google_maps_api_key_here' || apiKey === 'AIzaSyBvOkBwvOkBwvOkBwvOkBwvOkBwvOkBwvOk') {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <svg className="mx-auto h-12 w-12 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
          <p className="text-sm text-gray-600 mb-4">
            Service locations will be displayed here. Click on service cards to see details.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg text-left text-sm">
            <p className="font-medium mb-2 text-blue-800">Service Locations:</p>
            <div className="space-y-2">
              {services.slice(0, 3).map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    service.category === 'Wellness' ? 'bg-green-500' :
                    service.category === 'Alternative Medicine' ? 'bg-blue-500' :
                    service.category === 'Fitness' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-blue-700">{service.name}</span>
                </div>
              ))}
              {services.length > 3 && (
                <p className="text-blue-600 text-xs">+{services.length - 3} more services</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <MapComponent 
        services={services} 
        onServiceClick={onServiceClick}
        selectedServiceId={selectedServiceId}
      />
    </Wrapper>
  );
};

export default GoogleMap;
