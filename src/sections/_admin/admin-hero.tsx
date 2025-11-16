import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { HEADER } from 'src/layouts/config-layout';
import { MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const HERO_IMAGES = [
  '/assets/images/hero/hero-admin-1.jpg',
  '/assets/images/hero/hero-admin-2.jpg',
  '/assets/images/hero/hero-admin-3.jpg',
];

export default function AdminHero() {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      component={MotionViewport}
      sx={{
        position: 'relative',
        height: {
          xs: '60vh',
          md: `calc(60vh - ${HEADER.H_DESKTOP}px)`,
        },
        minHeight: { xs: '500px', md: '400px' },
        overflow: 'hidden',
        backgroundColor: 'common.black',
      }}
    >
      {/* Background with Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          background: `linear-gradient(135deg,
            ${alpha(theme.palette.primary.dark, 0.8)} 0%,
            ${alpha(theme.palette.secondary.dark, 0.8)} 50%,
            ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
        }}
      />

      {/* Pattern Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            ${alpha(theme.palette.common.white, 0.03)} 35px,
            ${alpha(theme.palette.common.white, 0.03)} 70px
          )`,
        }}
      />

      <Container
        sx={{
          height: 1,
          position: 'relative',
          zIndex: 3,
          px: { xs: 2, sm: 3, md: 3 },
        }}
      >
        <Box
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Stack
            spacing={{ xs: 3, md: 4 }}
            sx={{
              maxWidth: { xs: '100%', md: '70%' },
              textAlign: { xs: 'center', md: 'left' },
              width: '100%',
            }}
          >
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                  fontWeight: 900,
                  lineHeight: 1.2,
                  color: 'common.white',
                  mb: { xs: 1, md: 2 },
                  textShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.5)}`,
                }}
              >
                CMS Удирдлагын
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: `linear-gradient(135deg,
                      ${theme.palette.warning.light} 0%,
                      ${theme.palette.error.light} 50%,
                      ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Хяналтын самбар
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: alpha(theme.palette.common.white, 0.95),
                  maxWidth: { xs: '100%', md: 600 },
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                  textShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.4)}`,
                }}
              >
                Веб комикуудын контентыг удирдах, хэрэглэгчдийг хянах, статистик шинжлэх
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, md: 2 }}
              sx={{
                alignItems: { xs: 'stretch', sm: 'flex-start' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<Iconify icon="carbon:add" />}
                href={paths.webtoon.cms.createComic}
                sx={{
                  px: { xs: 4, md: 5 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 700,
                  borderRadius: 2,
                  width: { xs: '100%', sm: 'auto' },
                  bgcolor: theme.palette.warning.main,
                  color: theme.palette.common.white,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.warning.main, 0.4)}`,
                  '&:hover': {
                    bgcolor: theme.palette.warning.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.warning.main, 0.5)}`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Шинэ комик нэмэх
              </Button>

              <Button
                variant="outlined"
                size="large"
                endIcon={<Iconify icon="carbon:analytics" />}
                sx={{
                  px: { xs: 4, md: 5 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 600,
                  borderRadius: 2,
                  width: { xs: '100%', sm: 'auto' },
                  color: 'common.white',
                  borderColor: alpha(theme.palette.common.white, 0.5),
                  borderWidth: 2,
                  backdropFilter: 'blur(20px)',
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    borderColor: theme.palette.common.white,
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Статистик үзэх
              </Button>
            </Stack>

            {/* Quick Stats */}
            <Stack
              direction={{ xs: 'row', sm: 'row' }}
              spacing={{ xs: 2, md: 4 }}
              sx={{
                pt: { xs: 2, md: 3 },
                justifyContent: { xs: 'space-around', md: 'flex-start' },
              }}
            >
              {[
                { label: 'Нийт комик', value: '156', icon: 'carbon:book' },
                { label: 'Хэрэглэгч', value: '12.5K', icon: 'carbon:user-multiple' },
                { label: 'Өнөөдрийн үзэлт', value: '45.2K', icon: 'carbon:view' },
              ].map((stat) => (
                <Box key={stat.label} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={stat.icon}
                      sx={{
                        color: theme.palette.warning.light,
                        fontSize: { xs: 18, md: 22 },
                      }}
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'common.white',
                        fontWeight: 800,
                        fontSize: { xs: '1.1rem', md: '1.75rem' },
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      color: alpha(theme.palette.common.white, 0.8),
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      fontSize: { xs: '0.65rem', md: '0.75rem' },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
