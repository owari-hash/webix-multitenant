'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import { _webtoons } from 'src/_mock';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

// Mock CMS data
const mockStats = {
  totalComics: 156,
  totalChapters: 2847,
  totalUsers: 12500,
  monthlyViews: 850000,
  pendingReviews: 23,
  activeCreators: 45,
};

const mockRecentComics = _webtoons.slice(0, 5).map((comic, index) => ({
  ...comic,
  status: ['published', 'draft', 'review', 'published', 'draft'][index],
  createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
  chapters: Math.floor(Math.random() * 50) + 1,
  views: Math.floor(Math.random() * 100000) + 1000,
}));

const mockRecentUsers = [
  { id: '1', name: 'Батбаяр', email: 'batbayar@example.com', role: 'user', joinedAt: '2024-01-15' },
  { id: '2', name: 'Сарнай', email: 'sarnai@example.com', role: 'creator', joinedAt: '2024-01-14' },
  { id: '3', name: 'Болд', email: 'bold@example.com', role: 'user', joinedAt: '2024-01-13' },
  { id: '4', name: 'Цэцэг', email: 'tsetseg@example.com', role: 'creator', joinedAt: '2024-01-12' },
  { id: '5', name: 'Төмөр', email: 'tumor@example.com', role: 'user', joinedAt: '2024-01-11' },
];

export default function CMSDashboardView() {
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Avoid unused variable warning
  console.log('Selected item:', selectedItem);

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, itemId: string) => {
    setActionAnchor(event.currentTarget);
    setSelectedItem(itemId);
  };

  const handleActionClose = () => {
    setActionAnchor(null);
    setSelectedItem(null);
  };

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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'user':
        return 'Уншигч';
      case 'creator':
        return 'Зохиолч';
      case 'admin':
        return 'Админ';
      default:
        return role;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={5}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h3">CMS Хяналтын самбар</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="carbon:add" />}
            href={paths.webtoon.cms.createComic}
          >
            Шинэ комик
          </Button>
        </Stack>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:book" sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4">{mockStats.totalComics}</Typography>
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
              <Typography variant="h4">{mockStats.totalChapters}</Typography>
              <Typography variant="body2" color="text.secondary">
                Нийт бүлэг
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="carbon:user-multiple"
                sx={{ fontSize: 48, color: 'info.main', mb: 2 }}
              />
              <Typography variant="h4">{mockStats.totalUsers.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">
                Нийт хэрэглэгч
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:view" sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4">{(mockStats.monthlyViews / 1000).toFixed(0)}K</Typography>
              <Typography variant="body2" color="text.secondary">
                Сарын үзэлт
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:time" sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h4">{mockStats.pendingReviews}</Typography>
              <Typography variant="body2" color="text.secondary">
                Хүлээгдэж байна
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="carbon:user-speaker"
                sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }}
              />
              <Typography variant="h4">{mockStats.activeCreators}</Typography>
              <Typography variant="body2" color="text.secondary">
                Идэвхтэй зохиолч
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
                    {mockRecentComics.map((comic) => (
                      <TableRow key={comic.id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                              src={comic.coverUrl}
                              alt={comic.title}
                              variant="rounded"
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">{comic.title}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {comic.genre}
                              </Typography>
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
                        <TableCell>{comic.chapters}</TableCell>
                        <TableCell>{comic.views.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(comic.createdAt).toLocaleDateString('mn-MN')}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleActionClick(e, comic.id)} size="small">
                            <Iconify icon="carbon:overflow-menu-horizontal" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* Recent Users */}
          <Grid xs={12} lg={4}>
            <Card>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, pb: 0 }}
              >
                <Typography variant="h6">Шинэ хэрэглэгчид</Typography>
                <Button
                  href={paths.webtoon.cms.users}
                  endIcon={<Iconify icon="carbon:arrow-right" />}
                >
                  Бүгдийг үзэх
                </Button>
              </Stack>

              <Stack spacing={0} sx={{ p: 3 }}>
                {mockRecentUsers.map((user) => (
                  <Stack
                    key={user.id}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ py: 1.5 }}
                  >
                    <Avatar sx={{ width: 40, height: 40 }}>{user.name.charAt(0)}</Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2">{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    <Chip
                      label={getRoleLabel(user.role)}
                      size="small"
                      color={user.role === 'creator' ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Action Menu */}
        <Menu
          anchorEl={actionAnchor}
          open={Boolean(actionAnchor)}
          onClose={handleActionClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleActionClose}>
            <Iconify icon="carbon:view" sx={{ mr: 2 }} />
            Үзэх
          </MenuItem>
          <MenuItem onClick={handleActionClose}>
            <Iconify icon="carbon:edit" sx={{ mr: 2 }} />
            Засах
          </MenuItem>
          <MenuItem onClick={handleActionClose}>
            <Iconify icon="carbon:analytics" sx={{ mr: 2 }} />
            Статистик
          </MenuItem>
          <MenuItem onClick={handleActionClose} sx={{ color: 'error.main' }}>
            <Iconify icon="carbon:trash-can" sx={{ mr: 2 }} />
            Устгах
          </MenuItem>
        </Menu>
      </Stack>
    </Container>
  );
}
