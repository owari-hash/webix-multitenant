'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useTenantInfo } from 'src/hooks/use-tenant';

// ----------------------------------------------------------------------

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export default function HomeTestSection() {
  const { subdomain, databaseName } = useTenantInfo();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);

  const runTests = useCallback(async () => {
    setRunning(true);
    const testResults: TestResult[] = [];

    // Test 1: Subdomain Detection
    testResults.push({
      name: 'Subdomain Detection',
      status: 'pending',
      message: 'Testing...',
    });
    setTests([...testResults]);

    if (subdomain || (typeof window !== 'undefined' && window.location.hostname !== 'localhost')) {
      testResults[0] = {
        name: 'Subdomain Detection',
        status: 'success',
        message: `Subdomain detected: ${subdomain || 'Main Domain'}`,
      };
    } else {
      testResults[0] = {
        name: 'Subdomain Detection',
        status: 'error',
        message: 'Subdomain not detected',
      };
    }
    setTests([...testResults]);

    // Test 2: Database Name Mapping
    testResults.push({
      name: 'Database Name Mapping',
      status: 'pending',
      message: 'Testing...',
    });
    setTests([...testResults]);

    if (databaseName) {
      testResults[1] = {
        name: 'Database Name Mapping',
        status: 'success',
        message: `Database: ${databaseName}`,
      };
    } else {
      testResults[1] = {
        name: 'Database Name Mapping',
        status: 'error',
        message: 'Database name not found',
      };
    }
    setTests([...testResults]);

    // Test 3: Backend Connection
    testResults.push({
      name: 'Backend Connection',
      status: 'pending',
      message: 'Testing...',
    });
    setTests([...testResults]);

    try {
      const response = await fetch('/api2/health');
      const data = await response.json();
      if (data.success) {
        testResults[2] = {
          name: 'Backend Connection',
          status: 'success',
          message: `Connected to backend. Database: ${data.database}`,
        };
      } else {
        testResults[2] = {
          name: 'Backend Connection',
          status: 'error',
          message: data.error || 'Backend connection failed',
        };
      }
    } catch (error) {
      testResults[2] = {
        name: 'Backend Connection',
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
    setTests([...testResults]);

    // Test 4: Welcome Endpoint
    testResults.push({
      name: 'Welcome Endpoint',
      status: 'pending',
      message: 'Testing...',
    });
    setTests([...testResults]);

    try {
      const response = await fetch('/api2/welcome');
      const data = await response.json();
      if (data.success && data.welcome) {
        testResults[3] = {
          name: 'Welcome Endpoint',
          status: 'success',
          message: data.welcome,
        };
      } else {
        testResults[3] = {
          name: 'Welcome Endpoint',
          status: 'error',
          message: 'Welcome message not received',
        };
      }
    } catch (error) {
      testResults[3] = {
        name: 'Welcome Endpoint',
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
    setTests([...testResults]);

    // Test 5: Database Stats
    testResults.push({
      name: 'Database Stats',
      status: 'pending',
      message: 'Testing...',
    });
    setTests([...testResults]);

    try {
      const response = await fetch('/api2/db-stats');
      const data = await response.json();
      if (data.success) {
        const collectionCount = Object.keys(data.collections || {}).length;
        testResults[4] = {
          name: 'Database Stats',
          status: 'success',
          message: `${collectionCount} collections found`,
        };
      } else {
        testResults[4] = {
          name: 'Database Stats',
          status: 'error',
          message: data.error || 'Failed to get stats',
        };
      }
    } catch (error) {
      testResults[4] = {
        name: 'Database Stats',
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
    setTests([...testResults]);

    // Test 6: Test Database Separation
    testResults.push({
      name: 'Database Separation Test',
      status: 'pending',
      message: 'Testing...',
    });
    setTests([...testResults]);

    try {
      const response = await fetch('/api2/test-separation');
      const data = await response.json();
      if (data.success) {
        const verification = data.verification || {};
        const allValid =
          verification.allDocumentsHaveSubdomain && verification.allDocumentsHaveDatabase;
        testResults[5] = {
          name: 'Database Separation Test',
          status: allValid ? 'success' : 'error',
          message: allValid
            ? 'Database separation verified'
            : 'Some documents may not be properly isolated',
        };
      } else {
        testResults[5] = {
          name: 'Database Separation Test',
          status: 'error',
          message: data.error || 'Failed to test separation',
        };
      }
    } catch (error) {
      testResults[5] = {
        name: 'Database Separation Test',
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
    setTests([...testResults]);

    setRunning(false);
  }, [subdomain, databaseName]);

  useEffect(() => {
    // Auto-run tests on mount
    runTests();
  }, [runTests]);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const response = await fetch('/api2/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSeedResult(data);
      if (data.success) {
        // Reload tests after seeding
        setTimeout(() => {
          runTests();
        }, 1000);
      }
    } catch (error) {
      setSeedResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      });
    } finally {
      setSeeding(false);
    }
  };

  const successCount = tests.filter((t) => t.status === 'success').length;
  const errorCount = tests.filter((t) => t.status === 'error').length;
  const totalTests = tests.length;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          System Test
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Testing subdomain multi-tenancy system
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Chip label={`Subdomain: ${subdomain || 'Main'}`} color="primary" variant="outlined" />
          <Chip label={`Database: ${databaseName}`} color="secondary" variant="outlined" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Test Results Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Test Results</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handleSeed}
                    disabled={seeding}
                    color="secondary"
                  >
                    {seeding ? <CircularProgress size={20} /> : 'Seed Test Data'}
                  </Button>
                  <Button variant="contained" onClick={runTests} disabled={running}>
                    {running ? <CircularProgress size={20} /> : 'Run Tests'}
                  </Button>
                </Box>
              </Box>
              {seedResult && (
                <Alert
                  severity={seedResult.success ? 'success' : 'error'}
                  sx={{ mb: 2 }}
                  onClose={() => setSeedResult(null)}
                >
                  {seedResult.success
                    ? `Seeded ${seedResult.totalInserted || 0} documents successfully`
                    : seedResult.error || 'Failed to seed data'}
                </Alert>
              )}
              {totalTests > 0 && (
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip label={`Total: ${totalTests}`} variant="outlined" />
                  <Chip label={`Success: ${successCount}`} color="success" variant="outlined" />
                  <Chip
                    label={`Errors: ${errorCount}`}
                    color={errorCount > 0 ? 'error' : 'default'}
                    variant="outlined"
                  />
                </Box>
              )}
              {successCount === totalTests && totalTests > 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  All tests passed! System is working correctly.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Individual Test Results */}
        {tests.map((test, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">{test.name}</Typography>
                  {test.status === 'pending' && <CircularProgress size={20} />}
                  {test.status === 'success' && (
                    <Chip label="Success" color="success" size="small" />
                  )}
                  {test.status === 'error' && <Chip label="Error" color="error" size="small" />}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {test.message}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Current URL Info */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Configuration
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>URL:</strong>{' '}
                  <code>{typeof window !== 'undefined' ? window.location.href : 'Loading...'}</code>
                </Typography>
                <Typography variant="body2">
                  <strong>Host:</strong>{' '}
                  <code>{typeof window !== 'undefined' ? window.location.host : 'Loading...'}</code>
                </Typography>
                <Typography variant="body2">
                  <strong>Subdomain:</strong> {subdomain || 'Main Domain'}
                </Typography>
                <Typography variant="body2">
                  <strong>Database:</strong> {databaseName}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

