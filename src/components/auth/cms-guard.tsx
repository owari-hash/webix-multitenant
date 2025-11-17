'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function CMSGuard({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          console.log('No token found, redirecting to login...');
          router.replace('/auth/login');
          return;
        }

        // Decode token to check role (simple JWT decode)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('User payload:', payload);

        // Check if user is admin
        if (payload.role !== 'admin') {
          console.log('User is not admin, redirecting to home...');
          router.replace(paths.webtoon.root);
          return;
        }

        // User is authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/auth/login');
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body2" color="text.secondary">
          Эрх шалгаж байна...
        </Typography>
      </Box>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

