import React from 'react';
import { Alert, Snackbar } from '@mui/material';

interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
};