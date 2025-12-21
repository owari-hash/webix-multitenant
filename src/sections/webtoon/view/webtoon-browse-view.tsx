'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';

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

export default function WebtoonBrowseView() {
  const searchParams = useSearchParams();
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [status, setStatus] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Set category from URL parameter on mount
  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch comics from API with chapter counts
  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api2/webtoon/comics?page=${page}&limit=${limit}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Handle different response formats
        let comicsData: any[] = [];
        if (result.success && Array.isArray(result.data)) {
          comicsData = result.data;
        } else if (result.success && Array.isArray(result.comics)) {
          comicsData = result.comics;
        } else if (Array.isArray(result)) {
          comicsData = result;
        }

        // Update pagination info if available
        if (result.success && result.total !== undefined) {
          setTotal(result.total);
          setTotalPages(result.pages || Math.ceil(result.total / limit));
        }

        // Fetch chapter counts for each comic
        const comicsWithChapters = await Promise.all(
          comicsData.map(async (comic) => {
            const comicId = comic._id || comic.id;

            // Validate ID before making request
            if (!comicId || typeof comicId !== 'string' || comicId.length !== 24) {
              console.warn(`Invalid comic ID: ${comicId}, skipping chapter fetch`);
              return {
                ...comic,
                chapters: comic.chapters || 0,
              };
            }

            try {
              const chaptersResponse = await fetch(`/api2/webtoon/comic/${comicId}/chapters`);

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
                  : comic.chapters || 0;

              return {
                ...comic,
                chapters: chapterCount,
              };
            } catch (error) {
              console.error(`Failed to fetch chapters for comic ${comicId}:`, error);
              return {
                ...comic,
                chapters: comic.chapters || 0,
              };
            }
          })
        );

        setComics(comicsWithChapters);
      } catch (error) {
        console.error('Failed to fetch comics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [page]);

  // Extract unique categories from comics
  const categories = useMemo(() => {
    const allGenres = comics.flatMap((comic) => comic.genre || []);
    return Array.from(new Set(allGenres));
  }, [comics]);

  const handleToggleFavorite = useCallback((webtoonId: string) => {
    setFavorites((prev) =>
      prev.includes(webtoonId) ? prev.filter((id) => id !== webtoonId) : [...prev, webtoonId]
    );
  }, []);

  // Filter, sort, and search comics
  const filteredWebtoons = useMemo(() => {
    let filtered = comics.filter((comic) => {
      const matchesSearch =
        comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comic.description && comic.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' ||
        (Array.isArray(comic.genre) && comic.genre.includes(selectedCategory));

      const matchesStatus = status === 'all' || comic.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort comics
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
  }, [comics, searchQuery, selectedCategory, status, sortBy]);

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
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={{ xs: 3, md: 4 }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
              Комик жагсаалт
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredWebtoons.length} комик олдлоо
            </Typography>
          </Box>
        </Stack>

        {/* Filters */}
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Search */}
            <TextField
              fullWidth
              placeholder="Комик хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="carbon:search" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filter Row */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {/* Category Filter */}
              <TextField
                select
                label="Ангилал"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">Бүх ангилал</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              {/* Status Filter */}
              <TextField
                select
                label="Төлөв"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Sort */}
              <TextField
                select
                label="Эрэмбэлэх"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || status !== 'all' || searchQuery) && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
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
                    label={`Төлөв: ${STATUS_OPTIONS.find((s) => s.value === status)?.label}`}
                    onDelete={() => setStatus('all')}
                    size="small"
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Comics Grid */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {filteredWebtoons.map((webtoon) => {
            const rating = webtoon.likes ? Math.min(5, webtoon.likes / 100) : 4.5;
            const statusLabel =
              STATUS_OPTIONS.find((s) => s.value === webtoon.status)?.label || 'Үргэлжлэх';

            let statusColor: 'default' | 'warning' | 'success' = 'success';
            if (webtoon.status === 'completed') {
              statusColor = 'default';
            } else if (webtoon.status === 'hiatus') {
              statusColor = 'warning';
            }

            return (
              <Grid item xs={6} sm={6} md={4} lg={3} key={webtoon._id || webtoon.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: (theme) => theme.customShadows.z24,
                    },
                  }}
                  component="a"
                  href={paths.webtoon.comic(webtoon._id || webtoon.id)}
                  onClick={(e: any) => {
                    if (e.target.closest('button') || e.target.closest('.MuiIconButton-root')) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        display: 'block',
                        paddingBottom: '133.33%', // 3:4 ratio
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={webtoon.coverImage || '/assets/placeholder.jpg'}
                      alt={webtoon.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Favorite Button */}
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(webtoon._id || webtoon.id);
                      }}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: 1,
                        '&:hover': {
                          bgcolor: 'white',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <Iconify
                        icon={
                          favorites.includes(webtoon._id || webtoon.id)
                            ? 'carbon:favorite-filled'
                            : 'carbon:favorite'
                        }
                        sx={{
                          color: favorites.includes(webtoon._id || webtoon.id)
                            ? 'error.main'
                            : 'text.secondary',
                        }}
                      />
                    </IconButton>

                    {/* Status Badge */}
                    <Chip
                      label={statusLabel}
                      size="small"
                      color={statusColor}
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Stack spacing={1.5} sx={{ p: 2, flex: 1 }}>
                    {/* Title */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: { xs: 40, sm: 48 },
                        lineHeight: 1.4,
                      }}
                    >
                      {webtoon.title}
                    </Typography>

                    {/* Author */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {webtoon.author || 'Unknown Author'}
                    </Typography>

                    {/* Genres */}
                    {Array.isArray(webtoon.genre) && webtoon.genre.length > 0 && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        {webtoon.genre.slice(0, 2).map((genre: string, index: number) => (
                          <Chip
                            key={`${genre}-${index}`}
                            label={genre}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              '& .MuiChip-label': {
                                px: 0.75,
                              },
                            }}
                          />
                        ))}
                        {webtoon.genre.length > 2 && (
                          <Chip
                            label={`+${webtoon.genre.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              '& .MuiChip-label': {
                                px: 0.75,
                              },
                            }}
                          />
                        )}
                      </Stack>
                    )}

                    <Box sx={{ flex: 1 }} />

                    {/* Stats Section */}
                    <Stack
                      spacing={1}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
                      }}
                    >
                      {/* Rating & Views */}
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Rating value={rating} precision={0.5} size="small" readOnly />
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            sx={{ color: 'warning.main' }}
                          >
                            {rating.toFixed(1)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify icon="carbon:view" width={16} sx={{ color: 'info.main' }} />
                          <Typography variant="body2" fontWeight={600} color="text.primary">
                            {(() => {
                              const views = webtoon.views || 0;
                              if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
                              if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
                              return views;
                            })()}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Chapters */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: (theme) =>
                            theme.palette.mode === 'light' ? 'primary.lighter' : 'primary.dark',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Iconify
                            icon="carbon:document"
                            width={18}
                            sx={{ color: 'primary.main' }}
                          />
                          <Typography variant="body2" fontWeight={700} color="primary.main">
                            Бүлэг
                          </Typography>
                        </Stack>
                        <Chip
                          label={webtoon.chapters || 0}
                          size="small"
                          sx={{
                            height: 24,
                            fontWeight: 700,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '& .MuiChip-label': {
                              px: 1.5,
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => {
                setPage(value);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* No Results */}
        {filteredWebtoons.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Iconify icon="carbon:search" sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              Комик олдсонгүй
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Өөр түлхүүр үг эсвэл шүүлтүүр ашиглан дахин хайж үзээрэй
            </Typography>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
