import React from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { useMapStore } from '../store/mapStore';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 47.5862,
  lng: 1.3359
};

interface MapProps {
  onRouteCalculated?: () => void;
  shouldCalculate: boolean;
}

export const Map: React.FC<MapProps> = ({ onRouteCalculated, shouldCalculate }) => {
  const { origin, destination, routeData, setRouteData } = useMapStore();
  const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);
  const [mapKey, setMapKey] = React.useState(0);

  React.useEffect(() => {
    if (!routeData || shouldCalculate) {
      setDirections(null);
      setMapKey(prev => prev + 1);
    }
  }, [routeData, shouldCalculate]);

  const directionsCallback = React.useCallback(
    (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (status === 'OK' && result) {
        setDirections(result);
        const route = result.routes[0];
        if (route && route.legs[0]) {
          const trafficDuration = route.legs[0].duration_in_traffic?.text;
          const normalDuration = route.legs[0].duration?.text || '';
          
          let trafficStatus: 'normal' | 'medium' | 'heavy' = 'normal';
          if (route.legs[0].duration_in_traffic && route.legs[0].duration) {
            const ratio = route.legs[0].duration_in_traffic.value / route.legs[0].duration.value;
            if (ratio > 1.5) trafficStatus = 'heavy';
            else if (ratio > 1.2) trafficStatus = 'medium';
          }

          setRouteData({
            distance: route.legs[0].distance?.text || '',
            duration: normalDuration,
            trafficDuration: trafficDuration || normalDuration,
            trafficStatus,
            startAddress: route.legs[0].start_address,
            endAddress: route.legs[0].end_address
          });
          onRouteCalculated?.();
        }
      }
    },
    [setRouteData, onRouteCalculated]
  );

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        key={mapKey}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {origin && destination && shouldCalculate && (
          <DirectionsService
            options={{
              destination: destination,
              origin: origin,
              travelMode: google.maps.TravelMode.DRIVING,
              drivingOptions: {
                departureTime: new Date(),
                trafficModel: google.maps.TrafficModel.BEST_GUESS
              }
            }}
            callback={directionsCallback}
          />
        )}
        {directions && (
          <DirectionsRenderer 
            directions={directions}
            options={{
              suppressMarkers: false,
              preserveViewport: false
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};