import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { varFade, MotionViewport } from 'src/components/animate';
import Carousel, { useCarousel, CarouselArrows } from 'src/components/carousel';

// ----------------------------------------------------------------------

type Props = {
  data: any[];
};

export default function HomeWebtoonFeatured({ data }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const carousel = useCarousel({
    slidesToShow: Math.min(6, data.length),
    slidesToScroll: 2,
    infinite: data.length > 6,
    autoplay: data.length > 6,
    autoplaySpeed: 4000,
    speed: 600,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: Math.min(5, data.length),
          slidesToScroll: 2,
          infinite: data.length > 5,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: Math.min(4, data.length),
          slidesToScroll: 2,
          infinite: data.length > 4,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: Math.min(3, data.length),
          slidesToScroll: 1,
          infinite: data.length > 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(2, data.length),
          slidesToScroll: 1,
          infinite: data.length > 2,
        },
      },
    ],
  });

  const formatViews = (views: number) => {
    if (!views) return '0';
    return views.toLocaleString('en-US');
  };

  return (
    <Box
      component={MotionViewport}
      sx={{
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Container>
        <Stack spacing={4}>
        <m.div variants={varFade().inUp}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Iconify
                icon="solar:book-bookmark-bold"
                sx={{
                  fontSize: { xs: 24, md: 32 },
                  color: theme.palette.primary.main,
                }}
              />
          <Typography
                variant="h2"
            sx={{
              fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
                Топ 10 – Их Уншсан Зохиол
          </Typography>
            </Stack>
          </m.div>
        </Stack>
      </Container>

      <Container
        sx={{
          position: 'relative',
          overflow: 'visible',
          px: { xs: 2, md: 3 },
        }}
      >
        <Box
            sx={{
            position: 'relative',
            overflow: 'visible',
            '& .slick-list': {
              overflow: 'hidden',
              margin: { xs: '0 -4px', md: '0 -8px' },
            },
            '& .slick-track': {
              display: 'flex !important',
              flexWrap: 'nowrap !important',
            },
            '& .slick-slide': {
              float: 'none !important',
              display: 'inline-block !important',
              verticalAlign: 'top',
              '& > div': {
                height: '100%',
                padding: { xs: '0 4px', md: '0 8px' },
              },
            },
            }}
          >
          <CarouselArrows
            filled
            onNext={carousel.onNext}
            onPrev={carousel.onPrev}
            leftButtonProps={{
              sx: {
                left: { xs: 8, md: -44 },
                bgcolor: alpha(theme.palette.grey[900], 0.6),
                backdropFilter: 'blur(10px)',
                color: 'common.white',
                boxShadow: theme.customShadows.z8,
                zIndex: 10,
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'common.white',
                },
              },
            }}
            rightButtonProps={{
              sx: {
                right: { xs: 8, md: -44 },
                bgcolor: alpha(theme.palette.grey[900], 0.6),
                backdropFilter: 'blur(10px)',
                color: 'common.white',
                boxShadow: theme.customShadows.z8,
                zIndex: 10,
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'common.white',
                },
              },
            }}
          >
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
              {data.map((webtoon, index) => (
                <Box key={webtoon._id || webtoon.id || index}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      maxWidth: { xs: 140, sm: 160, md: 180 },
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.customShadows.z16,
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                    onClick={() => router.push(paths.webtoon.comic(webtoon._id || webtoon.id))}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Image
                        alt={webtoon.title || 'Comic cover'}
                        src={webtoon.coverImage || webtoon.coverUrl || '/assets/placeholder.jpg'}
                        ratio="3/4"
                        sx={{
                          borderRadius: '6px 6px 0 0',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.03)',
                          },
                        }}
                      />

                      {/* View Count Badge - Top Center */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 6,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bgcolor: alpha(theme.palette.grey[800], 0.95),
                          backdropFilter: 'blur(10px)',
                          px: 1,
                          py: 0.25,
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                          zIndex: 2,
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={0.25}>
                          <Iconify
                            icon="solar:eye-bold"
                            sx={{
                              fontSize: 10,
                              color: theme.palette.common.white,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'common.white',
                              fontWeight: 700,
                              fontSize: '0.65rem',
                              whiteSpace: 'nowrap',
                        }}
                      >
                            {formatViews(webtoon.views || 0)}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>

                    <Box sx={{ p: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontSize: '0.75rem',
                          lineHeight: 1.3,
                          minHeight: 32,
                        }}
                      >
                        {webtoon.title}
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              ))}
          </Carousel>
          </CarouselArrows>
        </Box>
    </Container>
    </Box>
  );
}
