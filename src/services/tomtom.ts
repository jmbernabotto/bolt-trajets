import { services } from '@tomtom-international/web-sdk-services';
import type { TrafficCondition } from '../types';

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

interface TomTomIncident {
  id: string;
  type: number;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: {
    iconCategory: number;
    magnitudeOfDelay: number;
    events: Array<{
      description: string;
      code: number;
      iconCategory: number;
    }>;
    startTime: string;
    endTime?: string;
  };
}

const mapIncidentType = (iconCategory: number): TrafficCondition['type'] => {
  switch (iconCategory) {
    case 1: // Accident
      return 'accident';
    case 2: // Construction
      return 'works';
    case 3: // Weather
      return 'weather';
    default:
      return 'event';
  }
};

const mapSeverity = (magnitudeOfDelay: number): TrafficCondition['severity'] => {
  if (magnitudeOfDelay >= 8) return 'high';
  if (magnitudeOfDelay >= 4) return 'medium';
  return 'low';
};

export const fetchTrafficIncidents = async (
  origin: string,
  destination: string
): Promise<TrafficCondition[]> => {
  try {
    // Get coordinates for origin and destination
    const [originResult, destResult] = await Promise.all([
      services.geocode({
        key: TOMTOM_API_KEY,
        query: origin
      }),
      services.geocode({
        key: TOMTOM_API_KEY,
        query: destination
      })
    ]);

    if (!originResult.results.length || !destResult.results.length) {
      throw new Error('Could not geocode locations');
    }

    const originPos = originResult.results[0].position;
    const destPos = destResult.results[0].position;

    // Calculate bounding box for the route
    const minLat = Math.min(originPos.lat, destPos.lat);
    const maxLat = Math.max(originPos.lat, destPos.lat);
    const minLon = Math.min(originPos.lon, destPos.lon);
    const maxLon = Math.max(originPos.lon, destPos.lon);

    // Add some padding to the bounding box
    const padding = 0.1; // degrees
    const bbox = `${minLon - padding},${minLat - padding},${maxLon + padding},${maxLat + padding}`;

    // Fetch traffic incidents
    const response = await services.trafficIncidents({
      key: TOMTOM_API_KEY,
      bbox,
      fields: {
        incidents: ['id', 'type', 'geometry', 'properties']
      },
      language: 'fr-FR'
    });

    return response.incidents.map((incident: TomTomIncident) => ({
      id: incident.id,
      type: mapIncidentType(incident.properties.iconCategory),
      location: incident.properties.events[0]?.description || 'Zone non spécifiée',
      description: incident.properties.events
        .map(event => event.description)
        .join('. '),
      severity: mapSeverity(incident.properties.magnitudeOfDelay),
      startDate: new Date(incident.properties.startTime),
      ...(incident.properties.endTime && {
        endDate: new Date(incident.properties.endTime)
      })
    }));
  } catch (error) {
    console.error('Error fetching traffic incidents:', error);
    return [];
  }
};