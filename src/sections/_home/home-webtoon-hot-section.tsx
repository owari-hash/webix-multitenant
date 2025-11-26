import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';

// ----------------------------------------------------------------------

type Props = {
  data: any[];
};

export default function HomeWebtoonHotSection({ data }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const hotComics = data.slice(0, 9); // Show more comics in slideshow

  const carousel = useCarousel({
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    dots: true,
    ...CarouselDots({
      sx: {
        mt: 4,
        '& .dot': {
          width: 12,
          height: 12,
          bgcolor: alpha(theme.palette.common.white, 0.3),
          '&.active': {
            bgcolor: theme.palette.error.main,
            width: 24,
          },
        },
      },
    }),
    responsive: [
      {
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: 2, slidesToScroll: 1, infinite: true },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: { slidesToShow: 1, slidesToScroll: 1, infinite: true },
      },
    ],
  });

  if (hotComics.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        background: `linear-gradient(180deg,
          ${theme.palette.grey[900]} 0%,
          ${theme.palette.grey[800]} 50%,
          ${alpha(theme.palette.grey[900], 0.95)} 100%)`,
        pt: { xs: 8, md: 12 },
        pb: { xs: 5, md: 8 },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at top,
            ${alpha(theme.palette.primary.main, 0.1)} 0%,
            transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container>
        <Stack spacing={4}>
          <Box sx={{ position: 'relative' }}>
            <CarouselArrows
              filled
              onNext={carousel.onNext}
              onPrev={carousel.onPrev}
              leftButtonProps={{
                sx: {
                  left: { xs: 8, md: -20 },
                  bgcolor: alpha(theme.palette.common.black, 0.5),
                  backdropFilter: 'blur(10px)',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: theme.palette.error.main,
                  },
                },
              }}
              rightButtonProps={{
                sx: {
                  right: { xs: 8, md: -20 },
                  bgcolor: alpha(theme.palette.common.black, 0.5),
                  backdropFilter: 'blur(10px)',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: theme.palette.error.main,
                  },
                },
              }}
            >
              <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                {hotComics.map((comic, index) => (
                  <Box key={comic._id || comic.id || index} sx={{ px: 1 }}>
                    <Box
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                        },
                      }}
                      onClick={() => router.push(paths.webtoon.comic(comic._id || comic.id))}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          borderRadius: 3,
                          overflow: 'hidden',
                          mb: 2,
                          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`,
                        }}
                      >
                        <Image
                          alt={comic.title || 'Comic cover'}
                          src={comic.coverImage || comic.coverUrl || '/assets/placeholder.jpg'}
                          ratio="3/4"
                          sx={{
                            borderRadius: 3,
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                        />

                        {/* Gradient Overlay for better text visibility */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '40%',
                            background: `linear-gradient(to top,
                            ${alpha(theme.palette.common.black, 0.85)} 0%,
                            ${alpha(theme.palette.common.black, 0.5)} 50%,
                            transparent 100%)`,
                          }}
                        />

                        {/* HOT Badge */}
                        <Chip
                          icon={<Iconify icon="solar:fire-bold" width={16} />}
                          label="HOT"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            bgcolor: theme.palette.error.main,
                            color: 'common.white',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            height: 32,
                            px: 1.5,
                            boxShadow: `0 4px 16px ${alpha(theme.palette.error.main, 0.4)}`,
                            zIndex: 2,
                            '& .MuiChip-icon': {
                              color: 'common.white',
                            },
                          }}
                        />

                        {/* Title Overlay */}
                        <Typography
                          variant="h6"
                          sx={{
                            position: 'absolute',
                            bottom: 60,
                            left: 16,
                            right: 16,
                            color: 'common.white',
                            fontWeight: 700,
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            textShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.8)}`,
                            zIndex: 2,
                          }}
                        >
                          {comic.title}
                        </Typography>

                        {/* Action and Manhwa Chips at bottom */}
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            position: 'absolute',
                            bottom: 12,
                            left: 16,
                            right: 16,
                            zIndex: 2,
                          }}
                        >
                          <Chip
                            label="Action"
                            sx={{
                              bgcolor: theme.palette.error.main,
                              color: 'common.white',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              height: 28,
                              px: 1.5,
                              textTransform: 'uppercase',
                              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}`,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: theme.palette.error.dark,
                                transform: 'scale(1.05)',
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(paths.webtoon.comic(comic._id || comic.id));
                            }}
                          />
                          <Chip
                            label="Manhwa"
                            sx={{
                              bgcolor: theme.palette.error.main,
                              color: 'common.white',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              height: 28,
                              px: 1.5,
                              textTransform: 'uppercase',
                              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}`,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: theme.palette.error.dark,
                                transform: 'scale(1.05)',
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(paths.webtoon.comic(comic._id || comic.id));
                            }}
                          />
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Carousel>
            </CarouselArrows>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
