'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useSnackbar } from 'src/components/snackbar';
import { backendRequest } from 'src/utils/backend-api';
import { isAuthenticated } from 'src/utils/auth';
import CommentsSection from '../components/comments-section';

// ----------------------------------------------------------------------

type Props = {
  novelId: string;
};

const STATUS_MAP: Record<
  string,
  { label: string; color: 'success' | 'warning' | 'error' | 'default' }
> = {
  ongoing: { label: 'Үргэлжилж байна', color: 'success' },
  completed: { label: 'Дууссан', color: 'default' },
  hiatus: { label: 'Түр зогссон', color: 'warning' },
};

export default function NovelDetailView({ novelId }: Props) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [novel, setNovel] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [activeSort, setActiveSort] = useState<'asc' | 'desc'>('asc');
  const [tab, setTab] = useState<'overview' | 'chapters' | 'comments'>('chapters');
  const [chapterQuery, setChapterQuery] = useState('');
  const [continueChapterId, setContinueChapterId] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  // IMPORTANT: keep hooks above any conditional returns (rule of hooks)
  const sortedChapters = useMemo(() => {
    const copy = [...(chapters || [])];
    copy.sort((a, b) => {
      const aNum = Number(a.chapterNumber || 0);
      const bNum = Number(b.chapterNumber || 0);
      return activeSort === 'asc' ? aNum - bNum : bNum - aNum;
    });
    return copy;
  }, [chapters, activeSort]);

  const firstChapter = sortedChapters.length ? sortedChapters[0] : null;

  const filteredForGrid = useMemo(() => {
    const q = chapterQuery.trim().toLowerCase();
    if (!q) return sortedChapters;
    return sortedChapters.filter((ch) => {
      const title = String(ch.title || '').toLowerCase();
      const num = String(ch.chapterNumber || '').toLowerCase();
      return title.includes(q) || num.includes(q);
    });
  }, [sortedChapters, chapterQuery]);

  const formatCount = (n: number) => {
    const num = Number(n || 0);
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return `${num}`;
  };

  const getContinueReadingHref = useMemo(() => {
    if (continueChapterId && novel) {
      return paths.webtoon.novelChapter(novel._id || novel.id, continueChapterId);
    }
    if (firstChapter && novel) {
      return paths.webtoon.novelChapter(novel._id || novel.id, firstChapter._id || firstChapter.id);
    }
    return undefined;
  }, [continueChapterId, firstChapter, novel]);

  useEffect(() => {
    // Continue reading (persisted by reader page)
    try {
      const raw = localStorage.getItem(`novel_last_read_${novelId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.chapterId) setContinueChapterId(parsed.chapterId);
    } catch (e) {
      // ignore
    }
  }, [novelId]);

  useEffect(() => {
    const fetchNovelData = async () => {
      try {
        // Fetch novel details
        const novelResponse = await fetch(`/api2/novel/${novelId}`);
        const novelResult = await novelResponse.json();

        if (novelResult.success && novelResult.novel) {
          setNovel(novelResult.novel);
        }

        // Fetch chapters
        const chaptersResponse = await fetch(`/api2/novel/${novelId}/chapters`);
        const chaptersResult = await chaptersResponse.json();

        if (chaptersResult.success && chaptersResult.chapters) {
          setChapters(chaptersResult.chapters);
        }

        // Check favorite status (only if user is authenticated)
        if (isAuthenticated() && novelResult.success && novelResult.novel) {
          try {
            const favoritesResponse = await backendRequest<{
              favorites?: Array<{ _id: string; novelId?: string | any; novel?: any }>;
            }>('/webtoon/user/favorites?limit=1000');

            if (favoritesResponse.success && (favoritesResponse as any).favorites) {
              const favorites = (favoritesResponse as any).favorites as Array<any>;
              const targetNovelId = String(novelId || novelResult.novel._id);

              const favorite = favorites.find((fav: any) => {
                if (fav.novelId) return String(fav.novelId) === targetNovelId;
                if (fav.novel && fav.novel._id) return String(fav.novel._id) === targetNovelId;
                return false;
              });

              if (favorite) {
                setIsFavorite(true);
                setFavoriteId(String(favorite._id));
              }
            }
          } catch (error) {
            console.error('Failed to check favorite status:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch novel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovelData();
  }, [novelId]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated()) {
      enqueueSnackbar('Та эхлээд нэвтэрнэ үү!', { variant: 'warning' });
      return;
    }

    if (favoriteLoading) return;
    setFavoriteLoading(true);

    try {
      if (isFavorite && favoriteId) {
        const resp = await backendRequest(`/webtoon/user/favorites/${favoriteId}`, {
          method: 'DELETE',
        });

        if (resp.success) {
          setIsFavorite(false);
          setFavoriteId(null);
          enqueueSnackbar('Дуртай жагсаалтаас хасагдлаа', { variant: 'success' });
        } else {
          enqueueSnackbar(resp.message || 'Хасахад алдаа гарлаа', { variant: 'error' });
        }
      } else {
        const resp = await backendRequest('/webtoon/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ novelId: novelId || novel?._id }),
        });

        const created = (resp as any)?.favorite;
        if (resp.success && created?._id) {
          setIsFavorite(true);
          setFavoriteId(String(created._id));
          enqueueSnackbar('Дуртай жагсаалтад нэмэгдлээ', { variant: 'success' });
        } else {
          enqueueSnackbar(resp.message || 'Нэмэхэд алдаа гарлаа', { variant: 'error' });
        }
      }
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      enqueueSnackbar(error?.message || 'Алдаа гарлаа', { variant: 'error' });
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (typeof window === 'undefined') return;
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopyHint('Холбоос хуулагдлаа');
      window.setTimeout(() => setCopyHint(null), 1500);
    } catch (e) {
      setCopyHint('Хуулж чадсангүй');
      window.setTimeout(() => setCopyHint(null), 1500);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  if (!novel) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" color="text.secondary">
            Зохиол олдсонгүй
          </Typography>
        </Box>
      </Container>
    );
  }

  const rating = novel.likes ? Math.min(5, novel.likes / 100) : 4.5;
  const statusInfo = STATUS_MAP[novel.status] || STATUS_MAP.ongoing;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Book-style header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  backgroundImage: `url(${novel.coverImage || '/assets/placeholder.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: theme.customShadows.z16,
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, ${alpha(
                      theme.palette.common.black,
                      0.0
                    )} 0%, ${alpha(theme.palette.common.black, 0.55)} 100%)`,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Button
                    component={RouterLink}
                    href={paths.webtoon.novels}
                    size="small"
                    color="inherit"
                    startIcon={<Iconify icon="carbon:arrow-left" />}
                    sx={{ fontWeight: 900, borderRadius: 999 }}
                  >
                    Зохиолууд
                  </Button>
                  <Tooltip title={copyHint || 'Холбоос хуулах'}>
                    <IconButton onClick={handleCopyLink} size="small">
                      <Iconify icon="carbon:link" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Chip label="BOOK" size="small" sx={{ fontWeight: 900, letterSpacing: 1 }} />
                  <Chip
                    label={statusInfo.label}
                    color={statusInfo.color}
                    size="small"
                    sx={{ fontWeight: 900 }}
                  />
                  <Chip label={`${chapters.length} бүлэг`} size="small" sx={{ fontWeight: 900 }} />
                </Stack>

                <Typography variant="h3" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                  {novel.title}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ gap: 1.5 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="carbon:user" width={18} />
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {novel.author || 'Unknown Author'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={rating} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>
                      {rating.toFixed(1)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="carbon:view" width={18} />
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>
                      {formatCount(novel.views || 0)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="carbon:favorite-filled" width={18} />
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>
                      {formatCount(novel.likes || 0)}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Iconify icon="carbon:play" />}
                    component={continueChapterId || firstChapter ? RouterLink : 'button'}
                    href={getContinueReadingHref}
                    disabled={!continueChapterId && !firstChapter}
                    sx={{
                      borderRadius: 999,
                      px: 3,
                      py: 1.5,
                      fontWeight: 950,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    }}
                  >
                    {continueChapterId ? 'Үргэлжлүүлэх' : 'Эхнээс унших'}
                  </Button>
                  <Button
                    variant={isFavorite ? 'contained' : 'outlined'}
                    color={isFavorite ? 'error' : 'inherit'}
                    size="large"
                    startIcon={
                      <Iconify icon={isFavorite ? 'carbon:favorite-filled' : 'carbon:favorite'} />
                    }
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                    sx={{ borderRadius: 999, px: 3, py: 1.5, fontWeight: 950, borderWidth: 2 }}
                  >
                    {isFavorite ? 'Дуртай' : 'Дуртайд нэмэх'}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs (completely different structure) */}
        <Box sx={{ mt: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': { fontWeight: 900, textTransform: 'none' },
            }}
          >
            <Tab
              value="overview"
              label="Танилцуулга"
              icon={<Iconify icon="carbon:information" />}
              iconPosition="start"
            />
            <Tab
              value="chapters"
              label="Бүлгүүд"
              icon={<Iconify icon="carbon:document" />}
              iconPosition="start"
            />
            <Tab
              value="comments"
              label="Сэтгэгдэл"
              icon={<Iconify icon="carbon:chat" />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {tab === 'overview' && (
          <Card
            sx={{
              mt: 2,
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              boxShadow: 'none',
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h5" sx={{ fontWeight: 950 }}>
                Товч танилцуулга
              </Typography>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
                {novel.description || 'Тайлбар байхгүй байна.'}
              </Typography>
              {Array.isArray(novel.genre) && novel.genre.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  {novel.genre.map((g: string) => (
                    <Chip
                      key={g}
                      label={g}
                      size="small"
                      sx={{
                        fontWeight: 900,
                        bgcolor: alpha(theme.palette.secondary.main, 0.12),
                        color: 'secondary.main',
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          </Card>
        )}

        {tab === 'chapters' && (
          <Card
            sx={{
              mt: 2,
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              boxShadow: 'none',
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ sm: 'center' }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 950 }}>
                    Бүлгийн жагсаалт
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Нийт {sortedChapters.length} бүлэг
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="carbon:sort-ascending" />}
                    onClick={() => setActiveSort((v) => (v === 'asc' ? 'desc' : 'asc'))}
                    sx={{ fontWeight: 900, borderWidth: 2, borderRadius: 999 }}
                  >
                    {activeSort === 'asc' ? 'Өсөхөөр' : 'Буурахаар'}
                  </Button>
                </Stack>
              </Stack>

              <TextField
                fullWidth
                size="small"
                placeholder="Бүлэг хайх... (дугаар/гарчиг)"
                value={chapterQuery}
                onChange={(e) => setChapterQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="carbon:search" />
                    </InputAdornment>
                  ),
                  endAdornment: chapterQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setChapterQuery('')}>
                        <Iconify icon="carbon:close" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />

              <Divider sx={{ borderStyle: 'dashed' }} />

              {filteredForGrid.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Iconify
                    icon="carbon:document-blank"
                    sx={{ fontSize: 72, color: 'text.disabled', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 900 }}>
                    {sortedChapters.length === 0
                      ? 'Бүлэг байхгүй байна'
                      : 'Хайлтад тохирох бүлэг олдсонгүй'}
                  </Typography>
                </Box>
              ) : (
                <List disablePadding sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  {filteredForGrid.map((ch) => (
                    <ListItemButton
                      key={ch._id || ch.id}
                      component={RouterLink}
                      href={paths.webtoon.novelChapter(novel._id || novel.id, ch._id || ch.id)}
                      sx={{
                        py: 1.5,
                        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: 'primary.main',
                            fontWeight: 950,
                            fontSize: 14,
                          }}
                        >
                          {ch.chapterNumber}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                            {ch.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {ch.createdAt
                              ? new Date(ch.createdAt).toLocaleDateString('mn-MN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : '-'}
                            {continueChapterId && (ch._id || ch.id) === continueChapterId
                              ? ' • Continue'
                              : ''}
                          </Typography>
                        }
                      />
                      <Iconify icon="carbon:chevron-right" />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Stack>
          </Card>
        )}

        {tab === 'comments' && (
          <Box sx={{ mt: 2 }}>
            <CommentsSection novelId={novelId} />
          </Box>
        )}
      </Container>
    </Box>
  );
}
