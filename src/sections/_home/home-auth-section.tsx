'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import LoginCoverView from 'src/sections/auth/login-cover-view';
import RegisterCoverView from 'src/sections/auth/register-cover-view';

// ----------------------------------------------------------------------

export default function HomeAuthSection() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleOpenLogin = useCallback(() => {
    setLoginOpen(true);
    setRegisterOpen(false);
  }, []);

  const handleCloseLogin = useCallback(() => {
    setLoginOpen(false);
  }, []);

  const handleOpenRegister = useCallback(() => {
    setRegisterOpen(true);
    setLoginOpen(false);
  }, []);

  const handleCloseRegister = useCallback(() => {
    setRegisterOpen(false);
  }, []);

  const handleSwitchToRegister = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(true);
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setRegisterOpen(false);
    setLoginOpen(true);
  }, []);

  return (
    <>
      <Container>
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleOpenLogin}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Нэвтрэх
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleOpenRegister}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Бүртгүүлэх
          </Button>
        </Box>
      </Container>

      {/* Login Dialog */}
      <Dialog
        open={loginOpen}
        onClose={handleCloseLogin}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            p: 3,
          },
        }}
      >
        <IconButton
          onClick={handleCloseLogin}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
          }}
        >
          <Iconify icon="carbon:close" />
        </IconButton>
        <LoginCoverView />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`Don't have an account? `}
            <Button variant="text" onClick={handleSwitchToRegister} sx={{ p: 0, minWidth: 'auto' }}>
              Get started
            </Button>
          </Typography>
        </Box>
      </Dialog>

      {/* Register Dialog */}
      <Dialog
        open={registerOpen}
        onClose={handleCloseRegister}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            p: 3,
          },
        }}
      >
        <IconButton
          onClick={handleCloseRegister}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
          }}
        >
          <Iconify icon="carbon:close" />
        </IconButton>
        <RegisterCoverView />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`Already have an account? `}
            <Button variant="text" onClick={handleSwitchToLogin} sx={{ p: 0, minWidth: 'auto' }}>
              Login
            </Button>
          </Typography>
        </Box>
      </Dialog>
    </>
  );
}
