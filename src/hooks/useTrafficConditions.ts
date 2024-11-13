import { useEffect } from 'react';
import { useMapStore } from '../store/mapStore';
import { fetchTrafficIncidents } from '../services/tomtom';

export const useTrafficConditions = () => {
  const { origin, destination, updateTrafficConditions } = useMapStore();

  useEffect(() => {
    if (origin && destination) {
      const fetchData = async () => {
        try {
          const incidents = await fetchTrafficIncidents(origin, destination);
          updateTrafficConditions(incidents);
        } catch (error) {
          console.error('Error in useTrafficConditions:', error);
          updateTrafficConditions([]);
        }
      };

      fetchData();
    } else {
      updateTrafficConditions([]);
    }
  }, [origin, destination, updateTrafficConditions]);
};