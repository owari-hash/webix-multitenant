'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
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

export default function ComicManageView({ comicId }: Props) {
  const theme = useTheme();
  const [comic, setComic] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('overview');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteChapterId, setDeleteChapterId] = useState<string | null>(null);

  useEffect(() => {
    fetchComicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comicId]);

  const fetchComicData = async () => {
    try {
      setLoading(true);

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

  const handleDeleteChapter = async (chapterId: string) => {
    try {
      const response = await fetch(`/api2/webtoon/chapter/${chapterId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setChapters(chapters.filter((ch) => (ch._id || ch.id) !== chapterId));
        setDeleteDialogOpen(false);
        setDeleteChapterId(null);
      } else {
        alert(result.message || 'Бүлэг устгахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Failed to delete chapter:', error);
      alert('Бүлэг устгахад алдаа гарлаа');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!comic) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" color="text.secondary">
            Комик олдсонгүй
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            href={paths.webtoon.cms.comics}
            sx={{ mt: 3 }}
          >
            Буцах
          </Button>
        </Box>
      </Container>
    );
  }

  const totalViews = chapters.reduce((sum, ch) => sum + (ch.views || 0), 0);
  const avgViewsPerChapter = chapters.length > 0 ? Math.round(totalViews / chapters.length) : 0;
  const statusInfo = STATUS_MAP[comic.status] || STATUS_MAP.ongoing;

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Typography
              component={RouterLink}
              href={paths.webtoon.cms.dashboard}
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              CMS
            </Typography>
            <Typography
              component={RouterLink}
              href={paths.webtoon.cms.comics}
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Комикууд
            </Typography>
            <Typography color="text.primary">Удирдах</Typography>
          </Breadcrumbs>

          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Комик удирдах
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                component={RouterLink}
                href={paths.webtoon.comic(comicId)}
                startIcon={<Iconify icon="carbon:view" />}
              >
                Үзэх
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                href={paths.webtoon.cms.createChapter(comicId)}
                startIcon={<Iconify icon="carbon:add" />}
              >
                Бүлэг нэмэх
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Comic Overview Card */}
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Cover Image */}
            <Grid item xs={12} md={3}>
              <Box
                component="img"
                src={comic.coverImage || '/assets/placeholder.jpg'}
                alt={comic.title}
                sx={{
                  width: '100%',
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Grid>

            {/* Comic Info */}
            <Grid item xs={12} md={9}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {comic.title}
                  </Typography>
                  <Chip label={statusInfo.label} color={statusInfo.color} sx={{ fontWeight: 600 }} />
                </Stack>

                {comic.author && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="carbon:user" sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      {comic.author}
                    </Typography>
                  </Stack>
                )}

                {Array.isArray(comic.genre) && comic.genre.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {comic.genre.map((genre: string) => (
                      <Chip key={genre} label={genre} size="small" variant="outlined" />
                    ))}
                  </Stack>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {comic.description || 'Тайлбар байхгүй'}
                </Typography>

                <Divider />

                {/* Stats */}
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Бүлэг
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {chapters.length}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Үзэлт
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatNumber(comic.views || 0)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Лайк
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatNumber(comic.likes || 0)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Огноо
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatDate(comic.createdAt)}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        {/* Tabs */}
        <Box>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Бүлгүүд" value="overview" />
            <Tab label="Статистик" value="stats" />
            <Tab label="Тохиргоо" value="settings" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {currentTab === 'overview' && (
          <Card>
            <Box sx={{ p: 3, pb: 0 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontWeight={700}>
                  Бүх бүлгүүд ({chapters.length})
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  component={RouterLink}
                  href={paths.webtoon.cms.createChapter(comicId)}
                  startIcon={<Iconify icon="carbon:add" />}
                >
                  Шинэ бүлэг
                </Button>
              </Stack>
            </Box>

            {chapters.length === 0 ? (
              <Box sx={{ p: 8, textAlign: 'center' }}>
                <Iconify icon="carbon:document-blank" sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Бүлэг байхгүй байна
                </Typography>
                <Button
                  variant="contained"
                  component={RouterLink}
                  href={paths.webtoon.cms.createChapter(comicId)}
                  startIcon={<Iconify icon="carbon:add" />}
                  sx={{ mt: 2 }}
                >
                  Анхны бүлгийг нэмэх
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Гарчиг</TableCell>
                      <TableCell align="center">Зураг</TableCell>
                      <TableCell align="center">Үзэлт</TableCell>
                      <TableCell align="center">Огноо</TableCell>
                      <TableCell align="right">Үйлдэл</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chapters.map((chapter) => (
                      <TableRow key={chapter._id || chapter.id} hover>
                        <TableCell>
                          <Chip label={`#${chapter.chapterNumber}`} color="primary" size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {chapter.title}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                            <Iconify icon="carbon:image" sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {Array.isArray(chapter.images) ? chapter.images.length : 0}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{formatNumber(chapter.views || 0)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(chapter.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <IconButton
                              size="small"
                              component={RouterLink}
                              href={paths.webtoon.chapter(comicId, chapter._id || chapter.id)}
                              sx={{ color: 'info.main' }}
                            >
                              <Iconify icon="carbon:view" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setDeleteChapterId(chapter._id || chapter.id);
                                setDeleteDialogOpen(true);
                              }}
                              sx={{ color: 'error.main' }}
                            >
                              <Iconify icon="carbon:trash-can" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        )}

        {currentTab === 'stats' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <Iconify icon="carbon:document" sx={{ fontSize: 28, color: 'primary.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={800}>
                      {chapters.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Нийт бүлэг
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                    }}
                  >
                    <Iconify icon="carbon:view" sx={{ fontSize: 28, color: 'info.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={800}>
                      {formatNumber(totalViews)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Нийт үзэлт (бүлгүүд)
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                    }}
                  >
                    <Iconify icon="carbon:chart-line" sx={{ fontSize: 28, color: 'warning.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={800}>
                      {formatNumber(avgViewsPerChapter)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Дундаж үзэлт
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                    }}
                  >
                    <Iconify icon="carbon:favorite" sx={{ fontSize: 28, color: 'error.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={800}>
                      {formatNumber(comic.likes || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Нийт лайк
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            {/* Chapter Performance Chart Placeholder */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Бүлгүүдийн гүйцэтгэл
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.grey[500], 0.04),
                    borderRadius: 2,
                    mt: 2,
                  }}
                >
                  <Stack spacing={2} alignItems="center">
                    <Iconify icon="carbon:chart-bar" sx={{ fontSize: 64, color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary">
                      График удахгүй нэмэгдэнэ
                    </Typography>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {currentTab === 'settings' && (
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight={700}>
                Тохиргоо
              </Typography>

              <Divider />

              <Stack spacing={2}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Хурдан үйлдлүүд
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Iconify icon="carbon:edit" />}
                      component={RouterLink}
                      href={paths.webtoon.cms.editComic(comicId)}
                    >
                      Комик засах
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Iconify icon="carbon:add" />}
                      component={RouterLink}
                      href={paths.webtoon.cms.createChapter(comicId)}
                    >
                      Бүлэг нэмэх
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Iconify icon="carbon:view" />}
                      component={RouterLink}
                      href={paths.webtoon.comic(comicId)}
                    >
                      Комик үзэх
                    </Button>
                  </Grid>
                </Grid>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Typography variant="subtitle2" fontWeight={600} color="error">
                  Аюултай бүс
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Энэ комикийг устгавал бүх бүлгүүд болон холбогдох мэдээлэл устах болно.
                </Typography>
                <Box>
                  <Button variant="outlined" color="error" startIcon={<Iconify icon="carbon:trash-can" />}>
                    Комик устгах
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </Card>
        )}
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Бүлэг устгах уу?</DialogTitle>
        <DialogContent>
          <Typography>
            Энэ бүлгийг устгавал бүх зураг болон холбогдох мэдээлэл устах болно. Үргэлжлүүлэх үү?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Цуцлах</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteChapterId && handleDeleteChapter(deleteChapterId)}
          >
            Устгах
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

