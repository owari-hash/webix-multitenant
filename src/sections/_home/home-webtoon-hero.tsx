import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
      setCurrentSlide((prev) => (prev + 1) % _featuredWebtoons.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      component={MotionViewport}
      sx={{
        position: 'relative',
        height: { md: `calc(100vh - ${HEADER.H_DESKTOP}px)` },
        overflow: 'hidden',
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
        {_featuredWebtoons.slice(0, 3).map((webtoon, index) => (
          <Box
            key={webtoon.id}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          >
            <Image
              alt={webtoon.title}
              src={webtoon.coverUrl}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.4)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg,
                  ${alpha(theme.palette.primary.main, 0.8)} 0%,
                  ${alpha(theme.palette.secondary.main, 0.6)} 50%,
                  ${alpha(theme.palette.error.main, 0.4)} 100%)`,
              }}
            />
          </Box>
        ))}
      </Box>

      <Container sx={{ height: 1, position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            py: { xs: 8, md: 0 },
          }}
        >
          <Stack
            spacing={6}
            sx={{
              maxWidth: { xs: '100%', md: '60%' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                width: 'fit-content',
                mx: { xs: 'auto', md: 0 },
              }}
            >
              <Chip label="NEW" size="small" color="primary" sx={{ mr: 1, fontWeight: 'bold' }} />
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Latest Webtoon Platform
              </Typography>
            </Box>

            {/* Main Title */}
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: 'common.white',
                  mb: 2,
                }}
              >
                Гайхамшигтай
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: `linear-gradient(135deg,
                      ${theme.palette.primary.main} 0%,
                      ${theme.palette.secondary.main} 50%,
                      ${theme.palette.error.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Веб Комикуудыг
                </Box>
                Олоорой
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'grey.200',
                  maxWidth: 600,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Гүн гүнзгий түүхүүд болон гоёмсог зургийн урлагт дүүрэн орчинд өөрийгөө шингээж,
                дэлхийн авъяаслаг зохиолчдын хамгийн сүүлийн үеийн веб комикуудыг уншаарай.
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ alignItems: { xs: 'center', sm: 'flex-start' } }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<Iconify icon="carbon:play-filled" />}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  background: `linear-gradient(135deg,
                    ${theme.palette.primary.main} 0%,
                    ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Одоо унших эхлэх
              </Button>

              <Button
                variant="outlined"
                size="large"
                endIcon={<Iconify icon="carbon:bookmark" />}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  color: 'common.white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderWidth: 2,
                  backdropFilter: 'blur(10px)',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    borderColor: 'common.white',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Номын сангаас үзэх
              </Button>
            </Stack>

            {/* Stats */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={4}
              sx={{
                pt: 4,
                borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              }}
            >
              {[
                { label: 'Webtoons', value: '10K+' },
                { label: 'Readers', value: '2M+' },
                { label: 'Creators', value: '500+' },
              ].map((stat) => (
                <Box key={stat.label} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'common.white',
                      fontWeight: 800,
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'grey.300',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
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
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          gap: 1,
        }}
      >
        {_featuredWebtoons.slice(0, 3).map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: currentSlide === index ? 'common.white' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.6)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
