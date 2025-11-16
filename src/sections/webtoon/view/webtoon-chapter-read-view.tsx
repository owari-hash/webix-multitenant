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

// ----------------------------------------------------------------------

type Props = {
  comicId: string;
  chapterId: string;
};

export default function WebtoonChapterReadView({ comicId, chapterId }: Props) {
  const theme = useTheme();
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
      {/* Reading Progress Bar */}
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
          '& .MuiLinearProgress-bar': {
            bgcolor: theme.palette.primary.main,
          },
        }}
      />

      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          bgcolor: alpha(theme.palette.background.default, 0.9),
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
          py: 2,
        }}
      >
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton component={RouterLink} href={paths.webtoon.comic(comicId)}>
                <Iconify icon="carbon:arrow-left" />
              </IconButton>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {comic?.title || 'Loading...'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Бүлэг {chapter.chapterNumber}: {chapter.title}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <IconButton onClick={toggleFullscreen}>
                <Iconify icon={isFullscreen ? 'carbon:minimize' : 'carbon:maximize'} />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Chapter Images */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200',
          minHeight: '100vh',
          pb: 8,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            pt: 3,
            '& img': {
              width: '100%',
              height: 'auto',
              display: 'block',
              mb: 0.5,
            },
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
                  mb: 0.5,
                  bgcolor: 'background.paper',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 200,
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={`Page ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain',
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
        </Container>

        {/* Chapter Navigation */}
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: theme.customShadows.z8,
            }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<Iconify icon="carbon:chevron-left" />}
              disabled
            >
              Өмнөх бүлэг
            </Button>

            <Stack spacing={1} alignItems="center">
              <Typography variant="h6">Бүлэг {chapter.chapterNumber}</Typography>
              <Typography variant="body2" color="text.secondary">
                {images.length} зураг
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              size="large"
              endIcon={<Iconify icon="carbon:chevron-right" />}
              disabled
            >
              Дараах бүлэг
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              href={paths.webtoon.comic(comicId)}
              startIcon={<Iconify icon="carbon:book" />}
            >
              Бүлгийн жагсаалт
            </Button>
            <Button variant="outlined" size="large" startIcon={<Iconify icon="carbon:favorite" />}>
              Дуртайд нэмэх
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
