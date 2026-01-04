'use client';

import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import Logo from 'src/components/logo';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import TermsPrivacyDialog from 'src/components/dialog/terms-privacy-dialog';

// ----------------------------------------------------------------------

export default function LoginCoverView() {
  const theme = useTheme();
  const passwordShow = useBoolean();
  const termsDialogOpen = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const [organizationLogo, setOrganizationLogo] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState<string>('');

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        // Fetch Logo
        const logoResponse = await fetch('/api2/organizations/logo');
        if (logoResponse.ok) {
          const logoResult = await logoResponse.json();
          if (logoResult.success && logoResult.data?.logo) {
            setOrganizationLogo(logoResult.data.logo);
          }
        }

        // Fetch License/Name
        const licenseResponse = await fetch('/api2/organizations/license');
        if (licenseResponse.ok) {
          const licenseResult = await licenseResponse.json();
          if (licenseResult.success && licenseResult.data?.displayName) {
            setOrganizationName(licenseResult.data.displayName);
          } else if (licenseResult.success && licenseResult.data?.name) {
            setOrganizationName(licenseResult.data.name);
          }
        }
      } catch (error) {
        console.error('Failed to fetch organization data:', error);
      }
    };

    fetchOrgData();
  }, []);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Имэйл шаардлагатай').email('Хүчинтэй имэйл биш'),
    password: Yup.string()
      .required('Нууц үг шаардлагатай')
      .min(6, 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой'),
  });

  const defaultValues = {
    email: '',
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
      const response = await fetch('/api2/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        reset();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else {
        const errorMessage = result.error || result.message;
        const displayMessage =
          errorMessage === 'Invalid credentials - user not found'
            ? 'Нэвтрэх мэдээлэл буруу эсвэл хэрэглэгч олдсонгүй'
            : errorMessage || 'Нэвтрэхэд алдаа гарлаа';

        enqueueSnackbar(displayMessage, {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar('Сүлжээний алдаа. Дахин оролдоно уу.', { variant: 'error' });
    }
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/assets/images/cover/webt3.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.common.black,
            0.6
          )} 0%, ${alpha(theme.palette.common.black, 0.4)} 50%, ${alpha(
            theme.palette.common.black,
            0.5
          )} 100%)`,
          zIndex: 1,
        },
      }}
    >
      {/* Animated Dots Overlay */}
      <Box
        sx={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.common.white,
            0.08
          )} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          animation: 'moveBackground 30s linear infinite',
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          '@keyframes moveBackground': {
            '0%': {
              transform: 'translate(0, 0)',
            },
            '100%': {
              transform: 'translate(80px, 80px)',
            },
          },
        }}
      />

      {/* Subtle Floating Gradient Circles */}
      <Box
        sx={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.15
          )} 0%, transparent 60%)`,
          top: '-300px',
          right: '-300px',
          animation: 'float 20s ease-in-out infinite',
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translate(0, 0) rotate(0deg)',
            },
            '50%': {
              transform: 'translate(-30px, 30px) rotate(180deg)',
            },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary.main,
            0.12
          )} 0%, transparent 60%)`,
          bottom: '-250px',
          left: '-250px',
          animation: 'floatReverse 25s ease-in-out infinite',
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          '@keyframes floatReverse': {
            '0%, 100%': {
              transform: 'translate(0, 0) rotate(0deg)',
            },
            '50%': {
              transform: 'translate(25px, -25px) rotate(-180deg)',
            },
          },
        }}
      />
      {/* Left Side - Hero Content */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: '1 1 55%',
          p: 8,
          zIndex: 3,
          position: 'relative',
        }}
      >
        <Link
          component={RouterLink}
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4,
            textDecoration: 'none',
            '&:hover': {
              opacity: 0.8,
            },
            transition: 'opacity 0.2s ease',
          }}
        >
          <Box
            sx={{
              p: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {organizationLogo ? (
              <Box
                component="img"
                src={organizationLogo}
                alt="Logo"
                sx={{ width: 48, height: 48, borderRadius: '12px', objectFit: 'cover' }}
              />
            ) : (
              <Logo sx={{ width: 48, filter: 'brightness(0) invert(1)' }} />
            )}
          </Box>
          <Typography variant="h5" sx={{ color: 'common.white', fontWeight: 800, letterSpacing: -1 }}>
            {organizationName || 'Байгууллагын нэр'}
          </Typography>
        </Link>

        <Box sx={{ maxWidth: 700 }}>
          <Typography
            variant="h1"
            sx={{
              color: 'common.white',
              fontWeight: 900,
              fontSize: { lg: '4.5rem', xl: '5.5rem' },
              lineHeight: 1,
              mb: 3,
              letterSpacing: -2,
            }}
          >
            Унших бүрт <br />
            <Box component="span" sx={{ 
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>шинэ ертөнц</Box>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: alpha('#fff', 0.6),
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: 500,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              pl: 3,
            }}
          >
            Монголын хамгийн том вебтүүн платформд нэгдэж, адал явдалаар дүүрэн ертөнцөөр аялаарай.
          </Typography>
        </Box>

        <Box>
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.3) }}>
              © 2026 Webix
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: alpha('#fff', 0.2) }} />
            <Link
              component={RouterLink}
              href={paths.support}
              sx={{
                color: alpha('#fff', 0.5),
                fontSize: '0.75rem',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Тусламж
            </Link>
            <Link
              component="button"
              onClick={termsDialogOpen.onTrue}
              sx={{
                color: alpha('#fff', 0.5),
                fontSize: '0.75rem',
                textDecoration: 'none',
                cursor: 'pointer',
                border: 'none',
                bgcolor: 'transparent',
                p: 0,
                '&:hover': { color: 'primary.main' },
              }}
            >
              Нууцлал
            </Link>
          </Stack>
        </Box>
      </Box>

      {/* Right Side - Form Container */}
      <Box
        sx={{
          width: { xs: '100%', lg: '45%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 3,
          p: { xs: 2, md: 4, lg: 6 },
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            p: '40px',
            borderRadius: '16px', // Slightly softer rounding for modern look
            bgcolor: 'transparent',
            backgroundClip: 'padding-box',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Stack spacing={4}>
            {/* Header */}
            <Stack spacing={1} alignItems="center">
              <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 2 }}>
                {organizationLogo ? (
                  <Link
                    component={RouterLink}
                    href="/"
                    sx={{ display: 'inline-flex' }}
                  >
                    <Box
                      component="img"
                      src={organizationLogo}
                      alt="Logo"
                      sx={{ width: 48, height: 48, borderRadius: '12px', objectFit: 'cover' }}
                    />
                  </Link>
                ) : (
                  <Logo />
                )}
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: 'common.white',
                  textAlign: 'center',
                }}
              >
                Нэвтрэх
              </Typography>
            </Stack>

            {/* Login Form */}
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Stack spacing={3}>
                <RHFTextField
                  name="email"
                  label="Имэйл хаяг"
                  placeholder="name@example.com"
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:before': {
                      borderBottomColor: alpha(theme.palette.common.white, 0.5),
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: 'common.white',
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                      borderBottomColor: 'common.white',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'common.white',
                      '&.Mui-focused': {
                        color: 'common.white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'common.white',
                      '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 100px transparent inset !important',
                        WebkitTextFillColor: '#fff !important',
                        transition: 'background-color 5000s ease-in-out 0s',
                      },
                    },
                  }}
                />

                <RHFTextField
                  name="password"
                  label="Нууц үг"
                  type={passwordShow.value ? 'text' : 'password'}
                  placeholder="••••••••"
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:before': {
                      borderBottomColor: alpha(theme.palette.common.white, 0.5),
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: 'common.white',
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                      borderBottomColor: 'common.white',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'common.white',
                      '&.Mui-focused': {
                        color: 'common.white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'common.white',
                      '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 100px transparent inset !important',
                        WebkitTextFillColor: '#fff !important',
                        transition: 'background-color 5000s ease-in-out 0s',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={passwordShow.onToggle}
                          edge="end"
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'primary.main',
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Iconify icon={passwordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  <Link
                    component={RouterLink}
                    href={paths.forgotPassword}
                    variant="body2"
                    underline="hover"
                    sx={{
                      color: alpha(theme.palette.common.white, 0.7),
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'common.white',
                      },
                      transition: 'color 0.2s ease',
                    }}
                  >
                    Нууц үгээ мартсан уу?
                  </Link>
                </Stack>

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{
                    py: '12px',
                    px: '20px',
                    borderRadius: '100px',
                    fontWeight: 600,
                    fontSize: '16px',
                    textTransform: 'none',
                    bgcolor: 'common.white',
                    color: 'common.black',
                    border: '2px solid transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      color: 'common.white',
                      borderColor: 'common.white',
                    },
                    transition: '0.3s ease',
                  }}
                >
                  Нэвтрэх
                </LoadingButton>

                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color: alpha(theme.palette.common.white, 0.7),
                    mt: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Бүртгэл байхгүй юу?{' '}
                  <Link
                    component={RouterLink}
                    href={paths.registerCover}
                    sx={{
                      color: 'common.white',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  >
                    Бүртгүүлэх
                  </Link>
                </Typography>
              </Stack>
            </FormProvider>
          </Stack>
        </Card>
      </Box>

      {/* Terms and Privacy Dialog */}
      <TermsPrivacyDialog
        open={termsDialogOpen.value}
        onClose={termsDialogOpen.onFalse}
        onAccept={termsDialogOpen.onFalse}
      />
    </Box>
  );
}
