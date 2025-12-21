'use client';

import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
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

// ----------------------------------------------------------------------

export default function LoginCoverView() {
  const theme = useTheme();
  const passwordShow = useBoolean();
  const [organizationLogo, setOrganizationLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationLogo = async () => {
      try {
        const response = await fetch('/api2/organizations/logo', {
          method: 'GET',
        });

        if (!response.ok) {
          console.error('Failed to fetch logo:', response.status);
          return;
        }

        const result = await response.json();

        // API returns: { success: true, data: { logo: "data:image/png;base64,..." } }
        if (result.success && result.data?.logo) {
          const logoUrl = result.data.logo;

          // Logo is already a complete data URI, use it directly
          if (typeof logoUrl === 'string' && logoUrl.startsWith('data:')) {
            console.log(
              'Setting logo URL, length:',
              logoUrl.length,
              'First 100 chars:',
              logoUrl.substring(0, 100)
            );
            setOrganizationLogo(logoUrl);
          } else {
            console.log(
              'Logo URL is not a valid data URI:',
              typeof logoUrl,
              logoUrl?.substring(0, 50)
            );
          }
        } else {
          console.log('No logo in response:', result);
        }
      } catch (error) {
        console.error('Failed to fetch organization logo:', error);
      }
    };

    fetchOrganizationLogo();
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
        console.error('Нэвтрэхэд алдаа:', result.error || result.message);
        alert(result.error || result.message || 'Нэвтрэхэд алдаа гарлаа');
      }
    } catch (error) {
      console.error('Нэвтрэх алдаа:', error);
      alert('Сүлжээний алдаа. Дахин оролдоно уу.');
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
      {/* Left Side - Visual */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: 1,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 3,
        }}
      >
        <Stack spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.common.white,
                0.2
              )} 0%, ${alpha(theme.palette.common.white, 0.05)} 100%)`,
              backdropFilter: 'blur(20px)',
              border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 3s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
                '50%': {
                  transform: 'scale(1.1)',
                  opacity: 0.8,
                },
              },
            }}
          >
            {organizationLogo ? (
              <Box
                component="img"
                src={organizationLogo}
                alt="Organization Logo"
                onError={(e) => {
                  console.error('Logo image failed to load:', e);
                  setOrganizationLogo(null);
                }}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  console.log('Logo image loaded successfully', {
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    width: img.width,
                    height: img.height,
                    srcLength: img.src.length,
                    complete: img.complete,
                  });
                  // Check if image has content by creating a canvas
                  const canvas = document.createElement('canvas');
                  canvas.width = img.naturalWidth;
                  canvas.height = img.naturalHeight;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const hasContent = imageData.data.some(
                      (pixel, index) => index % 4 === 3 && pixel > 0
                    );
                    console.log('Image has content:', hasContent);
                  }
                }}
                sx={{
                  width: 240,
                  height: 240,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '50%',
                }}
              />
            ) : (
              <Logo sx={{ width: 120, filter: 'brightness(0) invert(1)' }} />
            )}
          </Box>
          <Typography
            variant="h2"
            sx={{
              color: 'common.white',
              fontWeight: 900,
              textAlign: 'center',
              textShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.3)}`,
              px: 4,
            }}
          >
            Сайн байна уу
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              textAlign: 'center',
              fontWeight: 400,
              px: 4,
            }}
          >
            Бүртгэлдээ нэвтэрж, үргэлжлүүлэх
          </Typography>
        </Stack>
      </Box>

      {/* Right Side - Form */}
      <Box
        sx={{
          width: { xs: '100%', lg: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 3,
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 4 },
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 480,
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.3)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            },
          }}
        >
          <Stack spacing={4}>
            {/* Header */}
            <Stack spacing={1} alignItems="center">
              <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 2 }}>
                <Logo />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                }}
              >
                Нэвтрэх
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Бүртгэлдээ нэвтрэх
              </Typography>
            </Stack>

            {/* Login Form */}
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Stack spacing={3}>
                <RHFTextField
                  name="email"
                  label="Имэйл хаяг"
                  placeholder="name@example.com"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.grey[500], 0.04),
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: alpha(theme.palette.grey[500], 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                      },
                      '&.Mui-focused': {
                        bgcolor: 'background.paper',
                        '& fieldset': {
                          borderWidth: 2,
                          borderColor: theme.palette.primary.main,
                        },
                        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                    },
                  }}
                />

                <RHFTextField
                  name="password"
                  label="Нууц үг"
                  type={passwordShow.value ? 'text' : 'password'}
                  placeholder="••••••••"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.grey[500], 0.04),
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: alpha(theme.palette.grey[500], 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                      },
                      '&.Mui-focused': {
                        bgcolor: 'background.paper',
                        '& fieldset': {
                          borderWidth: 2,
                          borderColor: theme.palette.primary.main,
                        },
                        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
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
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'primary.main',
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
                    py: 1.75,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Нэвтрэх
                </LoadingButton>

                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 1 }}>
                  Бүртгэл байхгүй юу?{' '}
                  <Link
                    component={RouterLink}
                    href={paths.registerCover}
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
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
    </Box>
  );
}
