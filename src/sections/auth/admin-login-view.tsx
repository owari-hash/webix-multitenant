'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha, useTheme } from '@mui/material/styles';

import Logo from 'src/components/logo';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AdminLoginView() {
  const theme = useTheme();
  const passwordShow = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');

  const LoginSchema = Yup.object().shape({
    emailOrUsername: Yup.string().required('Имэйл эсвэл хэрэглэгчийн нэр оруулна уу'),
    password: Yup.string()
      .required('Нууц үг оруулна уу')
      .min(6, 'Нууц үг багадаа 6 тэмдэгт байх ёстой'),
  });

  const defaultValues = {
    emailOrUsername: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      
      // Determine if input is email or username
      const isEmail = data.emailOrUsername.includes('@');
      const loginPayload = isEmail
        ? { email: data.emailOrUsername, password: data.password }
        : { username: data.emailOrUsername, password: data.password };

      const response = await fetch('/api2/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });

      const result = await response.json();

      if (result.success) {
        // Check if user has admin role
        if (result.user?.role !== 'admin') {
          setErrorMsg('Та админ эрхгүй байна. Зөвхөн админ хэрэглэгчид нэвтрэх боломжтой.');
          return;
        }

        // Store auth token
        if (result.token) {
          localStorage.setItem('adminToken', result.token);
          localStorage.setItem('token', result.token); // Also store as regular token for API calls
        }
        // Store admin user data
        if (result.user) {
          localStorage.setItem('adminUser', JSON.stringify(result.user));
          localStorage.setItem('user', JSON.stringify(result.user)); // Also store as regular user
        }
        reset();
        // Redirect to admin dashboard
        if (typeof window !== 'undefined') {
          window.location.href = paths.webtoon.cms.dashboard;
        }
      } else {
        setErrorMsg(result.error || result.message || 'Нэвтрэх амжилтгүй');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setErrorMsg('Сүлжээний алдаа. Дахин оролдоно уу.');
    }
  });

  const renderHead = (
    <Stack
      sx={{
        pb: 4,
        pt: { xs: 5, md: 8 },
        textAlign: 'center',
      }}
    >
      {/* Admin Badge */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.error.main, 0.12),
          mx: 'auto',
          mb: 3,
        }}
      >
        <Iconify
          icon="carbon:user-admin"
          sx={{
            fontSize: 40,
            color: theme.palette.error.main,
          }}
        />
      </Box>

      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        Админ нэвтрэх
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        CMS удирдлагын хяналтын самбар руу нэвтрэх
      </Typography>
    </Stack>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <RHFTextField
          name="emailOrUsername"
          label="Имэйл эсвэл Хэрэглэгчийн нэр"
          placeholder="admintest эсвэл admin@example.com"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="carbon:user" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="password"
          label="Нууц үг"
          type={passwordShow.value ? 'text' : 'password'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="carbon:locked" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify icon={passwordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Link
            component={RouterLink}
            href={paths.forgotPassword}
            variant="body2"
            underline="always"
            color="text.secondary"
          >
            Нууц үгээ мартсан?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{
            bgcolor: theme.palette.error.main,
            color: 'common.white',
            '&:hover': {
              bgcolor: theme.palette.error.dark,
            },
          }}
        >
          Нэвтрэх
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  const renderWarning = (
    <Alert
      severity="warning"
      icon={<Iconify icon="carbon:warning" />}
      sx={{
        mt: 3,
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
        Зөвхөн админуудад зориулсан
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Энэ хуудас нь зөвхөн админ хэрэглэгчдэд зориулагдсан. Хэрэв та энгийн хэрэглэгч бол{' '}
        <Link component={RouterLink} href={paths.loginCover} underline="always">
          энд дарж нэвтрэнэ үү
        </Link>
      </Typography>
    </Alert>
  );

  const renderBackButton = (
    <Button
      component={RouterLink}
      href="/"
      startIcon={<Iconify icon="carbon:arrow-left" />}
      sx={{
        mt: 2,
        color: 'text.secondary',
      }}
    >
      Нүүр хуудас руу буцах
    </Button>
  );

  return (
    <>
      <Logo />

      {renderHead}

      {renderForm}

      {renderWarning}

      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          Аюулгүй нэвтрэлт
        </Typography>
      </Divider>

      <Stack spacing={1} alignItems="center">
        <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center' }}>
          🔒 Таны мэдээлэл хамгаалагдсан байна
        </Typography>

        {renderBackButton}
      </Stack>
    </>
  );
}

