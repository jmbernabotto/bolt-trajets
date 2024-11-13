import React from 'react';
import { Paper, Button, Typography, Chip } from '@mui/material';
import { CitySelect } from './CitySelect';
import { TimeSelector } from './TimeSelector';
import { RouteData } from '../types';

interface RouteFormProps {
  origin: string | null;
  destination: string | null;
  departureTime: Date | null;
  arrivalTime: Date | null;
  isDepartureMode: boolean;
  routeData: RouteData | null;
  onOriginChange: (value: string | null) => void;
  onDestinationChange: (value: string | null) => void;
  onDepartureTimeChange: (value: Date | null) => void;
  onArrivalTimeChange: (value: Date | null) => void;
  onModeToggle: () => void;
  onCalculate: () => void;
}

export const RouteForm: React.FC<RouteFormProps> = ({
  origin,
  destination,
  departureTime,
  arrivalTime,
  isDepartureMode,
  routeData,
  onOriginChange,
  onDestinationChange,
  onDepartureTimeChange,
  onArrivalTimeChange,
  onModeToggle,
  onCalculate,
}) => {
  const getTrafficStatusColor = (status?: 'normal' | 'medium' | 'heavy') => {
    switch (status) {
      case 'heavy':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getTrafficStatusLabel = (status?: 'normal' | 'medium' | 'heavy') => {
    switch (status) {
      case 'heavy':
        return 'Trafic dense';
      case 'medium':
        return 'Trafic modéré';
      default:
        return 'Trafic fluide';
    }
  };

  return (
    <Paper className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <CitySelect
            label="Départ"
            value={origin}
            onChange={onOriginChange}
          />
        </div>
        
        <div className="mt-4">
          <CitySelect
            label="Arrivée"
            value={destination}
            onChange={onDestinationChange}
          />
        </div>
        
        <div className="mt-4">
          <Button
            variant="outlined"
            onClick={onModeToggle}
            fullWidth
          >
            {isDepartureMode ? "Changer pour heure d'arrivée" : "Changer pour heure de départ"}
          </Button>
        </div>

        <div className="mt-4">
          <TimeSelector
            label={isDepartureMode ? "Heure de départ" : "Heure d'arrivée"}
            value={isDepartureMode ? departureTime : arrivalTime}
            onChange={isDepartureMode ? onDepartureTimeChange : onArrivalTimeChange}
          />
        </div>

        <div className="mt-4">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onCalculate}
          >
            Calculer l'itinéraire
          </Button>
        </div>

        {routeData && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <Typography variant="h6" className="mb-2">Informations du trajet</Typography>
            <div className="flex items-center gap-2 mb-2">
              <Typography>Conditions:</Typography>
              <Chip
                size="small"
                color={getTrafficStatusColor(routeData.trafficStatus)}
                label={getTrafficStatusLabel(routeData.trafficStatus)}
              />
            </div>
            <Typography className="mb-1">Distance: {routeData.distance}</Typography>
            <Typography className="mb-1">
              Durée normale: {routeData.duration}
            </Typography>
            {routeData.trafficDuration && routeData.trafficDuration !== routeData.duration && (
              <Typography>
                Durée avec trafic: {routeData.trafficDuration}
              </Typography>
            )}
          </div>
        )}
      </div>
    </Paper>
  );
};