'use client';

import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { backendRequest } from 'src/utils/backend-api';

// ----------------------------------------------------------------------

export default function CMSDashboardView() {
  const [loading, setLoading] = useState(true);
  const [license, setLicense] = useState<any>(null);
  const [comics, setComics] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalComics: 0,
    totalChapters: 0,
    totalViews: 0,
    totalLikes: 0,
    ongoingComics: 0,
    completedComics: 0,
  });

  // Fetch comics data and license info
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch License Info
        const licenseResponse = await backendRequest('/organizations/license');
        if (licenseResponse.success && licenseResponse.data) {
          setLicense(licenseResponse.data.subscription);
        }

        const response = await backendRequest('/webtoon/comics');
        console.log('CMS Dashboard - API Response:', response);

        if (response.success) {
          const result = response;
          
          // Handle both result.data and direct array response
          let comicsData: any[] = [];
          if (Array.isArray(result.data)) {
            comicsData = result.data;
          } else if (Array.isArray(result)) {
            comicsData = result;
          }

          console.log('CMS Dashboard - Comics Data:', comicsData);
          setComics(comicsData);

          // Calculate statistics
          const totalChapters = comicsData.reduce(
            (sum: number, comic: any) => sum + (comic.chapters || 0),
            0
          );
          const totalViews = comicsData.reduce(
            (sum: number, comic: any) => sum + (comic.views || 0),
            0
          );
          const totalLikes = comicsData.reduce(
            (sum: number, comic: any) => sum + (comic.likes || 0),
            0
          );
          const ongoingComics = comicsData.filter(
            (comic: any) => comic.status === 'ongoing'
          ).length;
          const completedComics = comicsData.filter(
            (comic: any) => comic.status === 'completed'
          ).length;

          setStats({
            totalComics: comicsData.length,
            totalChapters,
            totalViews,
            totalLikes,
            ongoingComics,
            completedComics,
          });
        } else {
          console.error('CMS Dashboard - API Error:', response.error);
        }
      } catch (error) {
        console.error('CMS Dashboard - Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'review':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Нийтлэгдсэн';
      case 'draft':
        return 'Ноорог';
      case 'review':
        return 'Хянагдаж байна';
      default:
        return status;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Get most recent comics (sorted by updatedAt)
  const recentComics = [...comics]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
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
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={5}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          spacing={2}
        >
          <Typography variant="h3">CMS Хяналтын самбар</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* License Info */}
            {license?.endDate && (
              <Chip
                icon={<Iconify icon="solar:calendar-bold" />}
                label={`Лиценз: ${new Date(license.endDate).toLocaleDateString('mn-MN')}`}
                color={
                  new Date(license.endDate) < new Date() ? 'error' : 'success'
                }
                variant="soft"
              />
            )}
            
            <Button
              variant="outlined"
              startIcon={<Iconify icon="carbon:book" />}
              href={paths.webtoon.cms.comics}
              component={RouterLink}
            >
              Комикууд
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="carbon:add" />}
              href={paths.webtoon.cms.createComic}
              component={RouterLink}
            >
              Шинэ комик
            </Button>
          </Stack>
        </Stack>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:book" sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4">{stats.totalComics}</Typography>
              <Typography variant="body2" color="text.secondary">
                Нийт комик
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="carbon:page-break"
                sx={{ fontSize: 48, color: 'success.main', mb: 2 }}
              />
              <Typography variant="h4">{stats.totalChapters}</Typography>
              <Typography variant="body2" color="text.secondary">
                Нийт бүлэг
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:view" sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h4">{formatNumber(stats.totalViews)}</Typography>
              <Typography variant="body2" color="text.secondary">
                Нийт үзэлт
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:favorite" sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h4">{formatNumber(stats.totalLikes)}</Typography>
              <Typography variant="body2" color="text.secondary">
                Нийт лайк
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:renew" sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4">{stats.ongoingComics}</Typography>
              <Typography variant="body2" color="text.secondary">
                Үргэлжилж байгаа
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="carbon:checkmark-filled"
                sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }}
              />
              <Typography variant="h4">{stats.completedComics}</Typography>
              <Typography variant="body2" color="text.secondary">
                Дууссан
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Comics */}
          <Grid xs={12} lg={8}>
            <Card>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, pb: 0 }}
              >
                <Typography variant="h6">Сүүлийн комикууд</Typography>
                <Button
                  href={paths.webtoon.cms.comics}
                  endIcon={<Iconify icon="carbon:arrow-right" />}
                >
                  Бүгдийг үзэх
                </Button>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Комик</TableCell>
                      <TableCell>Зохиолч</TableCell>
                      <TableCell>Төлөв</TableCell>
                      <TableCell>Бүлэг</TableCell>
                      <TableCell>Үзэлт</TableCell>
                      <TableCell>Огноо</TableCell>
                      <TableCell align="right">Үйлдэл</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentComics.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                          <Typography variant="body2" color="text.secondary">
                            Комик байхгүй байна
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {recentComics.map((comic) => (
                      <TableRow key={comic._id || comic.id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                              src={comic.coverImage || '/assets/placeholder.jpg'}
                              alt={comic.title}
                              variant="rounded"
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">{comic.title}</Typography>
                              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                {(comic.genre || []).slice(0, 2).map((g: string, index: number) => (
                                  <Typography key={index} variant="caption" color="text.secondary">
                                    {g}
                                    {index < Math.min(comic.genre.length, 2) - 1 ? ', ' : ''}
                                  </Typography>
                                ))}
                              </Stack>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>{comic.author}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(comic.status)}
                            color={getStatusColor(comic.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{comic.chapters || 0}</TableCell>
                        <TableCell>{formatNumber(comic.views || 0)}</TableCell>
                        <TableCell>
                          {new Date(comic.updatedAt).toLocaleDateString('mn-MN')}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            component={RouterLink}
                            href={paths.webtoon.cms.manageComic(comic._id || comic.id)}
                            size="small"
                          >
                            <Iconify icon="carbon:settings" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* Quick Actions Card */}
          <Grid xs={12} lg={4}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Хурдан үйлдлүүд
              </Typography>
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Iconify icon="carbon:add" />}
                  href={paths.webtoon.cms.createComic}
                  component={RouterLink}
                >
                  Шинэ комик нэмэх
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Iconify icon="carbon:document" />}
                  href={paths.webtoon.cms.comics}
                  component={RouterLink}
                >
                  Комикуудыг харах
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Iconify icon="carbon:user-multiple" />}
                  href={paths.webtoon.cms.users}
                  component={RouterLink}
                >
                  Хэрэглэгчдийг харах
                </Button>
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 1 }}
                  >
                    📊 Статистик
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption">Дундаж үзэлт:</Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {stats.totalComics > 0
                          ? formatNumber(Math.round(stats.totalViews / stats.totalComics))
                          : '0'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption">Дундаж бүлэг:</Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {stats.totalComics > 0
                          ? Math.round(stats.totalChapters / stats.totalComics)
                          : '0'}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
