import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { communes } from '../data/communes';

interface CitySelectProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const CitySelect: React.FC<CitySelectProps> = ({ label, value, onChange }) => {
  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={communes}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: '#fff',
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />
      )}
      filterOptions={(options, { inputValue }) => {
        return options.filter(option =>
          option.toLowerCase().includes(inputValue.toLowerCase())
        );
      }}
    />
  );
};