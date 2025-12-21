'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSnackbar } from 'src/components/snackbar';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { fDate } from 'src/utils/format-time';
import { useState, useEffect } from 'react';
import { backendRequest } from 'src/utils/backend-api';

// ----------------------------------------------------------------------

interface PremiumPlan {
  name: string;
  label: string;
  price: number;
  duration: number;
  period: 'month' | 'year';
  discount?: string;
  isActive: boolean;
  order: number;
}

// ----------------------------------------------------------------------

export default function BillingView() {
  const { enqueueSnackbar } = useSnackbar();
  const [license, setLicense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [premiumPlans, setPremiumPlans] = useState<PremiumPlan[]>([]);
  const [subdomain, setSubdomain] = useState<string>('');
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlanIndex, setEditingPlanIndex] = useState<number | null>(null);
  const [planForm, setPlanForm] = useState<PremiumPlan>({
    name: '',
    label: '',
    price: 0,
    duration: 1,
    period: 'month',
    discount: '',
    isActive: true,
    order: 0,
  });
  const [savingPlans, setSavingPlans] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [licenseResponse, orgResponse] = await Promise.all([
          backendRequest('/organizations/license'),
          backendRequest('/organizations/current'),
        ]);

        console.log('License response:', licenseResponse);
        console.log('Organization response:', orgResponse);

        if (licenseResponse.success) {
          setLicense(licenseResponse.data.subscription);
        }

        if (orgResponse.success && orgResponse.data) {
          console.log('Organization data:', orgResponse.data);
          console.log('Premium plans from org:', orgResponse.data.premiumPlans);
          
          if (orgResponse.data.premiumPlans && Array.isArray(orgResponse.data.premiumPlans)) {
            setPremiumPlans(orgResponse.data.premiumPlans);
            console.log('Set premium plans:', orgResponse.data.premiumPlans);
          } else {
            console.log('No premium plans found or not an array');
            setPremiumPlans([]);
          }
          
          if (orgResponse.data.subdomain) {
            setSubdomain(orgResponse.data.subdomain);
          } else {
            // Fallback: extract from hostname
            const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
            const parts = hostname.split('.');
            if (parts.length > 0 && parts[0] !== 'www' && parts[0] !== 'localhost') {
              setSubdomain(parts[0]);
            }
          }
        } else {
          console.error('Failed to fetch organization:', orgResponse);
          // Fallback: extract subdomain from hostname
          const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
          const parts = hostname.split('.');
          if (parts.length > 0 && parts[0] !== 'www' && parts[0] !== 'localhost') {
            setSubdomain(parts[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback: extract subdomain from hostname
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const parts = hostname.split('.');
        if (parts.length > 0 && parts[0] !== 'www' && parts[0] !== 'localhost') {
          setSubdomain(parts[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenPlanDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingPlanIndex(index);
      setPlanForm({ ...premiumPlans[index] });
    } else {
      setEditingPlanIndex(null);
      setPlanForm({
        name: '',
        label: '',
        price: 0,
        duration: 1,
        period: 'month',
        discount: '',
        isActive: true,
        order: premiumPlans.length,
      });
    }
    setPlanDialogOpen(true);
  };

  const handleClosePlanDialog = () => {
    setPlanDialogOpen(false);
    setEditingPlanIndex(null);
    setPlanForm({
      name: '',
      label: '',
      price: 0,
      duration: 1,
      period: 'month',
      discount: '',
      isActive: true,
      order: 0,
    });
  };

  const handleSavePlan = async () => {
    if (!planForm.name || !planForm.label || planForm.price <= 0) {
      enqueueSnackbar('Нэр, шошго, үнэ шаардлагатай', { variant: 'warning' });
      return;
    }

    // Update local state first
    let updatedPlans: PremiumPlan[];
    if (editingPlanIndex !== null) {
      updatedPlans = [...premiumPlans];
      updatedPlans[editingPlanIndex] = planForm;
    } else {
      updatedPlans = [...premiumPlans, planForm];
    }
    setPremiumPlans(updatedPlans);
    handleClosePlanDialog();

    // Auto-save to backend
    if (!subdomain) {
      enqueueSnackbar('Байгууллагын мэдээлэл олдсонгүй', { variant: 'error' });
      return;
    }

    try {
      console.log('Auto-saving premium plans after add/edit:', { subdomain, premiumPlans: updatedPlans });
      
      const response = await backendRequest(`/organizations/${subdomain}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ premiumPlans: updatedPlans }),
      });

      console.log('Auto-save response:', response);

      if (response.success) {
        enqueueSnackbar('Багц амжилттай хадгалагдлаа', { variant: 'success' });
        // Update local state with saved data
        const orgResponse = await backendRequest('/organizations/current');
        if (orgResponse.success && orgResponse.data?.premiumPlans) {
          setPremiumPlans(orgResponse.data.premiumPlans);
        }
      } else {
        enqueueSnackbar(response.message || 'Хадгалахад алдаа гарлаа', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('Failed to auto-save plan:', error);
      enqueueSnackbar(error.message || 'Хадгалахад алдаа гарлаа', { variant: 'error' });
    }
  };

  const handleDeletePlan = (index: number) => {
    if (window.confirm('Энэ багцыг устгах уу?')) {
      const updated = premiumPlans.filter((_, i) => i !== index);
      setPremiumPlans(updated);
    }
  };

  const handleMovePlan = (index: number, direction: 'up' | 'down') => {
    const updated = [...premiumPlans];
    if (direction === 'up' && index > 0) {
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      updated[index - 1].order = index - 1;
      updated[index].order = index;
    } else if (direction === 'down' && index < updated.length - 1) {
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      updated[index].order = index;
      updated[index + 1].order = index + 1;
    }
    setPremiumPlans(updated);
  };

  const handleSavePlans = async () => {
    if (!subdomain) {
      enqueueSnackbar('Байгууллагын мэдээлэл олдсонгүй', { variant: 'error' });
      return;
    }

    setSavingPlans(true);
    try {
      console.log('Saving premium plans:', { subdomain, premiumPlans });
      
      const response = await backendRequest(`/organizations/${subdomain}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ premiumPlans }),
      });

      console.log('Save plans response:', response);

      if (response.success) {
        enqueueSnackbar('Premium багцууд амжилттай хадгалагдлаа', { variant: 'success' });
        // Refresh the data to show updated plans
        const orgResponse = await backendRequest('/organizations/current');
        if (orgResponse.success && orgResponse.data?.premiumPlans) {
          setPremiumPlans(orgResponse.data.premiumPlans);
        }
      } else {
        enqueueSnackbar(response.message || 'Хадгалахад алдаа гарлаа', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('Failed to save plans:', error);
      enqueueSnackbar(error.message || 'Хадгалахад алдаа гарлаа', { variant: 'error' });
    } finally {
      setSavingPlans(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>Loading...</Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Premium Багцууд"
              action={
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => handleOpenPlanDialog()}
                >
                  Багц нэмэх
                </Button>
              }
            />
            <CardContent>
              {premiumPlans.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Premium багц байхгүй байна. Багц нэмэхийн тулд &quot;Багц нэмэх&quot; товч дараарай.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {premiumPlans
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((plan, index) => (
                      <Card key={index} variant="outlined" sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {plan.label}
                              </Typography>
                              {!plan.isActive && (
                                <Label color="default" variant="soft">
                                  Идэвхгүй
                                </Label>
                              )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {plan.name} • ₮{plan.price.toLocaleString()} • {plan.duration} {plan.period === 'month' ? 'сар' : 'жил'}
                              {plan.discount && ` • ${plan.discount}`}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleMovePlan(index, 'up')}
                              disabled={index === 0}
                            >
                              <Iconify icon="mingcute:arrow-up-line" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleMovePlan(index, 'down')}
                              disabled={index === premiumPlans.length - 1}
                            >
                              <Iconify icon="mingcute:arrow-down-line" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenPlanDialog(index)}
                              color="primary"
                            >
                              <Iconify icon="mingcute:edit-line" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePlan(index)}
                              color="error"
                            >
                              <Iconify icon="mingcute:delete-line" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Card>
                    ))}
                </Stack>
              )}

              {premiumPlans.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSavePlans}
                    disabled={savingPlans}
                    startIcon={<Iconify icon="mingcute:save-line" />}
                  >
                    {savingPlans ? 'Хадгалж байна...' : 'Хадгалах'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

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

      {/* Premium Plan Dialog */}
      <Dialog open={planDialogOpen} onClose={handleClosePlanDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPlanIndex !== null ? 'Багц засах' : 'Шинэ багц нэмэх'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Нэр"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  placeholder="monthly"
                  helperText="Системд ашиглах нэр (жижиг үсэг, зураас)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Шошго"
                  value={planForm.label}
                  onChange={(e) => setPlanForm({ ...planForm, label: e.target.value })}
                  placeholder="Сарын багц"
                  helperText="Хэрэглэгчдэд харагдах нэр"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Үнэ (₮)"
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                  inputProps={{ min: 0, step: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Хугацаа"
                  value={planForm.duration}
                  onChange={(e) => setPlanForm({ ...planForm, duration: Number(e.target.value) })}
                  inputProps={{ min: 1 }}
                  helperText={planForm.period === 'month' ? 'Сараар' : 'Жилийн'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Төрөл"
                  value={planForm.period}
                  onChange={(e) => setPlanForm({ ...planForm, period: e.target.value as 'month' | 'year' })}
                  SelectProps={{ native: true }}
                >
                  <option value="month">Сар</option>
                  <option value="year">Жил</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Хөнгөлөлт"
                  value={planForm.discount}
                  onChange={(e) => setPlanForm({ ...planForm, discount: e.target.value })}
                  placeholder="2 сар үнэгүй"
                  helperText="Сонголттой"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Дараалал"
                  value={planForm.order}
                  onChange={(e) => setPlanForm({ ...planForm, order: Number(e.target.value) })}
                  inputProps={{ min: 0 }}
                  helperText="Харагдах дараалал"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={planForm.isActive}
                      onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                    />
                  }
                  label="Идэвхтэй"
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePlanDialog}>Цуцлах</Button>
          <Button variant="contained" onClick={handleSavePlan}>
            Хадгалах
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
