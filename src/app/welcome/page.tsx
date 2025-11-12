'use client';

import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import { useTenantInfo } from 'src/hooks/use-tenant';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export default function WelcomePage() {
  const { subdomain, databaseName } = useTenantInfo();
  const [backendData, setBackendData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWelcome = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get welcome message from backend
        const response = await fetch('/api2/api/welcome');
        const data = await response.json();

        if (data.success) {
          setBackendData(data);
        } else {
          setError(data.error || 'Failed to connect to backend');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchWelcome();
  }, [subdomain]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography>Connecting to backend...</Typography>
          </Box>
        )}
        {!loading && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {!loading && !error && backendData && (
          <>
            <Typography variant="h2" component="h1" gutterBottom color="primary">
              {backendData.welcome || backendData.message}
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
              {backendData.message}
            </Typography>
          </>
        )}
      </Box>

      {backendData && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Database Separation Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Database Separation Confirmed
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label={`Subdomain: ${backendData.subdomain || subdomain || 'Main'}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Database: ${backendData.database || databaseName}`}
                  color="secondary"
                  variant="outlined"
                />
                <Chip
                  label={backendData.databaseSeparation || '✅ Isolated'}
                  color="success"
                  variant="outlined"
                />
              </Box>
              <Alert severity="success">
                {backendData.databaseSeparation || 'Database separation confirmed'}
              </Alert>
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Connection Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Host:</strong> {backendData.host || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Connection:</strong>{' '}
                  <Chip
                    label={backendData.connectionStatus || 'Connected'}
                    color={backendData.connectionStatus === 'Connected' ? 'success' : 'warning'}
                    size="small"
                  />
                </Typography>
                <Typography variant="body2">
                  <strong>Timestamp:</strong> {backendData.timestamp || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Collections Info */}
          {backendData.collections && backendData.collections.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Database Collections
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {backendData.collections.map((collection: string) => (
                    <Chip key={collection} label={collection} variant="outlined" size="small" />
                  ))}
                </Box>
                <Link component={RouterLink} href="/data-browser" underline="hover">
                  <Typography variant="body2" color="primary">
                    Browse Data →
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link component={RouterLink} href="/data-browser" underline="hover">
                  Data Browser - Browse collections and documents
                </Link>
                <Link component={RouterLink} href="/welcome" underline="hover">
                  Welcome Page - Database separation info
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}
