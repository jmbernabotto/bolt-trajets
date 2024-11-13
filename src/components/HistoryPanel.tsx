import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { TripHistory } from './TripHistory';
import type { TripHistory as TripHistoryType } from '../types';

interface HistoryPanelProps {
  history: TripHistoryType[];
  onRestore: (trip: TripHistoryType) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onRestore,
  onClear,
}) => {
  if (history.length === 0) return null;

  return (
    <Paper className="p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6">
          Historique des trajets
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={onClear}
        >
          Effacer
        </Button>
      </div>
      <TripHistory history={history} onRestore={onRestore} />
    </Paper>
  );
};