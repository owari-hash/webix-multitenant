import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { _featuredWebtoons } from 'src/_mock';
import { HEADER } from 'src/layouts/config-layout';
import { MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeWebtoonHero() {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // Rotate between 3 images only
    }, 8000); // Increased delay from 5s to 8s for slower rotation
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      component={MotionViewport}
      sx={{
        position: 'relative',
        height: {
          xs: '100vh', // Full viewport on mobile
          md: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
        },
        minHeight: { xs: '100vh', md: 'auto' },
        overflow: 'hidden',
        backgroundColor: 'common.black', // Simple black fallback
      }}
    >
      {/* Background Carousel */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        {_featuredWebtoons.length > 0
          ? _featuredWebtoons.slice(0, 3).map((webtoon, index) => {
              // Korean manhwa style gradient colors - more subtle
              const gradientColors = [
                // Slide 0: Vibrant Purple to Pink (Romance/Fantasy manhwa style)
                [
                  alpha('#9B59B6', 0.4), // Vibrant purple - reduced opacity
                  alpha('#E91E63', 0.35), // Hot pink - reduced opacity
                  alpha('#FF6B9D', 0.3), // Soft pink - reduced opacity
                ],
                // Slide 1: Electric Blue to Cyan (Action/Sci-fi manhwa style)
                [
                  alpha('#2196F3', 0.4), // Electric blue - reduced opacity
                  alpha('#00BCD4', 0.35), // Cyan - reduced opacity
                  alpha('#4FC3F7', 0.3), // Light blue - reduced opacity
                ],
                // Slide 2: Warm Orange to Red (Action/Drama manhwa style)
                [
                  alpha('#FF9800', 0.4), // Vibrant orange - reduced opacity
                  alpha('#F44336', 0.35), // Red - reduced opacity
                  alpha('#FF6B35', 0.3), // Coral red - reduced opacity
                ],
              ];

              return (
                <Box
                  key={webtoon.id}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: currentSlide === index ? 1 : 0,
                    transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: currentSlide === index ? 'scale(1)' : 'scale(1.05)',
                    transformOrigin: 'center',
                  }}
                >
                  <Image
                    alt={webtoon.title}
                    src={webtoon.coverUrl}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: { xs: 'cover', md: 'cover' },
                      objectPosition: { xs: 'center center', md: 'center' },
                      // Korean manhwa style filters: subtle enhancement
                      filter:
                        currentSlide === index
                          ? 'brightness(0.5) saturate(1.2) contrast(1.1)'
                          : 'brightness(0.45) saturate(1.1) contrast(1.05)',
                      transition: 'filter 1.2s ease-in-out',
                      // Enhance manhwa aesthetic with sharper edges
                      imageRendering: 'crisp-edges',
                    }}
                  />
                  {/* Korean manhwa style gradient overlay - subtle */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg,
                    ${gradientColors[index][0]} 0%,
                    ${gradientColors[index][1]} 35%,
                    ${alpha(gradientColors[index][2], 0.5)} 70%,
                    ${alpha(theme.palette.common.black, 0.15)} 100%)`,
                      // Subtle color boost
                      mixBlendMode: 'multiply',
                      opacity: 0.7,
                    }}
                  />
                  {/* Subtle color accent layer */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(ellipse at 20% 30%,
                    ${alpha(gradientColors[index][0], 0.15)} 0%,
                    transparent 60%)`,
                      mixBlendMode: 'screen',
                      opacity: currentSlide === index ? 0.3 : 0.15,
                      transition: 'opacity 1.2s ease-in-out',
                    }}
                  />
                  {/* Additional radial gradient for spotlight effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-50%',
                      left: '20%',
                      width: '60%',
                      height: '200%',
                      background: `radial-gradient(ellipse at center,
                    ${alpha(theme.palette.common.white, 0.15)} 0%,
                    ${alpha(theme.palette.common.white, 0)} 70%)`,
                      opacity: currentSlide === index ? 1 : 0,
                      transition: 'opacity 1.2s ease-in-out',
                    }}
                  />
                  {/* Dark overlay at bottom for text readability */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60%',
                      background: `linear-gradient(to top,
                    ${alpha(theme.palette.common.black, 0.7)} 0%,
                    ${alpha(theme.palette.common.black, 0.3)} 50%,
                    transparent 100%)`,
                    }}
                  />
                </Box>
              );
            })
          : null}
      </Box>

      <Container
        sx={{
          height: 1,
          position: 'relative',
          zIndex: 2,
          px: { xs: 2, sm: 3, md: 3 },
        }}
      >
        <Box
          sx={{
            height: 1,
            display: 'flex',
            alignItems: { xs: 'flex-end', md: 'center' }, // Align to bottom on mobile to show full image
            justifyContent: { xs: 'center', md: 'flex-start' },
            py: { xs: 3, md: 0 },
            pb: { xs: 6, md: 0 }, // Extra padding at bottom on mobile
          }}
        >
          <Stack
            spacing={{ xs: 3, md: 6 }}
            sx={{
              maxWidth: { xs: '100%', md: '60%' },
              textAlign: { xs: 'center', md: 'left' },
              width: '100%',
            }}
          >
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem', lg: '5.5rem' },
                  fontWeight: 900,
                  lineHeight: { xs: 1.2, md: 1.1 },
                  color: 'common.white',
                  mb: { xs: 1, md: 2 },
                  textShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.5)}`,
                  animation: 'fadeInUp 0.8s ease-out',
                  '@keyframes fadeInUp': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(30px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                Түүх бүр
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: `linear-gradient(135deg,
                      ${theme.palette.secondary.light} 0%,
                      ${theme.palette.primary.main} 25%,
                      ${theme.palette.secondary.main} 50%,
                      ${theme.palette.primary.light} 75%,
                      ${theme.palette.error.light} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '300% 300%',
                    animation: 'gradientShift 8s ease-in-out infinite',
                    '@keyframes gradientShift': {
                      '0%': {
                        backgroundPosition: '0% 50%',
                      },
                      '50%': {
                        backgroundPosition: '100% 50%',
                      },
                      '100%': {
                        backgroundPosition: '0% 50%',
                      },
                    },
                    filter: `drop-shadow(0 2px 12px ${alpha(theme.palette.secondary.main, 0.3)})`,
                    transition: 'filter 0.3s ease',
                  }}
                >
                  Зургаар амилна
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'common.white',
                  maxWidth: { xs: '100%', md: 600 },
                  fontWeight: 400,
                  lineHeight: { xs: 1.6, md: 1.7 },
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                  textShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.4)}`,
                  backdropFilter: 'blur(2px)',
                  animation: 'fadeInUp 0.8s ease-out 0.2s both',
                  px: { xs: 1, md: 0 },
                }}
              >
                Гайхамшигт зургууд, сэтгэл хөдөлгөм түүхүүдийн ертөнцөд нэвтрэн, дэлхийн шилдэг
                зурагт номуудыг хүлээн ав!
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, md: 3 }}
              sx={{
                alignItems: { xs: 'stretch', sm: 'flex-start' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<Iconify icon="carbon:play-filled" />}
                sx={{
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2.5 },
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  fontWeight: 700,
                  borderRadius: 3,
                  width: { xs: '100%', sm: 'auto' },
                  background: `linear-gradient(135deg,
                    ${theme.palette.secondary.main} 0%,
                    ${theme.palette.primary.main} 50%,
                    ${theme.palette.secondary.dark} 100%)`,
                  backgroundSize: '200% 200%',
                  boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.4)},
                    0 4px 16px ${alpha(theme.palette.primary.main, 0.3)},
                    inset 0 1px 0 ${alpha(theme.palette.common.white, 0.2)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg,
                      transparent,
                      ${alpha(theme.palette.common.white, 0.3)},
                      transparent)`,
                    transition: 'left 0.5s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: `0 16px 48px ${alpha(theme.palette.secondary.main, 0.5)},
                      0 8px 24px ${alpha(theme.palette.primary.main, 0.4)},
                      inset 0 1px 0 ${alpha(theme.palette.common.white, 0.3)}`,
                    backgroundPosition: '100% 0%',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Уншиж эхлэх
              </Button>

              <Button
                variant="outlined"
                size="large"
                endIcon={<Iconify icon="carbon:bookmark" />}
                sx={{
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2.5 },
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  fontWeight: 600,
                  borderRadius: 3,
                  width: { xs: '100%', sm: 'auto' },
                  color: 'common.white',
                  borderColor: alpha(theme.palette.common.white, 0.4),
                  borderWidth: 2,
                  backdropFilter: 'blur(20px) saturate(180%)',
                  bgcolor: alpha(theme.palette.common.white, 0.12),
                  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)},
                    inset 0 1px 0 ${alpha(theme.palette.common.white, 0.1)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg,
                      ${alpha(theme.palette.secondary.main, 0.1)},
                      ${alpha(theme.palette.primary.main, 0.1)})`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    borderColor: alpha(theme.palette.common.white, 0.8),
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: `0 16px 48px ${alpha(theme.palette.common.black, 0.3)},
                      inset 0 1px 0 ${alpha(theme.palette.common.white, 0.2)}`,
                    '&::before': {
                      opacity: 1,
                    },
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Номын сангаас үзэх
              </Button>
            </Stack>

            {/* Stats */}
            <Stack
              direction={{ xs: 'row', sm: 'row' }}
              spacing={{ xs: 2, md: 4 }}
              sx={{
                pt: { xs: 2, md: 4 },
                position: 'relative',
                justifyContent: { xs: 'space-around', md: 'flex-start' },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: { xs: '5%', md: '10%' },
                  width: { xs: '90%', md: '80%' },
                  height: 1,
                  background: `linear-gradient(90deg,
                    transparent,
                    ${alpha(theme.palette.secondary.main, 0.5)},
                    transparent)`,
                },
              }}
            >
              {[
                {
                  label: 'Webtoons',
                  value: '10K+',
                  icon: 'carbon:book',
                  color: theme.palette.secondary.main,
                },
                {
                  label: 'Readers',
                  value: '2M+',
                  icon: 'carbon:user',
                  color: theme.palette.primary.main,
                },
                {
                  label: 'Creators',
                  value: '500+',
                  icon: 'carbon:user-role',
                  color: theme.palette.error.main,
                },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    textAlign: { xs: 'center', sm: 'left' },
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: { xs: '50%', sm: 0 },
                      top: -8,
                      transform: { xs: 'translateX(-50%)', sm: 'none' },
                      width: 40,
                      height: 3,
                      background: `linear-gradient(90deg,
                        ${stat.color},
                        ${alpha(stat.color, 0.5)})`,
                      borderRadius: 2,
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={stat.icon}
                      sx={{
                        color: stat.color,
                        fontSize: { xs: 18, md: 24 },
                        filter: `drop-shadow(0 2px 4px ${alpha(stat.color, 0.5)})`,
                      }}
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'common.white',
                        fontWeight: 800,
                        fontSize: { xs: '1.25rem', md: '2.125rem' },
                        textShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      color: alpha(theme.palette.common.white, 0.9),
                      textTransform: 'uppercase',
                      letterSpacing: { xs: 0.5, md: 1.5 },
                      fontWeight: 500,
                      fontSize: { xs: '0.7rem', md: '0.875rem' },
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

      {/* Slide Indicators */}
      {_featuredWebtoons.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 20, md: 40 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex',
            gap: { xs: 1.5, md: 2 },
            alignItems: 'center',
            px: { xs: 1.5, md: 2 },
            py: { xs: 0.75, md: 1 },
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            bgcolor: alpha(theme.palette.common.black, 0.3),
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }}
        >
          {_featuredWebtoons.slice(0, 3).map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: currentSlide === index ? 32 : 12,
                height: 12,
                borderRadius: currentSlide === index ? 6 : '50%',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor:
                  currentSlide === index
                    ? theme.palette.secondary.main
                    : alpha(theme.palette.common.white, 0.4),
                boxShadow:
                  currentSlide === index
                    ? `0 4px 12px ${alpha(theme.palette.secondary.main, 0.5)},
                   0 0 8px ${alpha(theme.palette.secondary.main, 0.3)}`
                    : 'none',
                '&:hover': {
                  bgcolor:
                    currentSlide === index
                      ? theme.palette.secondary.light
                      : alpha(theme.palette.common.white, 0.6),
                  transform: 'scale(1.2)',
                  boxShadow:
                    currentSlide === index
                      ? `0 6px 16px ${alpha(theme.palette.secondary.main, 0.6)}`
                      : `0 2px 8px ${alpha(theme.palette.common.white, 0.3)}`,
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
