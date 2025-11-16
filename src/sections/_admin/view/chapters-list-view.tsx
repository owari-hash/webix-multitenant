'use client';

import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
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

type Props = {
  comicId: string;
};

// Mock data - replace with actual API data
const CHAPTERS_DATA = [
  {
    id: '1',
    chapterNumber: 1,
    title: 'Эхлэл',
    images: 15,
    views: 125000,
    publishedAt: '2 цагийн өмнө',
    status: 'published',
  },
  {
    id: '2',
    chapterNumber: 2,
    title: 'Уулзалт',
    images: 18,
    views: 98000,
    publishedAt: '1 өдрийн өмнө',
    status: 'published',
  },
  {
    id: '3',
    chapterNumber: 3,
    title: 'Тулаан',
    images: 20,
    views: 87000,
    publishedAt: '3 өдрийн өмнө',
    status: 'published',
  },
];

export default function ChaptersListView({ comicId }: Props) {
  const theme = useTheme();
  const [chapters, setChapters] = useState(CHAPTERS_DATA);
  const [comicTitle, setComicTitle] = useState<string>('');

  useEffect(() => {
    // Fetch comic details
    const fetchComic = async () => {
      try {
        const response = await fetch(`/api2/webtoon/comic/${comicId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();
        if (result.success && result.comic) {
          setComicTitle(result.comic.title);
        }
      } catch (error) {
        console.error('Fetch comic error:', error);
      }
    };

    // Fetch chapters
    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api2/webtoon/comic/${comicId}/chapters`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();
        if (result.success && result.chapters) {
          setChapters(result.chapters);
        }
      } catch (error) {
        console.error('Fetch chapters error:', error);
      }
    };

    fetchComic();
    fetchChapters();
  }, [comicId]);

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
              <Button
                component={RouterLink}
                href={paths.webtoon.cms.comics}
                color="inherit"
                sx={{ minWidth: 'auto' }}
              >
                Комикууд
              </Button>
              <Typography color="text.primary">Бүлгүүд</Typography>
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
                    bgcolor: alpha(theme.palette.secondary.main, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon="carbon:page-break"
                    sx={{ color: theme.palette.secondary.main, fontSize: 28 }}
                  />
                </Box>

                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    Бүлгүүд
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {comicTitle || 'Комикийн бүлгүүд'} • {chapters.length} бүлэг
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                href={paths.webtoon.cms.createChapter(comicId)}
                startIcon={<Iconify icon="carbon:add" />}
              >
                Шинэ бүлэг
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
                  <TableCell>Бүлэг</TableCell>
                  <TableCell>Гарчиг</TableCell>
                  <TableCell align="center">Зургууд</TableCell>
                  <TableCell align="center">Үзэлт</TableCell>
                  <TableCell align="center">Төлөв</TableCell>
                  <TableCell align="center">Нийтлэгдсэн</TableCell>
                  <TableCell align="right">Үйлдэл</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chapters.map((chapter) => (
                  <ChapterTableRow key={chapter.id} chapter={chapter} comicId={comicId} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {chapters.length === 0 && (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Iconify
                icon="carbon:page-break"
                sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
                Одоогоор бүлэг байхгүй байна
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                href={paths.webtoon.cms.createChapter(comicId)}
                startIcon={<Iconify icon="carbon:add" />}
              >
                Эхний бүлэг нэмэх
              </Button>
            </Box>
          )}
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

type ChapterTableRowProps = {
  chapter: any;
  comicId: string;
};

function ChapterTableRow({ chapter, comicId }: ChapterTableRowProps) {
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
    
    if (!window.confirm(`Бүлэг #${chapter.chapterNumber} устгах уу?`)) {
      return;
    }

    try {
      const response = await fetch(`/api2/webtoon/chapter/${chapter._id || chapter.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        alert('Бүлэг амжилттай устгагдлаа!');
        window.location.reload();
      } else {
        alert(result.error || result.message || 'Устгахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Delete chapter error:', error);
      alert('Сүлжээний алдаа. Дахин оролдоно уу.');
    }
  };

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell>
          <Chip
            label={`#${chapter.chapterNumber}`}
            sx={{
              fontWeight: 700,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: 'primary.main',
            }}
          />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {chapter.title}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
            <Iconify icon="carbon:image" sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2">
              {Array.isArray(chapter.images) ? chapter.images.length : 0}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">{chapter.views ? chapter.views.toLocaleString() : 0}</Typography>
        </TableCell>

        <TableCell align="center">
          <Chip
            label="Нийтлэгдсэн"
            color="success"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </TableCell>

        <TableCell align="center">
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {chapter.createdAt ? new Date(chapter.createdAt).toLocaleDateString('mn-MN') : '-'}
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
              <MenuItem key="delete" onClick={handleDelete} sx={{ color: 'error.main' }}>
                <Iconify icon="carbon:trash-can" sx={{ mr: 1 }} />
                Устгах
              </MenuItem>,
            ]}
          </Menu>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

