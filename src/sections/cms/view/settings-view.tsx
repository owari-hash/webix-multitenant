'use client';

import { useState, useEffect, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// utils
import { backendRequest } from 'src/utils/backend-api';
// views
import BillingView from './billing-view';

// ----------------------------------------------------------------------

export default function SettingsView() {
  const [currentTab, setCurrentTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [organization, setOrganization] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    bankAccount: {
      bankName: '',
      accountNumber: '',
      accountName: '',
    },
  });

  const fetchOrganization = useCallback(async () => {
    try {
      // We can get the current organization details from the license endpoint or a dedicated one
      // For now, let's use the license endpoint as it returns organization data, or we can use the /current endpoint if available
      // Actually, let's use the /license endpoint as we know it works and returns some data, 
      // but better to use a dedicated endpoint. 
      // Let's try to fetch from /organizations/license first to get the subdomain, then fetch details?
      // Or just assume we are on the subdomain.
      
      // Wait, we need to know WHICH organization to update.
      // The backend uses subdomain from request.
      // Let's check if we have a 'get current organization' endpoint.
      // We moved /license and /current to top. Let's use /current if it exists, or just /license.
      // The /license endpoint returns { subscription, name, displayName }. It might not return bankAccount.
      
      // Let's use the /organizations/:subdomain endpoint. But we need the subdomain.
      // The backend extracts subdomain from request.
      
      // Let's try fetching from /organizations/current (we saw it in the file earlier)
      // Wait, the file view showed /license and /current were moved.
      // Let's try /organizations/license first to get basic info, but we need full info.
      
      // Actually, let's just try GET /api2/organizations/current
      const response = await backendRequest('/organizations/current');
      if (response.success) {
        setOrganization(response.data);
        setFormData({
          name: response.data.name || '',
          displayName: response.data.displayName || '',
          description: response.data.description || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          bankAccount: {
            bankName: response.data.bankAccount?.bankName || '',
            accountNumber: response.data.bankAccount?.accountNumber || '',
            accountName: response.data.bankAccount?.accountName || '',
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch organization:', error);
      // Fallback or error handling
    }
  }, []);

  useEffect(() => {
    fetchOrganization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBankAccountChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bankAccount: {
        ...prev.bankAccount,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // We need the subdomain to update. 
      // If we are on the tenant subdomain, the backend should handle it.
      // But the PUT route is /:subdomain.
      // We can extract subdomain from window.location or from the organization object if we have it.
      const subdomain = organization?.subdomain || window.location.hostname.split('.')[0];
      
      const response = await backendRequest(`/organizations/${subdomain}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      if (response.success) {
        alert('Settings updated successfully!');
        // Update local state if needed
      } else {
        alert('Failed to update settings.');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    {
      value: 'general',
      label: 'General',
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'billing',
      label: 'Billing',
      icon: <Iconify icon="solar:bill-list-bold" width={24} />,
    },
    {
      value: 'notifications',
      label: 'Notifications',
      icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Settings"
        links={[
          { name: 'Dashboard', href: '/cms' },
          { name: 'Settings' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'general' && (
        <Box>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
              Organization Details
            </Typography>
            
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <TextField
                name="displayName"
                label="Display Name"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
              />
              <TextField
                name="email"
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <TextField
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
              <TextField
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                sx={{ gridColumn: { sm: 'span 2' } }}
              />
            </Box>

            <Typography variant="h6" sx={{ mb: 3, mt: 5, color: 'text.secondary' }}>
              Bank Account Information
            </Typography>
            
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <TextField
                name="bankName"
                label="Bank Name"
                placeholder="e.g. Khan Bank"
                value={formData.bankAccount.bankName}
                onChange={(e) => handleBankAccountChange('bankName', e.target.value)}
              />
              <TextField
                name="accountNumber"
                label="Account Number"
                value={formData.bankAccount.accountNumber}
                onChange={(e) => handleBankAccountChange('accountNumber', e.target.value)}
              />
              <TextField
                name="accountName"
                label="Account Name"
                value={formData.bankAccount.accountName}
                onChange={(e) => handleBankAccountChange('accountName', e.target.value)}
                sx={{ gridColumn: { sm: 'span 2' } }}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={saving} onClick={handleSave}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Box>
      )}

      {currentTab === 'billing' && <BillingView />}

      {currentTab === 'notifications' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Notification Settings
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Notification settings coming soon...
          </Typography>
        </Card>
      )}
    </Container>
  );
}
