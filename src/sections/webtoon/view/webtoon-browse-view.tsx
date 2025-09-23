'use client';

import { useState, useCallback } from 'react';

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

import { paths } from 'src/routes/paths';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { _webtoons, _webtoonCategories } from 'src/_mock';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [status, setStatus] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleToggleFavorite = useCallback((webtoonId: string) => {
    setFavorites((prev) =>
      prev.includes(webtoonId) ? prev.filter((id) => id !== webtoonId) : [...prev, webtoonId]
    );
  }, []);

  const filteredWebtoons = _webtoons.filter((webtoon) => {
    const matchesSearch =
      webtoon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webtoon.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || webtoon.genre === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                {_webtoonCategories.map((category) => (
                  <MenuItem key={category.id} value={category.slug}>
                    {category.name}
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
                    label={`Ангилал: ${_webtoonCategories.find((c) => c.slug === selectedCategory)
                      ?.name}`}
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
          {filteredWebtoons.map((webtoon) => (
            <Grid key={webtoon.id} xs={12} sm={6} md={4} lg={3}>
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
                    src={webtoon.coverUrl}
                    alt={webtoon.title}
                    ratio="3/4"
                    sx={{ borderRadius: '8px 8px 0 0' }}
                  />

                  {/* Favorite Button */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(webtoon.id);
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
                        color: favorites.includes(webtoon.id) ? 'error.main' : 'text.secondary',
                      }}
                    />
                  </IconButton>

                  {/* Status Badge */}
                  <Chip
                    label="Үргэлжлэх"
                    size="small"
                    color="success"
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

                  {/* Author */}
                  <Typography variant="body2" color="text.secondary">
                    {webtoon.author}
                  </Typography>

                  {/* Genre */}
                  <Chip
                    label={webtoon.genre}
                    size="small"
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  />

                  {/* Rating & Views */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Rating value={4.5} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary">
                        4.5
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Iconify icon="carbon:view" width={16} />
                      <Typography variant="caption" color="text.secondary">
                        12.5K
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      href={paths.webtoon.comic(webtoon.id)}
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
          ))}
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
