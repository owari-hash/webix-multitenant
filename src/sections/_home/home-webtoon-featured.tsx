import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
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
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
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
        py: { xs: 8, md: 12 },
      }}
    >
      <Stack spacing={5}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 2 }}>
            Онцлох Веб Комикууд
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Хүн бүрийн ярьж байгаа хамгийн алдартай болон тренд веб комикуудыг олж мэдээрэй
          </Typography>
        </m.div>

        <Box sx={{ position: 'relative' }}>
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {data.map((webtoon) => {
              const isNew = webtoon.createdAt && 
                new Date(webtoon.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
              const isPopular = (webtoon.views || 0) > 10000;
              const rating = webtoon.likes ? Math.min(5, (webtoon.likes / 100)) : 4.5;
              
              return (
                <Box key={webtoon._id || webtoon.id} sx={{ px: 1 }}>
                  <m.div variants={varFade().inUp}>
                    <Card
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: (t) => t.customShadows.z24,
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative', mb: 2 }}>
                        <Image
                          alt={webtoon.title}
                          src={webtoon.coverImage || '/assets/placeholder.jpg'}
                          ratio="3/4"
                          sx={{ borderRadius: 1 }}
                        />
                        {isNew && (
                          <Chip
                            label="NEW"
                            color="error"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              fontWeight: 'bold',
                            }}
                          />
                        )}
                        {isPopular && (
                          <Chip
                            label="HOT"
                            color="warning"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
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
                          {webtoon.description || 'No description available'}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={rating} readOnly size="small" precision={0.1} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ({rating.toFixed(1)})
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {webtoon.chapters || 0} chapters
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {(webtoon.views || 0).toLocaleString()} views
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
              );
            })}
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
      </Stack>
    </Container>
  );
}
