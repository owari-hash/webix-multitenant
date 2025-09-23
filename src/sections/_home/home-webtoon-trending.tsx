import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import { _popularWebtoons } from 'src/_mock';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import { varFade, MotionViewport } from 'src/components/animate';
import Carousel, { useCarousel, CarouselArrows } from 'src/components/carousel';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  data: typeof _popularWebtoons;
  type: 'trending' | 'new';
};

export default function HomeWebtoonTrending({ title, data, type }: Props) {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  const carousel = useCarousel({
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: theme.breakpoints.values.xs,
        settings: { slidesToShow: 1 },
      },
    ],
  });

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Stack spacing={5}>
        <m.div variants={varFade().inUp}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h2" sx={{ mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {type === 'trending'
                  ? 'Most popular webtoons this week'
                  : 'Latest releases and new series'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<Iconify icon="carbon:chevron-right" />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              View All
            </Button>
          </Stack>
        </m.div>

        <Box sx={{ position: 'relative' }}>
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {data.map((webtoon, index) => (
              <Box key={webtoon.id} sx={{ px: 1 }}>
                <m.div variants={varFade().inUp}>
                  <Card
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: (t) => t.customShadows.z24,
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <Image
                        alt={webtoon.title}
                        src={webtoon.coverUrl}
                        ratio="3/4"
                        sx={{ borderRadius: 1 }}
                      />

                      {/* Ranking Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: type === 'trending' ? 'error.main' : 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'common.white',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                        }}
                      >
                        {index + 1}
                      </Box>

                      {webtoon.isNew && (
                        <Chip
                          label="NEW"
                          color="error"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontWeight: 'bold',
                          }}
                        />
                      )}

                      {webtoon.isPopular && (
                        <Chip
                          label="HOT"
                          color="warning"
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </Box>

                    <Stack spacing={1}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {webtoon.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {webtoon.description}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Rating value={webtoon.rating} readOnly size="small" precision={0.1} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          ({webtoon.rating})
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {webtoon.chapters} chapters
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {webtoon.views.toLocaleString()} views
                        </Typography>
                      </Stack>

                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        startIcon={<Iconify icon="carbon:play" />}
                        sx={{ mt: 1 }}
                      >
                        Read Now
                      </Button>
                    </Stack>
                  </Card>
                </m.div>
              </Box>
            ))}
          </Carousel>

          {mdUp && (
            <CarouselArrows
              onNext={carousel.onNext}
              onPrev={carousel.onPrev}
              sx={{
                '& .arrow': {
                  '&.left': { left: -20 },
                  '&.right': { right: -20 },
                },
              }}
            />
          )}
        </Box>

        <m.div variants={varFade().inUp}>
          <Box sx={{ textAlign: 'center', display: { xs: 'block', sm: 'none' } }}>
            <Button variant="outlined" endIcon={<Iconify icon="carbon:chevron-right" />}>
              View All
            </Button>
          </Box>
        </m.div>
      </Stack>
    </Container>
  );
}
