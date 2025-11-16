'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

type Props = {
  comicId: string;
  chapterId: string;
};

export default function WebtoonChapterReadView({ comicId, chapterId }: Props) {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const [chapter, setChapter] = useState<any>(null);
  const [comic, setComic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch comic data
        const comicResponse = await fetch(`/api2/webtoon/comic/${comicId}`);
        const comicResult = await comicResponse.json();

        if (comicResult.success && comicResult.comic) {
          setComic(comicResult.comic);
        }

        // Fetch chapter data
        const chapterResponse = await fetch(`/api2/webtoon/chapter/${chapterId}`);
        const chapterResult = await chapterResponse.json();

        console.log('Chapter data:', chapterResult);

        if (chapterResult.success && chapterResult.chapter) {
          setChapter(chapterResult.chapter);
          console.log('Chapter images:', chapterResult.chapter.images);
        } else {
          setError(chapterResult.message || 'Бүлэг олдсонгүй');
        }
      } catch (err) {
        console.error('Failed to fetch chapter data:', err);
        setError('Сүлжээний алдаа. Дахин оролдоно уу.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [comicId, chapterId]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  if (loading) {
    return (
      <Container
        sx={{
          py: { xs: 5, md: 8 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !chapter) {
    return (
      <Container sx={{ py: { xs: 5, md: 8 }, textAlign: 'center' }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          Алдаа гарлаа
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {error || 'Бүлэг олдсонгүй'}
        </Typography>
        <Button variant="contained" component={RouterLink} href={paths.webtoon.comic(comicId)}>
          Буцах
        </Button>
      </Container>
    );
  }

  const images = chapter.images || [];

  return (
    <>
      {/* Reading Progress Bar - hidden on mobile for immersive experience */}
      <LinearProgress
        variant="determinate"
        value={readProgress}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          height: 4,
          bgcolor: alpha(theme.palette.grey[500], 0.2),
          display: { xs: 'none', md: 'block' },
          '& .MuiLinearProgress-bar': {
            bgcolor: theme.palette.primary.main,
          },
        }}
      />

      {/* Compact Mobile Header */}
      <Box
        sx={{
          position: { xs: 'relative', md: 'sticky' },
          top: { md: 0 },
          zIndex: 1200,
          bgcolor: alpha(theme.palette.background.default, 0.98),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
          py: { xs: 1, sm: 1.5, md: 2 },
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ minWidth: 0, flex: 1, mr: 1 }}
            >
              <IconButton
                component={RouterLink}
                href={paths.webtoon.comic(comicId)}
                size="small"
                sx={{
                  flexShrink: 0,
                  color: 'text.primary',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <Iconify icon="carbon:arrow-left" width={{ xs: 18, md: 22 }} />
              </IconButton>

              <Box sx={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.125rem' },
                    lineHeight: { xs: 1.3, md: 1.4 },
                  }}
                >
                  {comic?.title || 'Loading...'}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    fontSize: { sm: '0.688rem', md: '0.75rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Бүлэг {chapter.chapterNumber}: {chapter.title}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
              <IconButton
                component={RouterLink}
                href={paths.webtoon.root}
                size="small"
                sx={{
                  display: { xs: 'inline-flex', md: 'none' },
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <Iconify icon="carbon:home" width={18} />
              </IconButton>
              <IconButton
                onClick={toggleFullscreen}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <Iconify
                  icon={isFullscreen ? 'carbon:minimize' : 'carbon:maximize'}
                  width={{ xs: 18, md: 22 }}
                />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Chapter Images */}
      <Box
        sx={{
          bgcolor: {
            xs: theme.palette.mode === 'dark' ? '#000' : '#fff',
            md: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200',
          },
          minHeight: '100vh',
          pb: { xs: 2, md: 8 },
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '800px' },
            mx: { xs: 0, md: 'auto' },
            pt: { xs: 0, md: 3 },
            px: { xs: 0, md: 2 },
          }}
        >
          {images.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Iconify icon="carbon:image" sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Энэ бүлэгт зураг байхгүй байна
              </Typography>
            </Box>
          ) : (
            images.map((imageUrl: string, index: number) => (
              <Box
                key={index}
                sx={{
                  mb: { xs: 0, md: 0.5 },
                  bgcolor: 'background.paper',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: { xs: 300, md: 200 },
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={`Page ${index + 1}`}
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: { xs: 'cover', md: 'contain' },
                  }}
                  onError={(e: any) => {
                    console.error(`Failed to load image ${index + 1}:`, imageUrl);
                    e.target.style.border = '2px solid red';
                    e.target.alt = `Failed to load image ${index + 1}`;
                  }}
                  onLoad={() => {
                    console.log(`Image ${index + 1} loaded successfully`);
                  }}
                />
              </Box>
            ))
          )}
        </Box>

        {/* Chapter Navigation */}
        <Container maxWidth="md" sx={{ mt: { xs: 3, md: 5 }, px: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={{ xs: 2, sm: 0 }}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              bgcolor: 'background.paper',
              borderRadius: { xs: 1.5, md: 2 },
              boxShadow: theme.customShadows.z8,
            }}
          >
            <Button
              variant="outlined"
              size={mdUp ? 'large' : 'medium'}
              startIcon={<Iconify icon="carbon:chevron-left" width={{ xs: 18, md: 20 }} />}
              disabled
              fullWidth={!mdUp}
              sx={{
                order: { xs: 2, sm: 1 },
                px: { xs: 2, md: 3 },
                fontSize: { xs: '0.813rem', md: '0.938rem' },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Өмнөх бүлэг
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                Өмнөх
              </Box>
            </Button>

            <Stack spacing={0.5} alignItems="center" sx={{ order: { xs: 1, sm: 2 } }}>
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, fontWeight: 700 }}
              >
                Бүлэг {chapter.chapterNumber}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                {images.length} зураг
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              size={mdUp ? 'large' : 'medium'}
              endIcon={<Iconify icon="carbon:chevron-right" width={{ xs: 18, md: 20 }} />}
              disabled
              fullWidth={!mdUp}
              sx={{
                order: { xs: 3, sm: 3 },
                px: { xs: 2, md: 3 },
                fontSize: { xs: '0.813rem', md: '0.938rem' },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Дараах бүлэг
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                Дараах
              </Box>
            </Button>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 3, justifyContent: 'center' }}
          >
            <Button
              variant="contained"
              size={mdUp ? 'large' : 'medium'}
              component={RouterLink}
              href={paths.webtoon.comic(comicId)}
              startIcon={<Iconify icon="carbon:book" width={{ xs: 18, md: 20 }} />}
              fullWidth={!mdUp}
              sx={{
                px: { xs: 3, md: 4 },
                py: { xs: 1.25, md: 1.5 },
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
              }}
            >
              Бүлгийн жагсаалт
            </Button>
            <Button
              variant="outlined"
              size={mdUp ? 'large' : 'medium'}
              startIcon={<Iconify icon="carbon:favorite" width={{ xs: 18, md: 20 }} />}
              fullWidth={!mdUp}
              sx={{
                px: { xs: 3, md: 4 },
                py: { xs: 1.25, md: 1.5 },
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
              }}
            >
              Дуртайд нэмэх
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
