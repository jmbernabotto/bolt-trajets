import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import { TripHistory as TripHistoryType } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import RestoreIcon from '@mui/icons-material/Restore';

interface TripHistoryProps {
  history: TripHistoryType[];
  onRestore: (trip: TripHistoryType) => void;
}

export const TripHistory: React.FC<TripHistoryProps> = ({ history, onRestore }) => {
  const formatTripTime = (trip: TripHistoryType) => {
    const date = new Date(trip.date);
    const timeStr = format(date, 'PPP à HH:mm', { locale: fr });
    return `${timeStr} - ${trip.routeData.duration}`;
  };

  return (
    <List>
      {history.map((trip) => (
        <ListItem
          key={trip.id}
          secondaryAction={
            <IconButton edge="end" onClick={() => onRestore(trip)}>
              <RestoreIcon />
            </IconButton>
          }
        >
          <ListItemText
            primary={`${trip.origin} → ${trip.destination}`}
            secondary={formatTripTime(trip)}
          />
        </ListItem>
      ))}
    </List>
  );
};