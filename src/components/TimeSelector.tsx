import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { fr } from 'date-fns/locale';

interface TimeSelectorProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={onChange}
        sx={{ 
          width: '100%',
          '& .MuiInputBase-root': {
            backgroundColor: '#fff'
          }
        }}
      />
    </LocalizationProvider>
  );
};