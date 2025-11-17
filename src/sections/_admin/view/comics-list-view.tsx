'use client';

import React, { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TableContainer from '@mui/material/TableContainer';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import {
  Grid,
  TextField,
  ToggleButton,
  InputAdornment,
  CircularProgress,
  ToggleButtonGroup,
} from '@mui/material';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = {
  ongoing: { label: 'Үргэлжилж байгаа', color: 'info' as const },
  completed: { label: 'Дууссан', color: 'success' as const },
  hiatus: { label: 'Түр зогссон', color: 'warning' as const },
};

export default function ComicsListView() {
  const theme = useTheme();
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'likes' | 'chapters'>('recent');

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('/api2/webtoon/comics');
        const result = await response.json();

        // Handle both result.data and result.comics
        let comicsData: any[] = [];
        if (result.success && Array.isArray(result.data)) {
          comicsData = result.data;
        } else if (result.success && Array.isArray(result.comics)) {
          comicsData = result.comics;
        } else if (Array.isArray(result)) {
          comicsData = result;
        }

        setComics(comicsData);
      } catch (error) {
        console.error('Fetch comics error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  // Filter and sort comics
  const filteredComics = useMemo(() => {
    let filtered = comics;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (comic) =>
          comic.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comic.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((comic) => comic.status === statusFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === 'likes') {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortBy === 'chapters') {
        return (b.chapters || 0) - (a.chapters || 0);
      }
      return 0;
    });

    return filtered;
  }, [comics, searchQuery, statusFilter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalViews = comics.reduce((sum, comic) => sum + (comic.views || 0), 0);
    const totalLikes = comics.reduce((sum, comic) => sum + (comic.likes || 0), 0);
    const totalChapters = comics.reduce((sum, comic) => sum + (comic.chapters || 0), 0);
    const ongoingCount = comics.filter((c) => c.status === 'ongoing').length;
    const completedCount = comics.filter((c) => c.status === 'completed').length;

    return {
      total: comics.length,
      totalViews,
      totalLikes,
      totalChapters,
      ongoingCount,
      completedCount,
    };
  }, [comics]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}М`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}К`;
    return num.toString();
  };

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          py: { xs: 3, md: 5 },
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        }}
      >
        <Container>
          <Stack spacing={3}>
            <Breadcrumbs
              separator={<Iconify icon="carbon:chevron-right" width={16} />}
              sx={{ color: 'text.secondary' }}
            >
              <Button
                component={RouterLink}
                href={paths.webtoon.cms.dashboard}
                color="inherit"
                startIcon={<Iconify icon="carbon:dashboard" />}
                sx={{ minWidth: 'auto' }}
              >
                Хяналтын самбар
              </Button>
              <Typography color="text.primary">Комикууд</Typography>
            </Breadcrumbs>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon="carbon:book"
                    sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                  />
                </Box>

                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    Комикууд
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {filteredComics.length} / {comics.length} комик
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                href={paths.webtoon.cms.createComic}
                startIcon={<Iconify icon="carbon:add" />}
              >
                Шинэ комик
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Statistics & Content */}
      <Container sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={4}>
          {/* Statistics Cards */}
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify icon="carbon:book" sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Нийт комик
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify
                  icon="carbon:page-break"
                  sx={{ fontSize: 32, color: 'success.main', mb: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.totalChapters}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Нийт бүлэг
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify icon="carbon:view" sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {formatNumber(stats.totalViews)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Нийт үзэлт
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify
                  icon="carbon:favorite-filled"
                  sx={{ fontSize: 32, color: 'error.main', mb: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {formatNumber(stats.totalLikes)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Нийт лайк
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify icon="carbon:renew" sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.ongoingCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Үргэлжилж байгаа
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Iconify
                  icon="carbon:checkmark-filled"
                  sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.completedCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Дууссан
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Search & Filters */}
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Комик эсвэл зохиолч хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="carbon:search" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <Iconify icon="carbon:close" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Sort */}
                <ToggleButtonGroup
                  value={sortBy}
                  exclusive
                  onChange={(_, value) => value && setSortBy(value)}
                  size="small"
                  sx={{ flexShrink: 0 }}
                >
                  <ToggleButton value="recent">
                    <Iconify icon="carbon:time" sx={{ mr: 0.5 }} />
                    Сүүлийн
                  </ToggleButton>
                  <ToggleButton value="views">
                    <Iconify icon="carbon:view" sx={{ mr: 0.5 }} />
                    Үзэлт
                  </ToggleButton>
                  <ToggleButton value="likes">
                    <Iconify icon="carbon:favorite" sx={{ mr: 0.5 }} />
                    Лайк
                  </ToggleButton>
                  <ToggleButton value="chapters">
                    <Iconify icon="carbon:page-break" sx={{ mr: 0.5 }} />
                    Бүлэг
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              {/* Status Filter */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label="Бүгд"
                  color={statusFilter === 'all' ? 'primary' : 'default'}
                  onClick={() => setStatusFilter('all')}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Үргэлжилж байгаа"
                  color={statusFilter === 'ongoing' ? 'info' : 'default'}
                  onClick={() => setStatusFilter('ongoing')}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Дууссан"
                  color={statusFilter === 'completed' ? 'success' : 'default'}
                  onClick={() => setStatusFilter('completed')}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Түр зогссон"
                  color={statusFilter === 'hiatus' ? 'warning' : 'default'}
                  onClick={() => setStatusFilter('hiatus')}
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>
            </Stack>
          </Card>

          {/* Table */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Комик</TableCell>
                    <TableCell>Төрөл</TableCell>
                    <TableCell>Төлөв</TableCell>
                    <TableCell align="center">Бүлгүүд</TableCell>
                    <TableCell align="center">Үзэлт</TableCell>
                    <TableCell align="center">Лайк</TableCell>
                    <TableCell align="center">Шинэчлэгдсэн</TableCell>
                    <TableCell align="right">Үйлдэл</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Комикууд уншиж байна...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && comics.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                        <Iconify
                          icon="carbon:book"
                          sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                          Одоогоор комик байхгүй байна
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                          Эхний комикоо нэмж эхлээрэй!
                        </Typography>
                        <Button
                          variant="contained"
                          component={RouterLink}
                          href={paths.webtoon.cms.createComic}
                          startIcon={<Iconify icon="carbon:add" />}
                        >
                          Эхний комик нэмэх
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && comics.length > 0 && filteredComics.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                        <Iconify
                          icon="carbon:search"
                          sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                          Комик олдсонгүй
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Өөр хайлтаар оролдоно уу
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    filteredComics.length > 0 &&
                    filteredComics.map((comic) => (
                      <ComicTableRow key={comic._id || comic.id} comic={comic} />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

type ComicTableRowProps = {
  comic: any;
};

function ComicTableRow({ comic }: ComicTableRowProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    handleClose();

    if (!window.confirm(`"${comic.title}" комикийг устгах уу?`)) {
      return;
    }

    try {
      const response = await fetch(`/api2/webtoon/comic/${comic._id || comic.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        alert('Комик амжилттай устгагдлаа!');
        window.location.reload();
      } else {
        alert(result.error || result.message || 'Устгахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Delete comic error:', error);
      alert('Сүлжээний алдаа. Дахин оролдоно уу.');
    }
  };

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            variant="rounded"
            src={comic.coverImage}
            sx={{
              width: 56,
              height: 72,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Iconify icon="carbon:book" sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comic.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ID: {comic._id || comic.id}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {Array.isArray(comic.genre) && comic.genre.length > 0 ? (
            comic.genre
              .slice(0, 2)
              .map((g: string) => (
                <Chip key={g} label={g} size="small" sx={{ fontSize: '0.7rem' }} />
              ))
          ) : (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              -
            </Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell>
        <Chip
          label={STATUS_OPTIONS[comic.status as keyof typeof STATUS_OPTIONS].label}
          color={STATUS_OPTIONS[comic.status as keyof typeof STATUS_OPTIONS].color}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">{comic.chapters || 0}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">
          {(() => {
            const views = comic.views || 0;
            if (views >= 1000000) return `${(views / 1000000).toFixed(1)}М`;
            if (views >= 1000) return `${(views / 1000).toFixed(1)}К`;
            return views;
          })()}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
          <Iconify icon="carbon:favorite-filled" sx={{ color: 'error.main', fontSize: 16 }} />
          <Typography variant="body2">{comic.likes || 0}</Typography>
        </Stack>
      </TableCell>

      <TableCell align="center">
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {comic.updatedAt ? new Date(comic.updatedAt).toLocaleDateString('mn-MN') : '-'}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <IconButton color={open ? 'inherit' : 'default'} onClick={handleClick}>
          <Iconify icon="carbon:overflow-menu-vertical" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {[
            <MenuItem
              key="manage"
              component={RouterLink}
              href={paths.webtoon.cms.manageComic(comic._id || comic.id)}
              onClick={handleClose}
            >
              <Iconify icon="carbon:settings" sx={{ mr: 1 }} />
              Удирдах
            </MenuItem>,
            <MenuItem
              key="view"
              component={RouterLink}
              href={`/webtoon/comic/${comic._id || comic.id}`}
              onClick={handleClose}
            >
              <Iconify icon="carbon:view" sx={{ mr: 1 }} />
              Үзэх
            </MenuItem>,
            <MenuItem
              key="edit"
              component={RouterLink}
              href={`/cms/comics/edit/${comic._id || comic.id}`}
              onClick={handleClose}
            >
              <Iconify icon="carbon:edit" sx={{ mr: 1 }} />
              Засах
            </MenuItem>,
            <MenuItem
              key="chapters"
              component={RouterLink}
              href={paths.webtoon.cms.chapters(comic._id || comic.id)}
              onClick={handleClose}
            >
              <Iconify icon="carbon:page-break" sx={{ mr: 1 }} />
              Бүлгүүд
            </MenuItem>,
            <MenuItem key="delete" onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="carbon:trash-can" sx={{ mr: 1 }} />
              Устгах
            </MenuItem>,
          ]}
        </Menu>
      </TableCell>
    </TableRow>
  );
}
