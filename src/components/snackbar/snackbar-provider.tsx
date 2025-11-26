'use client';

import { useMemo, useState, ReactNode, useContext, useCallback, createContext } from 'react';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// ----------------------------------------------------------------------

type SnackbarVariant = 'success' | 'error' | 'warning' | 'info';

interface SnackbarContextType {
  enqueueSnackbar: (message: string, options?: { variant?: SnackbarVariant }) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// ----------------------------------------------------------------------

interface SnackbarMessage {
  message: string;
  variant: SnackbarVariant;
  key: number;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [, setSnackbars] = useState<SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [currentSnackbar, setCurrentSnackbar] = useState<SnackbarMessage | null>(null);

  const enqueueSnackbar = useCallback(
    (msg: string, options?: { variant?: SnackbarVariant }) => {
      const newSnackbar: SnackbarMessage = {
        message: msg,
        variant: options?.variant || 'info',
        key: Date.now(),
      };

      setSnackbars((prev) => [...prev, newSnackbar]);

      // If no snackbar is currently showing, show this one immediately
      if (!open) {
        setCurrentSnackbar(newSnackbar);
        setOpen(true);
      }
    },
    [open]
  );

  const handleClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);

    // Process next snackbar in queue after a short delay
    setTimeout(() => {
      setSnackbars((prev) => {
        const [, ...rest] = prev;
        if (rest.length > 0) {
          setCurrentSnackbar(rest[0]);
          setOpen(true);
        } else {
          setCurrentSnackbar(null);
        }
        return rest;
      });
    }, 100);
  }, []);

  const contextValue = useMemo(() => ({ enqueueSnackbar }), [enqueueSnackbar]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {currentSnackbar && (
        <Snackbar
          key={currentSnackbar.key}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={currentSnackbar.variant} sx={{ width: '100%' }}>
            {currentSnackbar.message}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
}

// ----------------------------------------------------------------------

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
}
