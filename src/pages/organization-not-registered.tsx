'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';

const OrganizationNotRegisteredPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(
          theme.palette.error.main,
          0.04
        )} 50%, ${alpha(theme.palette.warning.main, 0.06)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 3, sm: 5 },
        px: 2,
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: { xs: 300, sm: 500 },
          height: { xs: 300, sm: 500 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.error.main,
            0.15
          )} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          zIndex: 0,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '50%': { transform: 'translate(-20px, 20px) scale(1.1)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: { xs: 350, sm: 600 },
          height: { xs: 350, sm: 600 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.warning.main,
            0.12
          )} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          zIndex: 0,
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            textAlign: 'center',
            p: { xs: 2.5, sm: 3, md: 3.5 },
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.98
            )} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: 'blur(30px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.12)}, 0 0 0 1px ${alpha(
              theme.palette.primary.main,
              0.05
            )}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
            },
          }}
        >
          {/* Icon with enhanced animation */}
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
              mb: { xs: 2, sm: 2.5 },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: 70, sm: 90, md: 100 },
                height: { xs: 70, sm: 90, md: 100 },
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.error.main,
                  0.12
                )} 0%, ${alpha(theme.palette.warning.main, 0.12)} 100%)`,
                animation: 'pulse 2.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 0.7,
                  },
                  '50%': {
                    transform: 'translate(-50%, -50%) scale(1.15)',
                    opacity: 0.9,
                  },
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: 50, sm: 65, md: 70 },
                height: { xs: 50, sm: 65, md: 70 },
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.error.main,
                  0.08
                )} 0%, ${alpha(theme.palette.warning.main, 0.08)} 100%)`,
                animation: 'pulse 2s ease-in-out infinite',
                animationDelay: '0.5s',
              }}
            />
            <Iconify
              icon="solar:shield-cross-bold"
              sx={{
                fontSize: { xs: 40, sm: 50, md: 56 },
                color: 'error.main',
                width: { xs: 40, sm: 50, md: 56 },
                height: { xs: 40, sm: 50, md: 56 },
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              }}
            />
          </Box>

          <Stack spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: { xs: 0.75, sm: 1 },
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Бүртгэлгүй байгууллага байна
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 400,
                  maxWidth: { xs: '100%', sm: 500 },
                  mx: 'auto',
                  lineHeight: 1.5,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 0 },
                }}
              >
                Уучлаарай, энэ дэд домэйн дээр бүртгэлтэй байгууллага олдсонгүй. Системд нэвтрэхийн
                тулд эхлээд байгууллагаа бүртгүүлэх шаардлагатай.
              </Typography>
            </Box>

            <Divider
              sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400 }, my: { xs: 0.5, sm: 1 } }}
            />

            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: 550 },
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.06),
                border: `1.5px solid ${alpha(theme.palette.info.main, 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.info.main,
                  0.05
                )} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
              }}
            >
              <Stack spacing={{ xs: 2, sm: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: { xs: 1.5, sm: 2 },
                    textAlign: 'left',
                  }}
                >
                  <Box
                    sx={{
                      minWidth: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.info.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify
                      icon="solar:document-add-bold"
                      sx={{
                        color: 'info.main',
                        width: { xs: 18, sm: 20 },
                        height: { xs: 18, sm: 20 },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.25,
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      }}
                    >
                      Бүртгэл үүсгэх
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.5,
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      }}
                    >
                      Шинэ байгууллага бүртгүүлэхийн тулд системийн админтай холбогдох эсвэл
                      бүртгэлийн хэсэг рүү очино уу.
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: { xs: 1.5, sm: 2 },
                    textAlign: 'left',
                  }}
                >
                  <Box
                    sx={{
                      minWidth: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify
                      icon="solar:phone-calling-bold"
                      sx={{
                        color: 'primary.main',
                        width: { xs: 18, sm: 20 },
                        height: { xs: 18, sm: 20 },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.25,
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      }}
                    >
                      Тусламж авах
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.5,
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      }}
                    >
                      Асуулт, санал хүсэлтээ илгээх:{' '}
                      <Box
                        component="a"
                        href="mailto:support@webix.mn"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        support@webix.mn
                      </Box>
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 2 }}
              sx={{ mt: { xs: 1.5, sm: 2 }, width: '100%', maxWidth: { xs: '100%', sm: 500 } }}
            >
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                fullWidth
                startIcon={<Iconify icon="solar:home-bold" />}
                onClick={() => (window.location.href = '/')}
                sx={{
                  borderRadius: 1.5,
                  py: { xs: 1, sm: 1.125 },
                  borderWidth: 1.5,
                  fontWeight: 600,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  '&:hover': {
                    borderWidth: 1.5,
                    bgcolor: alpha(theme.palette.text.primary, 0.04),
                  },
                }}
              >
                Нүүр хуудас
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                fullWidth
                startIcon={<Iconify icon="solar:login-3-bold" />}
                onClick={() => {
                  // Redirect to main domain or registration page
                  const hostname = window.location.hostname;
                  const parts = hostname.split('.');
                  if (parts.length > 2) {
                    // Remove subdomain
                    const mainDomain = parts.slice(-2).join('.');
                    window.location.href = `https://${mainDomain}`;
                  } else {
                    window.location.href = '/';
                  }
                }}
                sx={{
                  borderRadius: 1.5,
                  py: { xs: 1, sm: 1.125 },
                  fontWeight: 600,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  boxShadow: `0 3px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Бүртгэл үүсгэх
              </Button>
            </Stack>

            <Typography
              variant="caption"
              sx={{
                color: 'text.disabled',
                mt: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.625rem', sm: '0.6875rem' },
                textAlign: 'center',
                px: { xs: 1.5, sm: 0 },
              }}
            >
              Зөвхөн бүртгэлтэй байгууллагууд системд нэвтрэх боломжтой.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default OrganizationNotRegisteredPage;
