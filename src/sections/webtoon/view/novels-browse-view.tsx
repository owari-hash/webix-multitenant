'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Хамгийн сүүлийн' },
  { value: 'popular', label: 'Алдартай' },
  { value: 'rating', label: 'Үнэлгээ' },
  { value: 'name', label: 'Нэрээр' },
  { value: 'completed', label: 'Дууссан' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Бүгд' },
  { value: 'ongoing', label: 'Үргэлжлэх' },
  { value: 'completed', label: 'Дууссан' },
  { value: 'hiatus', label: 'Түр зогссон' },
];

export default function NovelsBrowseView() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [status, setStatus] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Set category from URL parameter on mount
  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch novels from API with chapter counts
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch('/api2/novel');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Handle different response formats
        let novelsData: any[] = [];
        if (result.success && Array.isArray(result.data)) {
          novelsData = result.data;
        } else if (result.success && Array.isArray(result.novels)) {
          novelsData = result.novels;
        } else if (Array.isArray(result)) {
          novelsData = result;
        }

        // Fetch chapter counts for each novel
        const novelsWithChapters = await Promise.all(
          novelsData.map(async (novel) => {
            const novelId = novel._id || novel.id;

            // Validate ID before making request
            if (!novelId || typeof novelId !== 'string' || novelId.length !== 24) {
              console.warn(`Invalid novel ID: ${novelId}, skipping chapter fetch`);
              return {
                ...novel,
                chapters: novel.chapters || 0,
              };
            }

            try {
              const chaptersResponse = await fetch(`/api2/novel/${novelId}/chapters`);

              if (!chaptersResponse.ok) {
                throw new Error(`HTTP error! status: ${chaptersResponse.status}`);
              }

              const chaptersResult = await chaptersResponse.json();

              if (!chaptersResult.success) {
                throw new Error(chaptersResult.error || chaptersResult.message);
              }

              const chapterCount =
                chaptersResult.success && Array.isArray(chaptersResult.chapters)
                  ? chaptersResult.chapters.length
                  : novel.chapters || 0;

              return {
                ...novel,
                chapters: chapterCount,
              };
            } catch (error) {
              console.error(`Failed to fetch chapters for novel ${novelId}:`, error);
              return {
                ...novel,
                chapters: novel.chapters || 0,
              };
            }
          })
        );

        setNovels(novelsWithChapters);
      } catch (error) {
        console.error('Failed to fetch novels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  // Extract unique categories from novels
  const categories = useMemo(() => {
    const allGenres = novels.flatMap((novel) => novel.genre || []);
    return Array.from(new Set(allGenres));
  }, [novels]);

  const handleToggleFavorite = useCallback((novelId: string) => {
    setFavorites((prev) =>
      prev.includes(novelId) ? prev.filter((id) => id !== novelId) : [...prev, novelId]
    );
  }, []);

  // Filter, sort, and search novels
  const filteredNovels = useMemo(() => {
    let filtered = novels.filter((novel) => {
      const matchesSearch =
        novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (novel.description && novel.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' ||
        (Array.isArray(novel.genre) && novel.genre.includes(selectedCategory));

      const matchesStatus = status === 'all' || novel.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort novels
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'rating':
          return (b.likes || 0) - (a.likes || 0);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'completed':
          if (a.status === 'completed' && b.status !== 'completed') return -1;
          if (a.status !== 'completed' && b.status === 'completed') return 1;
          return 0;
        case 'latest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [novels, searchQuery, selectedCategory, status, sortBy]);

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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Novel Hero (new look) */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 5, md: 8 },
          pb: { xs: 4, md: 6 },
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(900px circle at 20% 10%, ${alpha(
              theme.palette.primary.main,
              0.18
            )} 0%, transparent 55%), radial-gradient(900px circle at 90% 30%, ${alpha(
              theme.palette.secondary.main,
              0.16
            )} 0%, transparent 55%)`,
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${alpha(
              theme.palette.background.default,
              0
            )} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-end">
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: 2, color: alpha(theme.palette.text.primary, 0.7) }}
                >
                  NOVELS / ЗОХИОЛ
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.05,
                    fontSize: { xs: '2.25rem', sm: '2.8rem', md: '3.5rem' },
                  }}
                >
                  Уншигчийн горимтой
                  <br />
                  романууд
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
                  Хайлт, ангилал, төлөвөөр шүүж — дуртай зохиолоо сонгоод шууд уншаарай.
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1.25,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Роман хайх... (гарчиг / тайлбар)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="carbon:search" />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery ? (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchQuery('')}>
                            <Iconify icon="carbon:close" />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                </Paper>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    Шүүлтүүр
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Ангилал"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <MenuItem value="all">Бүх ангилал</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Төлөв"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Эрэмбэлэх"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        {SORT_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  {(selectedCategory !== 'all' || status !== 'all' || searchQuery) && (
                    <>
                      <Divider sx={{ borderStyle: 'dashed' }} />
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        {searchQuery && (
                          <Chip
                            label={`Хайлт: "${searchQuery}"`}
                            onDelete={() => setSearchQuery('')}
                            size="small"
                          />
                        )}
                        {selectedCategory !== 'all' && (
                          <Chip
                            label={`Ангилал: ${selectedCategory}`}
                            onDelete={() => setSelectedCategory('all')}
                            size="small"
                          />
                        )}
                        {status !== 'all' && (
                          <Chip
                            label={`Төлөв: ${STATUS_OPTIONS.find((s) => s.value === status)
                              ?.label}`}
                            onDelete={() => setStatus('all')}
                            size="small"
                          />
                        )}
                      </Stack>
                    </>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="xl" sx={{ pb: { xs: 5, md: 8 } }}>
        <Stack spacing={2.5} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              Сайжруулсан роман жагсаалт
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredNovels.length} роман
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {filteredNovels.map((novel) => {
            const rating = novel.likes ? Math.min(5, novel.likes / 100) : 4.5;
            const statusLabel =
              STATUS_OPTIONS.find((s) => s.value === novel.status)?.label || 'Үргэлжлэх';

            let statusColor: 'default' | 'warning' | 'success' = 'success';
            if (novel.status === 'completed') statusColor = 'default';
            if (novel.status === 'hiatus') statusColor = 'warning';

            const id = novel._id || novel.id;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                <Card
                  component="a"
                  href={paths.webtoon.novel(id)}
                  onClick={(e: any) => {
                    if (e.target.closest('button') || e.target.closest('.MuiIconButton-root')) {
                      e.preventDefault();
                    }
                  }}
                  sx={{
                    position: 'relative',
                    height: 260,
                    borderRadius: 3,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                    boxShadow: 'none',
                    transition: theme.transitions.create(
                      ['transform', 'box-shadow', 'border-color'],
                      {
                        duration: theme.transitions.duration.shorter,
                      }
                    ),
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      boxShadow: theme.customShadows.z16,
                    },
                  }}
                >
                  {/* Background */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${novel.coverImage || '/assets/placeholder.jpg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'saturate(1.05) contrast(1.02)',
                      transform: 'scale(1.02)',
                    }}
                  />
                  {/* Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(180deg, ${alpha(
                        theme.palette.common.black,
                        0.15
                      )} 0%, ${alpha(theme.palette.common.black, 0.82)} 78%, ${alpha(
                        theme.palette.common.black,
                        0.92
                      )} 100%)`,
                    }}
                  />

                  {/* Top actions */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ position: 'absolute', top: 10, left: 10, right: 10 }}
                  >
                    <Chip
                      size="small"
                      label={statusLabel}
                      color={statusColor}
                      sx={{ fontWeight: 800 }}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(id);
                      }}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.common.white, 0.12),
                        color: 'common.white',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
                        '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.18) },
                      }}
                    >
                      <Iconify
                        icon={favorites.includes(id) ? 'carbon:favorite-filled' : 'carbon:favorite'}
                        sx={{ color: favorites.includes(id) ? 'error.light' : 'common.white' }}
                      />
                    </IconButton>
                  </Stack>

                  {/* Content */}
                  <Box sx={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        color: 'common.white',
                        lineHeight: 1.2,
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {novel.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha(theme.palette.common.white, 0.78),
                        display: 'block',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {novel.author || 'Unknown Author'} • {novel.chapters || 0} бүлэг
                    </Typography>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Rating value={rating} precision={0.5} size="small" readOnly />
                        <Typography
                          variant="caption"
                          sx={{ color: alpha(theme.palette.common.white, 0.9), fontWeight: 800 }}
                        >
                          {rating.toFixed(1)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Iconify
                          icon="carbon:view"
                          width={16}
                          sx={{ color: alpha(theme.palette.common.white, 0.85) }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: alpha(theme.palette.common.white, 0.85), fontWeight: 800 }}
                        >
                          {novel.views || 0}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {filteredNovels.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Iconify icon="carbon:document" sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1, fontWeight: 800 }}>
              Роман олдсонгүй
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Өөр түлхүүр үг эсвэл шүүлтүүр ашиглаад дахин хайж үзээрэй.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
