'use client';

import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('/api2/webtoon/comics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();
        
        if (result.success && result.comics) {
          setComics(result.comics);
        }
      } catch (error) {
        console.error('Fetch comics error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

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
          <Stack spacing={2}>
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
                    {comics.length} комик олдлоо
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

      {/* Table Content */}
      <Container sx={{ py: { xs: 3, md: 5 } }}>
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
                      <Typography variant="body2">Уншиж байна...</Typography>
                    </TableCell>
                  </TableRow>
                )}
                
                {!loading && comics.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                      <Iconify icon="carbon:book" sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
                        Одоогоор комик байхгүй байна
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
                
                {!loading && comics.length > 0 && comics.map((comic) => (
                  <ComicTableRow key={comic._id || comic.id} comic={comic} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
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
              comic.genre.slice(0, 2).map((g: string) => (
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
                key="view"
                onClick={() => {
                  handleClose();
                  // Add view logic
                }}
              >
                <Iconify icon="carbon:view" sx={{ mr: 1 }} />
                Үзэх
              </MenuItem>,
              <MenuItem
                key="edit"
                onClick={() => {
                  handleClose();
                  // Add edit logic
                }}
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

