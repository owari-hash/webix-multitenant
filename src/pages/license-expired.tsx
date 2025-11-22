import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import Iconify from 'src/components/iconify';

const LicenseExpiredPage = () => (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Iconify icon="solar:sad-circle-bold" sx={{ fontSize: 80, color: 'error.main', width: 80, height: 80 }} />
        </Box>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
          License Expired
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          This organization&apos;s subscription has expired or is inactive. 
          Please contact the administrator or renew the subscription to continue accessing this service.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </Paper>
    </Container>
);

export default LicenseExpiredPage;
