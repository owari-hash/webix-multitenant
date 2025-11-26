import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import { varFade, MotionViewport } from 'src/components/animate';
import Carousel, { useCarousel, CarouselArrows } from 'src/components/carousel';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  data: any[];
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
        py: { xs: 8, md: 12 },
      }}
    >
      <Stack spacing={5}>
        <m.div variants={varFade().inUp}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={{ xs: 2, sm: 0 }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  mb: 1,
                  fontWeight: 800,
                  background: `linear-gradient(135deg,
                    ${theme.palette.primary.main} 0%,
                    ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                {type === 'trending'
                  ? 'Энэ долоо хоногийн хамгийн алдартай веб комикууд'
                  : 'Хамгийн сүүлийн үеийн гарсан болон шинэ цуврал'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<Iconify icon="carbon:chevron-right" />}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                borderWidth: 2,
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateX(4px)',
                },
              }}
            >
              Бүгдийг үзэх
            </Button>
          </Stack>
        </m.div>

        <Box sx={{ position: 'relative' }}>
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {data.map((webtoon, index) => {
              const isNew =
                webtoon.createdAt &&
                new Date(webtoon.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
              const isPopular = (webtoon.views || 0) > 10000;
              const rating = webtoon.likes ? Math.min(5, webtoon.likes / 100) : 4.5;

              return (
                <Box key={webtoon._id || webtoon.id} sx={{ px: 1 }}>
                  <m.div variants={varFade().inUp}>
                    <Card
                      sx={{
                        p: { xs: 1.5, md: 2 },
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
                        bgcolor: 'background.paper',
                        boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.08)},
                          0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background:
                            type === 'trending'
                              ? `linear-gradient(90deg,
                                ${theme.palette.error.main} 0%,
                                ${alpha(theme.palette.error.main, 0.6)} 100%)`
                              : `linear-gradient(90deg,
                                ${theme.palette.primary.main} 0%,
                                ${alpha(theme.palette.primary.main, 0.6)} 100%)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          zIndex: 1,
                        },
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.02)',
                          boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)},
                            0 12px 32px ${alpha(theme.palette.common.black, 0.12)},
                            0 4px 16px ${alpha(theme.palette.common.black, 0.08)}`,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          '&::before': {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          mb: 2,
                          borderRadius: 1.5,
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <Image
                          alt={webtoon.title}
                          src={webtoon.coverImage || '/assets/placeholder.jpg'}
                          ratio="3/4"
                          sx={{
                            borderRadius: 1.5,
                            transition: 'filter 0.3s ease',
                            '&:hover': {
                              filter: 'brightness(1.1)',
                            },
                          }}
                        />

                        {/* Ranking Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            width: { xs: 36, md: 40 },
                            height: { xs: 36, md: 40 },
                            borderRadius: '50%',
                            bgcolor:
                              type === 'trending'
                                ? theme.palette.error.main
                                : theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'common.white',
                            fontWeight: 800,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            boxShadow: `0 4px 12px ${alpha(
                              type === 'trending'
                                ? theme.palette.error.main
                                : theme.palette.primary.main,
                              0.4
                            )}`,
                            border: '2px solid white',
                            zIndex: 2,
                          }}
                        >
                          {index + 1}
                        </Box>

                        {isNew && (
                          <Chip
                            label="NEW"
                            color="error"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              fontWeight: 800,
                              fontSize: '0.7rem',
                              height: 24,
                              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}`,
                              border: '1px solid white',
                              zIndex: 2,
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
                              bottom: 12,
                              right: 12,
                              fontWeight: 800,
                              fontSize: '0.7rem',
                              height: 24,
                              boxShadow: `0 2px 8px ${alpha(theme.palette.warning.main, 0.4)}`,
                              border: '1px solid white',
                              zIndex: 2,
                            }}
                          />
                        )}
                      </Box>

                      <Stack spacing={1.5}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            lineHeight: 1.3,
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
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            lineHeight: 1.5,
                          }}
                        >
                          {webtoon.description}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating
                            value={rating}
                            readOnly
                            size="small"
                            precision={0.1}
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: theme.palette.warning.main,
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 600,
                              fontSize: { xs: '0.7rem', md: '0.75rem' },
                            }}
                          >
                            ({rating.toFixed(1)})
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            pt: 0.5,
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Iconify
                              icon="carbon:book"
                              sx={{ fontSize: 14, color: 'text.secondary' }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                              }}
                            >
                              {webtoon.chapters || 0}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Iconify
                              icon="carbon:view"
                              sx={{ fontSize: 14, color: 'text.secondary' }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                              }}
                            >
                              {(webtoon.views || 0).toLocaleString()}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          startIcon={<Iconify icon="carbon:play" />}
                          sx={{
                            mt: 1,
                            fontWeight: 600,
                            py: 1,
                            borderRadius: 1.5,
                            background: `linear-gradient(135deg,
                            ${theme.palette.primary.main} 0%,
                            ${theme.palette.secondary.main} 100%)`,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                            },
                          }}
                        >
                          Унших
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

        <m.div variants={varFade().inUp}>
          <Box sx={{ textAlign: 'center', display: { xs: 'block', sm: 'none' } }}>
            <Button
              variant="outlined"
              endIcon={<Iconify icon="carbon:chevron-right" />}
              sx={{
                borderWidth: 2,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateX(4px)',
                },
              }}
            >
              Бүгдийг үзэх
            </Button>
          </Box>
        </m.div>
      </Stack>
    </Container>
  );
}
