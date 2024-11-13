import React, { useState } from 'react';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { Map } from './components/Map';
import { ErrorAlert } from './components/ErrorAlert';
import { RouteForm } from './components/RouteForm';
import { HistoryPanel } from './components/HistoryPanel';
import { TrafficPanel } from './components/TrafficPanel';
import { useMapStore } from './store/mapStore';
import { useTrafficConditions } from './hooks/useTrafficConditions';
import { v4 as uuidv4 } from 'uuid';
import type { TripHistory as TripHistoryType } from './types';

const App: React.FC = () => {
  const {
    origin,
    destination,
    departureTime,
    arrivalTime,
    routeData,
    history,
    trafficConditions,
    setOrigin,
    setDestination,
    setDepartureTime,
    setArrivalTime,
    setRouteData,
    addToHistory,
    clearHistory,
    clearRoute,
  } = useMapStore();

  const [isDepartureMode, setIsDepartureMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldCalculate, setShouldCalculate] = useState(false);

  // Initialize traffic conditions
  useTrafficConditions();

  const handleRouteCalculated = () => {
    if (routeData && origin && destination) {
      const tripTime = isDepartureMode ? departureTime : arrivalTime;
      const newTrip = {
        id: uuidv4(),
        origin,
        destination,
        date: tripTime || new Date(),
        routeData: {
          ...routeData,
          departureTime: isDepartureMode ? tripTime || undefined : undefined,
          arrivalTime: !isDepartureMode ? tripTime || undefined : undefined,
        },
      };
      addToHistory(newTrip);
    }
    setShouldCalculate(false);
  };

  const handleRestoreTrip = (trip: TripHistoryType) => {
    setOrigin(trip.origin);
    setDestination(trip.destination);
    if (trip.routeData.departureTime) {
      setDepartureTime(new Date(trip.routeData.departureTime));
      setIsDepartureMode(true);
    } else if (trip.routeData.arrivalTime) {
      setArrivalTime(new Date(trip.routeData.arrivalTime));
      setIsDepartureMode(false);
    }
    setRouteData(trip.routeData);
  };

  const handleCalculate = () => {
    if (!origin || !destination) {
      setError("Veuillez sélectionner une ville de départ et d'arrivée");
      return;
    }
    clearRoute();
    setShouldCalculate(true);
  };

  const handleClearHistory = () => {
    clearHistory();
    setShouldCalculate(false);
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        Planificateur de trajets - Loir-et-Cher
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <RouteForm
            origin={origin}
            destination={destination}
            departureTime={departureTime}
            arrivalTime={arrivalTime}
            isDepartureMode={isDepartureMode}
            routeData={routeData}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onDepartureTimeChange={setDepartureTime}
            onArrivalTimeChange={setArrivalTime}
            onModeToggle={() => setIsDepartureMode(!isDepartureMode)}
            onCalculate={handleCalculate}
          />
          
          <TrafficPanel conditions={trafficConditions} />
          
          <HistoryPanel
            history={history}
            onRestore={handleRestoreTrip}
            onClear={handleClearHistory}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper className="p-4">
            <Map 
              onRouteCalculated={handleRouteCalculated} 
              shouldCalculate={shouldCalculate}
            />
          </Paper>
        </Grid>
      </Grid>

      <ErrorAlert 
        error={error} 
        onClose={() => setError(null)} 
      />
    </Container>
  );
};

export default App;