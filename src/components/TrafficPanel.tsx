import React from 'react';
import { Paper, Typography, Chip, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ConstructionIcon from '@mui/icons-material/Construction';
import EventIcon from '@mui/icons-material/Event';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import { TrafficCondition } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TrafficPanelProps {
  conditions: TrafficCondition[];
}

const getIcon = (type: TrafficCondition['type']) => {
  switch (type) {
    case 'accident':
      return <WarningIcon />;
    case 'works':
      return <ConstructionIcon />;
    case 'event':
      return <EventIcon />;
    case 'weather':
      return <ThunderstormIcon />;
  }
};

const getSeverityColor = (severity: TrafficCondition['severity']) => {
  switch (severity) {
    case 'low':
      return 'info';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
  }
};

export const TrafficPanel: React.FC<TrafficPanelProps> = ({ conditions }) => {
  if (conditions.length === 0) return null;

  return (
    <Paper className="p-6 mt-4">
      <Typography variant="h6" gutterBottom>
        Conditions de circulation
      </Typography>
      {conditions.map((condition) => (
        <Box key={condition.id} className="mb-4 last:mb-0">
          <div className="flex items-center gap-2 mb-2">
            {getIcon(condition.type)}
            <Typography variant="subtitle1" component="span">
              {condition.location}
            </Typography>
            <Chip
              label={condition.type === 'accident' ? 'Accident' :
                     condition.type === 'works' ? 'Travaux' :
                     condition.type === 'event' ? 'Événement' : 'Météo'}
              size="small"
              color={getSeverityColor(condition.severity)}
              className="ml-auto"
            />
          </div>
          <Typography variant="body2" color="text.secondary" className="mb-1">
            {condition.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Depuis le {format(condition.startDate, 'Pp', { locale: fr })}
            {condition.endDate && ` jusqu'au ${format(condition.endDate, 'Pp', { locale: fr })}`}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};