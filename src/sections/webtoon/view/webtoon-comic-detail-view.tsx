'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

type Props = {
  comicId: string;
};

const STATUS_MAP: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  ongoing: { label: 'Үргэлжилж байна', color: 'success' },
  completed: { label: 'Дууссан', color: 'default' },
  hiatus: { label: 'Түр зогссон', color: 'warning' },
};

export default function WebtoonComicDetailView({ comicId }: Props) {
  const theme = useTheme();
  const [comic, setComic] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchComicData = async () => {
      try {
        // Fetch comic details
        const comicResponse = await fetch(`/api2/webtoon/comic/${comicId}`);
        const comicResult = await comicResponse.json();
        
        if (comicResult.success && comicResult.comic) {
          setComic(comicResult.comic);
        }

        // Fetch chapters
        const chaptersResponse = await fetch(`/api2/webtoon/comic/${comicId}/chapters`);
        const chaptersResult = await chaptersResponse.json();
        
        if (chaptersResult.success && chaptersResult.chapters) {
          setChapters(chaptersResult.chapters);
        }
      } catch (error) {
        console.error('Failed to fetch comic data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComicData();
  }, [comicId]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement API call to add/remove favorite
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!comic) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" color="text.secondary">
            Комик олдсонгүй
          </Typography>
        </Box>
      </Container>
    );
  }

  const rating = comic.likes ? Math.min(5, comic.likes / 100) : 4.5;
  const statusInfo = STATUS_MAP[comic.status] || STATUS_MAP.ongoing;

  return (
    <Box sx={{ bgcolor: 'background.neutral' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 8, md: 10 },
          pb: { xs: 4, md: 6 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
            theme.palette.secondary.main,
            0.1
          )} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Cover Image */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: theme.customShadows.z24,
                }}
              >
                <Image
                  src={comic.coverImage || '/assets/placeholder.jpg'}
                  alt={comic.title}
                  ratio="3/4"
                />
                <Chip
                  label={statusInfo.label}
                  color={statusInfo.color}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Grid>

            {/* Comic Info */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Title */}
                <Typography variant="h2" sx={{ fontWeight: 800 }}>
                  {comic.title}
                </Typography>

                {/* Rating & Stats */}
                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating value={rating} precision={0.1} readOnly />
                    <Typography variant="h6" color="text.secondary">
                      {rating.toFixed(1)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Iconify icon="carbon:view" sx={{ fontSize: 24 }} />
                    <Typography variant="h6">
                      {(() => {
                        const views = comic.views || 0;
                        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
                        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
                        return views;
                      })()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Iconify icon="carbon:favorite-filled" sx={{ fontSize: 24, color: 'error.main' }} />
                    <Typography variant="h6">{comic.likes || 0}</Typography>
                  </Stack>
                </Stack>

                {/* Genres */}
                {Array.isArray(comic.genre) && comic.genre.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {comic.genre.map((genre: string) => (
                      <Chip key={genre} label={genre} variant="outlined" />
                    ))}
                  </Stack>
                )}

                {/* Description */}
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {comic.description}
                </Typography>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Iconify icon="carbon:play" />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customShadows.z20,
                      },
                    }}
                  >
                    Эхнээс унших
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={
                      <Iconify icon={isFavorite ? 'carbon:favorite-filled' : 'carbon:favorite'} />
                    }
                    onClick={handleToggleFavorite}
                    sx={{
                      px: 4,
                      py: 1.5,
                      color: isFavorite ? 'error.main' : 'text.primary',
                      borderColor: isFavorite ? 'error.main' : 'divider',
                      '&:hover': {
                        borderColor: 'error.main',
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                      },
                    }}
                  >
                    {isFavorite ? 'Дуртай' : 'Дуртайд нэмэх'}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Chapters Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={4}>
          {/* Chapters Header */}
          <Box>
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
              Бүлгүүд
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {chapters.length} бүлэг
            </Typography>
          </Box>

          {/* Chapters List */}
          {chapters.length === 0 ? (
            <Card sx={{ p: 8, textAlign: 'center' }}>
              <Iconify
                icon="carbon:document-blank"
                sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Бүлэг байхгүй байна
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {chapters.map((chapter) => (
                <Grid key={chapter._id || chapter.id} item xs={12} sm={6} md={4}>
                  <Card
                    component={RouterLink}
                    href={paths.webtoon.chapter(comic._id || comic.id, chapter._id || chapter.id)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.customShadows.z20,
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      {/* Chapter Number Badge */}
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Chip
                          label={`Бүлэг ${chapter.chapterNumber}`}
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        />
                        <Chip
                          icon={<Iconify icon="carbon:time" />}
                          label={
                            chapter.createdAt
                              ? new Date(chapter.createdAt).toLocaleDateString('mn-MN')
                              : '-'
                          }
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      {/* Chapter Title */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {chapter.title}
                      </Typography>

                      {/* Chapter Stats */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify icon="carbon:image" sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {Array.isArray(chapter.images) ? chapter.images.length : 0} зураг
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify icon="carbon:view" sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {chapter.views || 0} үзэлт
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Read Button */}
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        startIcon={<Iconify icon="carbon:play" />}
                      >
                        Унших
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

