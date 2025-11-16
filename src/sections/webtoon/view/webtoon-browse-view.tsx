'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

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

import { paths } from 'src/routes/paths';
import Image from 'src/components/image';
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
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [status, setStatus] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch comics from API
  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('/api2/webtoon/comics');
        const result = await response.json();
        
        if (result.success && result.comics) {
          setComics(result.comics);
        }
      } catch (error) {
        console.error('Failed to fetch comics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={5}>
        {/* Header */}
        <Box>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Жагсаалт
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {filteredWebtoons.length} комик олдлоо
          </Typography>
        </Box>

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
        <Grid container spacing={3}>
          {filteredWebtoons.map((webtoon) => {
            const rating = webtoon.likes ? Math.min(5, webtoon.likes / 100) : 4.5;
            const statusLabel = STATUS_OPTIONS.find((s) => s.value === webtoon.status)?.label || 'Үргэлжлэх';
            const statusColor = 
              webtoon.status === 'completed' ? 'default' : 
              webtoon.status === 'hiatus' ? 'warning' : 'success';
            
            return (
              <Grid key={webtoon._id || webtoon.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.customShadows.z20,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Image
                      src={webtoon.coverImage || '/assets/placeholder.jpg'}
                      alt={webtoon.title}
                      ratio="3/4"
                      sx={{ borderRadius: '8px 8px 0 0' }}
                    />

                    {/* Favorite Button */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(webtoon._id || webtoon.id);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                    >
                      <Iconify
                        icon="carbon:favorite"
                        sx={{
                          color: favorites.includes(webtoon._id || webtoon.id) ? 'error.main' : 'text.secondary',
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
                      }}
                    />
                  </Box>

                  <Stack spacing={2} sx={{ p: 2 }}>
                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {webtoon.title}
                    </Typography>

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: 40,
                      }}
                    >
                      {webtoon.description || 'No description available'}
                    </Typography>

                    {/* Genres */}
                    {Array.isArray(webtoon.genre) && webtoon.genre.length > 0 && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {webtoon.genre.slice(0, 2).map((genre: string) => (
                          <Chip
                            key={genre}
                            label={genre}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    )}

                    {/* Rating & Views */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Rating value={rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary">
                          {rating.toFixed(1)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify icon="carbon:view" width={16} />
                        <Typography variant="caption" color="text.secondary">
                          {webtoon.views >= 1000 
                            ? `${(webtoon.views / 1000).toFixed(1)}K` 
                            : webtoon.views || 0}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        href={paths.webtoon.comic(webtoon._id || webtoon.id)}
                      >
                        Унших
                      </Button>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to library logic
                        }}
                      >
                        <Iconify icon="carbon:add" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Load More */}
        {filteredWebtoons.length > 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="outlined" size="large">
              Илүү ачаалах
            </Button>
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
