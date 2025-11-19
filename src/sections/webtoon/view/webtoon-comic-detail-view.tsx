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
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import CommentsSection from '../components/comments-section';

// ----------------------------------------------------------------------

type Props = {
  comicId: string;
};

const STATUS_MAP: Record<
  string,
  { label: string; color: 'success' | 'warning' | 'error' | 'default' }
> = {
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 3, md: 5 },
          pb: { xs: 3, md: 5 },
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {/* Cover Image */}
            <Grid item xs={12} sm={5} md={4}>
              <Card
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: theme.customShadows.z24,
                }}
              >
                <Box
                  component="img"
                  src={comic.coverImage || '/assets/placeholder.jpg'}
                  alt={comic.title}
                  sx={{
                    width: '100%',
                    aspectRatio: '3/4',
                    objectFit: 'cover',
                  }}
                />
                <Chip
                  label={statusInfo.label}
                  color={statusInfo.color}
                  size="medium"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                />
              </Card>
            </Grid>

            {/* Comic Info */}
            <Grid item xs={12} sm={7} md={8}>
              <Stack spacing={2.5}>
                {/* Title */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.2,
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  }}
                >
                  {comic.title}
                </Typography>

                {/* Author */}
                {comic.author && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="carbon:user" sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      {comic.author}
                    </Typography>
                  </Stack>
                )}

                {/* Stats Cards */}
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                      <Rating
                        value={rating}
                        precision={0.5}
                        size="small"
                        readOnly
                        sx={{ mb: 0.5 }}
                      />
                      <Typography variant="h6" fontWeight={700}>
                        {rating.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Үнэлгээ
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                      <Iconify
                        icon="carbon:view"
                        sx={{ fontSize: 24, color: 'info.main', mb: 0.5 }}
                      />
                      <Typography variant="h6" fontWeight={700}>
                        {(() => {
                          const views = comic.views || 0;
                          if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
                          if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
                          return views;
                        })()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Үзэлт
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                      <Iconify
                        icon="carbon:favorite-filled"
                        sx={{ fontSize: 24, color: 'error.main', mb: 0.5 }}
                      />
                      <Typography variant="h6" fontWeight={700}>
                        {comic.likes || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Лайк
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Genres */}
                {Array.isArray(comic.genre) && comic.genre.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {comic.genre.map((genre: string) => (
                      <Chip
                        key={genre}
                        label={genre}
                        size="medium"
                        sx={{
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          },
                        }}
                      />
                    ))}
                  </Stack>
                )}

                {/* Description */}
                <Card sx={{ p: 2.5, bgcolor: 'background.paper' }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                    {comic.description || 'Тайлбар байхгүй байна.'}
                  </Typography>
                </Card>

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<Iconify icon="carbon:play" />}
                    component={chapters.length > 0 ? RouterLink : 'button'}
                    href={
                      chapters.length > 0
                        ? paths.webtoon.chapter(
                            comic._id || comic.id,
                            chapters[0]._id || chapters[0].id
                          )
                        : undefined
                    }
                    disabled={chapters.length === 0}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customShadows.z20,
                      },
                    }}
                  >
                    {chapters.length > 0 ? 'Эхнээс унших' : 'Бүлэг байхгүй'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={
                      <Iconify icon={isFavorite ? 'carbon:favorite-filled' : 'carbon:favorite'} />
                    }
                    onClick={handleToggleFavorite}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: isFavorite ? 'error.main' : 'text.primary',
                      borderColor: isFavorite ? 'error.main' : 'divider',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
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
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          {/* Chapters Header */}
          <Card sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  📖 Бүх бүлгүүд
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Нийт {chapters.length} бүлэг байна
                </Typography>
              </Box>
              {chapters.length > 0 && (
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={`Сүүлийн: Бүлэг ${chapters[chapters.length - 1].chapterNumber}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
              )}
            </Stack>
          </Card>

          {/* Chapters List */}
          {chapters.length === 0 ? (
            <Card
              sx={{
                p: 8,
                textAlign: 'center',
                bgcolor: 'background.paper',
                border: '2px dashed',
                borderColor: 'divider',
              }}
            >
              <Iconify
                icon="carbon:document-blank"
                sx={{ fontSize: 80, color: 'text.disabled', mb: 3, opacity: 0.5 }}
              />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Бүлэг байхгүй байна
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Энэ комикт одоогоор бүлэг нэмэгдээгүй байна.
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {chapters.map((chapter, index) => (
                <Card
                  key={chapter._id || chapter.id}
                  component={RouterLink}
                  href={paths.webtoon.chapter(comic._id || comic.id, chapter._id || chapter.id)}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    color: 'inherit',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: theme.customShadows.z16,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 2, sm: 3 }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                  >
                    {/* Chapter Number */}
                    <Box
                      sx={{
                        minWidth: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          color: 'primary.main',
                          fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        }}
                      >
                        #{chapter.chapterNumber}
                      </Typography>
                    </Box>

                    {/* Chapter Info */}
                    <Stack spacing={1} flex={1} sx={{ minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {chapter.title}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        flexWrap="wrap"
                        sx={{ gap: 1 }}
                      >
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify
                            icon="carbon:image"
                            sx={{ fontSize: 18, color: 'text.secondary' }}
                          />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {Array.isArray(chapter.images) ? chapter.images.length : 0} зураг
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify icon="carbon:view" sx={{ fontSize: 18, color: 'info.main' }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {chapter.views || 0} үзэлт
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify
                            icon="carbon:time"
                            sx={{ fontSize: 18, color: 'text.secondary' }}
                          />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {chapter.createdAt
                              ? new Date(chapter.createdAt).toLocaleDateString('mn-MN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : '-'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>

                    {/* Read Button */}
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<Iconify icon="carbon:play" />}
                      sx={{
                        minWidth: { xs: '100%', sm: 120 },
                        fontWeight: 700,
                        bgcolor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      Унших
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}

          {/* Comments Section */}
          <CommentsSection comicId={comicId} />
        </Stack>
      </Container>
    </Box>
  );
}
