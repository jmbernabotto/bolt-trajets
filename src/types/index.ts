export interface RouteData {
  distance: string;
  duration: string;
  startAddress: string;
  endAddress: string;
  departureTime?: Date;
  arrivalTime?: Date;
  trafficDuration?: string;
  trafficStatus?: 'normal' | 'medium' | 'heavy';
}

export interface TripHistory {
  id: string;
  origin: string;
  destination: string;
  date: Date;
  routeData: RouteData;
}

export interface TrafficCondition {
  id: string;
  location: string;
  type: 'accident' | 'works' | 'event' | 'weather';
  description: string;
  severity: 'low' | 'medium' | 'high';
  startDate: Date;
  endDate?: Date;
}

export interface MapState {
  origin: string | null;
  destination: string | null;
  departureTime: Date | null;
  arrivalTime: Date | null;
  routeData: RouteData | null;
  history: TripHistory[];
  trafficConditions: TrafficCondition[];
  setOrigin: (origin: string | null) => void;
  setDestination: (destination: string | null) => void;
  setDepartureTime: (time: Date | null) => void;
  setArrivalTime: (time: Date | null) => void;
  setRouteData: (data: RouteData | null) => void;
  addToHistory: (trip: TripHistory) => void;
  clearHistory: () => void;
  clearRoute: () => void;
  updateTrafficConditions: (conditions: TrafficCondition[]) => void;
}