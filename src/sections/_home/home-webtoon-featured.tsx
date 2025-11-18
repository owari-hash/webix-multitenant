import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import { useResponsive } from 'src/hooks/use-responsive';
import { varFade, MotionViewport } from 'src/components/animate';
import Carousel, { useCarousel, CarouselArrows } from 'src/components/carousel';

// ----------------------------------------------------------------------

type Props = {
  data: any[];
};

export default function HomeWebtoonFeatured({ data }: Props) {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  const carousel = useCarousel({
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: { slidesToShow: 4, slidesToScroll: 4 },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  });

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 8, md: 12 },
      }}
    >
      <Stack spacing={5}>
        <m.div variants={varFade().inUp}>
          <Typography
            variant="h3"
            sx={{
              mb: 1,
              fontWeight: 800,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            Онцлох Веб Комикууд
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 3,
            }}
          >
            Хүн бүрийн ярьж байгаа хамгийн алдартай болон тренд веб комикуудыг олж мэдээрэй
          </Typography>
        </m.div>

        <Box sx={{ position: 'relative' }}>
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {data.map((webtoon) => {
              const rating = webtoon.likes ? Math.min(5, webtoon.likes / 100) : 4.5;

              return (
                <Box key={webtoon._id || webtoon.id} sx={{ px: 1 }}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: (t) => t.customShadows.z24,
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Image
                        alt={webtoon.title}
                        src={webtoon.coverImage || '/assets/placeholder.jpg'}
                        ratio="3/4"
                        sx={{ borderRadius: '8px 8px 0 0' }}
                      />

                      {/* MANHUA Badge - Top Left */}
                      <Chip
                        label="MANHUA"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          bgcolor: '#FF5252',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 22,
                        }}
                      />

                      {/* Chapter Number - Bottom Left */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          bgcolor: 'rgba(0, 0, 0, 0.75)',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        Chapter {webtoon.chapters || 0}
                      </Box>
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 1,
                        }}
                      >
                        {webtoon.title}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Rating value={rating} readOnly size="small" precision={0.1} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {rating.toFixed(1)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Card>
                </Box>
              );
            })}
          </Carousel>

          <CarouselArrows
            onNext={carousel.onNext}
            onPrev={carousel.onPrev}
            sx={{
              '& .arrow': {
                bgcolor: 'background.paper',
                boxShadow: (t) => t.customShadows.z8,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                },
                ...(mdUp && {
                  '&.left': { left: -16 },
                  '&.right': { right: -16 },
                }),
              },
            }}
          />
        </Box>
      </Stack>
    </Container>
  );
}
