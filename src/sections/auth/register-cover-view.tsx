'use client';

import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
import TermsPrivacyDialog from 'src/components/dialog/terms-privacy-dialog';

// ----------------------------------------------------------------------

export default function RegisterCoverView() {
  const theme = useTheme();
  const passwordShow = useBoolean();
  const termsDialogOpen = useBoolean();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .required('Нэр шаардлагатай')
      .min(2, 'Хамгийн багадаа 2 тэмдэгт')
      .max(50, 'Хамгийн ихдээ 50 тэмдэгт'),
    email: Yup.string().required('Имэйл шаардлагатай').email('Хүчинтэй имэйл биш'),
    password: Yup.string()
      .required('Нууц үг шаардлагатай')
      .min(6, 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой'),
    confirmPassword: Yup.string()
      .required('Нууц үгээ баталгаажуулах шаардлагатай')
      .oneOf([Yup.ref('password')], 'Нууц үг таарахгүй байна'),
  });

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    termsDialogOpen.onFalse();
  };

  const handleCancelTerms = () => {
    setTermsAccepted(false);
    termsDialogOpen.onFalse();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!termsAccepted) {
      termsDialogOpen.onTrue();
      return;
    }

    try {
      const response = await fetch('/api2/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: 'user',
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
        setTermsAccepted(false);
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else {
        console.error('Бүртгэлд алдаа:', result.error || result.message);
        alert(result.error || result.message || 'Бүртгэлд алдаа гарлаа');
      }
    } catch (error) {
      console.error('Бүртгэл алдаа:', error);
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
          backgroundImage: 'url(/assets/images/cover/webt1.jpg)',
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
            theme.palette.secondary.main,
            0.15
          )} 0%, transparent 60%)`,
          bottom: '-300px',
          left: '-300px',
          animation: 'float 20s ease-in-out infinite',
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translate(0, 0) rotate(0deg)',
            },
            '50%': {
              transform: 'translate(30px, -30px) rotate(180deg)',
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
            theme.palette.primary.main,
            0.12
          )} 0%, transparent 60%)`,
          top: '-250px',
          right: '-250px',
          animation: 'floatReverse 25s ease-in-out infinite',
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          '@keyframes floatReverse': {
            '0%, 100%': {
              transform: 'translate(0, 0) rotate(0deg)',
            },
            '50%': {
              transform: 'translate(-25px, 25px) rotate(-180deg)',
            },
          },
        }}
      />
      {/* Left Side - Form */}
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
            maxWidth: 520,
            maxHeight: { xs: 'calc(100vh - 32px)', sm: 'calc(100vh - 48px)' },
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.3)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            },
          }}
        >
          <Box
            sx={{
              overflow: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha(theme.palette.grey[500], 0.2),
                borderRadius: '3px',
                '&:hover': {
                  background: alpha(theme.palette.grey[500], 0.3),
                },
              },
            }}
          >
            <Stack spacing={{ xs: 3, sm: 4 }} sx={{ flex: 1, minHeight: 0 }}>
              {/* Header */}
              <Stack spacing={1} alignItems="center">
                <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 1 }}>
                  <Logo />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                  }}
                >
                  Бүртгэл үүсгэх
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  Шинэ бүртгэл үүсгэж эхлэх
                </Typography>
              </Stack>

              {/* Register Form */}
              <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack spacing={2.5}>
                  <RHFTextField
                    name="name"
                    label="Бүтэн нэр"
                    placeholder="Жон Доу"
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
                            <Iconify
                              icon={passwordShow.value ? 'carbon:view' : 'carbon:view-off'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <RHFTextField
                    name="confirmPassword"
                    label="Нууц үг баталгаажуулах"
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
                            <Iconify
                              icon={passwordShow.value ? 'carbon:view' : 'carbon:view-off'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    variant={termsAccepted ? 'outlined' : 'text'}
                    color={termsAccepted ? 'success' : 'primary'}
                    onClick={termsDialogOpen.onTrue}
                    startIcon={
                      termsAccepted ? (
                        <Iconify icon="solar:check-circle-bold" />
                      ) : (
                        <Iconify icon="solar:document-text-bold" />
                      )
                    }
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderColor: termsAccepted ? 'success.main' : 'divider',
                      bgcolor: termsAccepted
                        ? alpha(theme.palette.success.main, 0.08)
                        : 'transparent',
                      '&:hover': {
                        bgcolor: termsAccepted
                          ? alpha(theme.palette.success.main, 0.12)
                          : alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: termsAccepted ? 'success.main' : 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        textAlign: 'left',
                      }}
                    >
                      {termsAccepted
                        ? 'Үйлчилгээний нөхцөл болон Нууцлалын бодлогод зөвшөөрсөн'
                        : 'Үйлчилгээний нөхцөл болон Нууцлалын бодлого унших'}
                    </Typography>
                  </Button>

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
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
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
                    Бүртгэл үүсгэх
                  </LoadingButton>

                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      color: 'text.secondary',
                      mt: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Аль хэдийн бүртгэлтэй юу?{' '}
                    <Link
                      component={RouterLink}
                      href={paths.loginCover}
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Нэвтрэх
                    </Link>
                  </Typography>
                </Stack>
              </FormProvider>
            </Stack>
          </Box>
        </Card>
      </Box>

      {/* Right Side - Visual */}
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
            <Iconify
              icon="carbon:user-multiple"
              sx={{
                width: 100,
                height: 100,
                color: 'common.white',
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
              }}
            />
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
            Бүртгэл үүсгэх
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
            Шинэ бүртгэл үүсгэж, аялал эхлүүлэх
          </Typography>
        </Stack>
      </Box>

      {/* Terms and Privacy Dialog */}
      <TermsPrivacyDialog
        open={termsDialogOpen.value}
        onClose={handleCancelTerms}
        onAccept={handleAcceptTerms}
      />
    </Box>
  );
}
