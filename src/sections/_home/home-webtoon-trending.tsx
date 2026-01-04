import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fToNow } from 'src/utils/format-time';
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
    slidesToShow: 2, // 2 items per row for horizontal cards
    slidesToScroll: 1,
    infinite: data.length > 2,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: 1 },
      },
    ],
  });

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 8, md: 10 },
      }}
    >
      <Stack spacing={4}>
        <m.div variants={varFade().inUp}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  mb: 1,
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2.2rem' },
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {type === 'trending'
                  ? 'Энэ долоо хоногийн хамгийн алдартай веб комикууд'
                  : 'Хамгийн сүүлийн үеийн гарсан болон шинэ цуврал'}
              </Typography>
            </Box>
            <Button
              variant="text"
              endIcon={<Iconify icon="carbon:chevron-right" />}
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
              }}
            >
              Бүгдийг үзэх
            </Button>
          </Stack>
        </m.div>

        <Box sx={{ position: 'relative' }}>
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {data.map((webtoon, index) => (
              <Box key={webtoon._id || webtoon.id || index} sx={{ px: 1.5, py: 1 }}>
                <m.div variants={varFade().inUp}>
                  <ChapterCard webtoon={webtoon} />
                </m.div>
              </Box>
            ))}
          </Carousel>

          {mdUp && (
            <CarouselArrows
              onNext={carousel.onNext}
              onPrev={carousel.onPrev}
              leftButtonProps={{
                sx: { left: -24, bgcolor: 'background.paper', boxShadow: theme.customShadows.z8 },
              }}
              rightButtonProps={{
                sx: { right: -24, bgcolor: 'background.paper', boxShadow: theme.customShadows.z8 },
              }}
            />
          )}
        </Box>
      </Stack>
    </Container>
  );
}

// ----------------------------------------------------------------------

function ChapterCard({ webtoon }: { webtoon: any }) {
  const theme = useTheme();
  const router = useRouter();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api2/webtoon/comic/${webtoon._id || webtoon.id}/chapters`);
        const result = await response.json();
        if (result.success && result.chapters) {
          const latest = result.chapters
            .sort((a: any, b: any) => (b.chapterNumber || 0) - (a.chapterNumber || 0))
            .slice(0, 5);
          setChapters(latest);
        }
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [webtoon]);

  return (
    <Card
      sx={{
        display: 'flex',
        borderRadius: 2.5,
        bgcolor: 'background.neutral',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        overflow: 'hidden',
        height: { xs: 'auto', md: 280 },
        transition: 'none',
      }}
    >
      {/* Left: Cover Image */}
      <Box 
        onClick={() => router.push(paths.webtoon.comic(webtoon._id || webtoon.id))}
        sx={{ width: { xs: 120, md: 180 }, flexShrink: 0, position: 'relative', cursor: 'pointer' }}
      >
        <Image
          alt={webtoon.title}
          src={webtoon.coverImage || '/assets/placeholder.jpg'}
          sx={{ height: 1, '& img': { objectFit: 'cover' } }}
        />
        <Chip
          label="ONGOING"
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            height: 20,
            bgcolor: alpha(theme.palette.success.main, 0.9),
            color: 'common.white',
            fontWeight: 800,
            fontSize: '0.65rem',
            backdropFilter: 'blur(4px)',
          }}
        />
      </Box>

      {/* Right: Content */}
      <Stack sx={{ p: 2, flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          onClick={() => router.push(paths.webtoon.comic(webtoon._id || webtoon.id))}
          sx={{
            fontWeight: 800,
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '1.1rem',
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' },
          }}
        >
          {webtoon.title}
        </Typography>

        <Stack spacing={0.75} sx={{ flexGrow: 1, overflow: 'hidden' }}>
          {(() => {
            if (loading) {
              return Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={36} sx={{ borderRadius: 1 }} />
              ));
            }
            if (chapters.length > 0) {
              return chapters.map((chapter) => (
                <Stack
                  key={chapter._id || chapter.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() =>
                    router.push(
                      paths.webtoon.chapter(webtoon._id || webtoon.id, chapter._id || chapter.id)
                    )
                  }
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.action.disabledBackground, 0.3),
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.action.selected, 0.5),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    Бүлэг {chapter.chapterNumber}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.disabled',
                      fontSize: '0.7rem',
                    }}
                  >
                    {fToNow(chapter.createdAt)}
                  </Typography>
                </Stack>
              ));
            }
            return (
              <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', mt: 2 }}>
                Бүлэг байхгүй
              </Typography>
            );
          })()}
        </Stack>
      </Stack>
    </Card>
  );
}
