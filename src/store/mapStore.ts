import { create } from 'zustand';
import { MapState } from '../types';

export const useMapStore = create<MapState>((set) => ({
  origin: null,
  destination: null,
  departureTime: null,
  arrivalTime: null,
  routeData: null,
  history: [],
  trafficConditions: [],
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setDepartureTime: (time) => set({ departureTime: time }),
  setArrivalTime: (time) => set({ arrivalTime: time }),
  setRouteData: (data) => set({ routeData: data }),
  addToHistory: (trip) => set((state) => ({
    history: [trip, ...state.history.filter(t => 
      t.origin !== trip.origin || 
      t.destination !== trip.destination ||
      t.date.getTime() !== trip.date.getTime()
    )].slice(0, 10)
  })),
  clearHistory: () => set({ history: [], routeData: null }),
  clearRoute: () => set({ routeData: null }),
  updateTrafficConditions: (conditions) => set({ trafficConditions: conditions })
}));