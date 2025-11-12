'use client';

import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useTenantInfo } from 'src/hooks/use-tenant';

// ----------------------------------------------------------------------

interface CollectionData {
  success: boolean;
  database?: string;
  subdomain?: string;
  collection?: string;
  total?: number;
  count?: number;
  data?: any[];
  error?: string;
}

export default function DataBrowserPage() {
  const { subdomain, databaseName } = useTenantInfo();
  const [collectionName, setCollectionName] = useState('');
  const [data, setData] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStats, setDbStats] = useState<any>(null);
  const [inserting, setInserting] = useState(false);
  const [insertData, setInsertData] = useState('');
  const [insertResult, setInsertResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('');
  const [searching, setSearching] = useState(false);

  // Load database stats on mount
  useEffect(() => {
    loadDbStats();
  }, [subdomain]);

  const loadDbStats = async () => {
    try {
      const response = await fetch('/api2/db-stats');
      const stats = await response.json();
      if (stats.success) {
        setDbStats(stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadCollection = async () => {
    if (!collectionName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api2/collection/${collectionName}`);
      const result = await response.json();

      if (result.success) {
        setData(result);
      } else {
        setError(result.error || 'Failed to load collection');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      loadCollection();
    }
  };

  const handleInsert = async () => {
    if (!collectionName.trim() || !insertData.trim()) return;

    setInserting(true);
    setInsertResult(null);
    setError(null);

    try {
      let dataToInsert;
      try {
        dataToInsert = JSON.parse(insertData);
      } catch {
        // If not valid JSON, treat as single object
        dataToInsert = { value: insertData };
      }

      const response = await fetch(`/api2/collection/${collectionName}/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: dataToInsert }),
      });

      const result = await response.json();
      setInsertResult(result);

      if (result.success) {
        setInsertData('');
        // Reload collection and stats
        loadCollection();
        loadDbStats();
      } else {
        setError(result.error || 'Failed to insert data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setInserting(false);
    }
  };

  const handleSearch = async () => {
    if (!collectionName.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (searchField) params.append('field', searchField);

      const response = await fetch(
        `/api2/collection/${collectionName}/search?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setData(result);
      } else {
        setError(result.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setSearching(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Data Browser
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse data from the <strong>{databaseName}</strong> database
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Chip label={`Subdomain: ${subdomain || 'Main'}`} color="primary" variant="outlined" />
          <Chip label={`Database: ${databaseName}`} color="secondary" variant="outlined" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Database Stats */}
        {dbStats && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Database Statistics
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.entries(dbStats.collections || {}).map(([name, count]) => (
                    <Chip
                      key={name}
                      label={`${name}: ${count}`}
                      variant="outlined"
                      onClick={() => {
                        setCollectionName(name);
                        loadCollection();
                      }}
                      clickable
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Total Collections: {dbStats.totalCollections || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Collection Loader */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Load Collection
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Collection Name"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., users, products, orders"
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={loadCollection}
                  disabled={loading || !collectionName.trim()}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Load'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Search */}
        {collectionName && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Search in {collectionName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Search Query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter search term"
                    fullWidth
                  />
                  <TextField
                    label="Field (optional)"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    placeholder="e.g., name, email, title"
                    sx={{ minWidth: 200 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleSearch}
                    disabled={searching || !searchQuery.trim()}
                    color="primary"
                    sx={{ minWidth: 120 }}
                  >
                    {searching ? <CircularProgress size={20} /> : 'Search'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Insert Data */}
        {collectionName && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Insert Data into {collectionName}
                </Typography>
                <TextField
                  label="JSON Data"
                  value={insertData}
                  onChange={(e) => setInsertData(e.target.value)}
                  placeholder='{"name": "Test", "value": "Data"} or array of objects'
                  multiline
                  rows={4}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleInsert}
                  disabled={inserting || !insertData.trim()}
                  color="secondary"
                >
                  {inserting ? <CircularProgress size={20} /> : 'Insert Data'}
                </Button>
                {insertResult && (
                  <Alert
                    severity={insertResult.success ? 'success' : 'error'}
                    sx={{ mt: 2 }}
                    onClose={() => setInsertResult(null)}
                  >
                    {insertResult.success
                      ? `Inserted ${insertResult.insertedCount || 0} document(s)`
                      : insertResult.error || 'Failed to insert data'}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Error Display */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {/* Data Display */}
        {data && data.success && data.data && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Collection: {data.collection}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={`Total: ${data.total || 0}`} variant="outlined" />
                  <Chip label={`Showing: ${data.count || 0}`} variant="outlined" />
                  <Chip label={`Database: ${data.database}`} variant="outlined" />
                </Box>

                {data.data.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {Object.keys(data.data[0]).map((key) => (
                            <TableCell key={key}>
                              <strong>{key}</strong>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.data.map((row: any, index: number) => (
                          <TableRow key={row._id || index}>
                            {Object.entries(row).map(([key, value]) => (
                              <TableCell key={key}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">No documents found in this collection</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
