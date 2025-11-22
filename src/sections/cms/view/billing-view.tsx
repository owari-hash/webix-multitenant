'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { fDate } from 'src/utils/format-time';
import { useState, useEffect } from 'react';
import { backendRequest } from 'src/utils/backend-api';

// ----------------------------------------------------------------------

export default function BillingView() {
  const [license, setLicense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicense = async () => {
      try {
        const response = await backendRequest('/organizations/license');
        if (response.success) {
          setLicense(response.data.subscription);
        }
      } catch (error) {
        console.error('Failed to fetch license:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLicense();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 3, textAlign: 'center' }}>Loading...</Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Төлбөр тооцоо"
        links={[
          { name: 'Dashboard', href: '/cms' },
          { name: 'Settings', href: '/cms/settings' },
          { name: 'Billing' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Лицензийн мэдээлэл"
              action={
                <Label
                  color={license?.status === 'active' ? 'success' : 'error'}
                  sx={{ textTransform: 'uppercase' }}
                >
                  {license?.status === 'active' ? 'Идэвхтэй' : 'Идэвхгүй'}
                </Label>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Багц
                  </Typography>
                  <Typography variant="subtitle2">
                    {(license?.plan || 'Premium').toUpperCase()}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Эхэлсэн огноо
                  </Typography>
                  <Typography variant="subtitle2">
                    {fDate(license?.startDate)}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Дуусах огноо
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                    {fDate(license?.endDate)}
                  </Typography>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Автомат сунгалт
                  </Typography>
                  <Label color={license?.autoRenew ? 'primary' : 'default'}>
                    {license?.autoRenew ? 'Асаалттай' : 'Унтраалттай'}
                  </Label>
                </Stack>
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                  Лиценз сунгах
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'common.white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Танд тусламж хэрэгтэй юу?
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.72, mb: 3 }}>
                Хэрэв танд төлбөр тооцоо, лицензтэй холбоотой асуулт байвал манай тусламжийн багтай холбогдоно уу.
              </Typography>
              <Button
                variant="contained"
                color="warning"
                startIcon={<Iconify icon="eva:phone-call-fill" />}
                fullWidth
              >
                Холбогдох
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
