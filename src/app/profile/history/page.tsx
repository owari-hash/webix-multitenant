'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { backendRequest } from 'src/utils/backend-api';
import { fToNow } from 'src/utils/format-time';
import { isAuthenticated } from 'src/utils/auth';

// ----------------------------------------------------------------------

interface HistoryItem {
  _id: string;
  type: 'comic' | 'novel';
  comic?: any;
  novel?: any;
  chapter?: any;
  progress: number;
  lastReadAt: string;
}

export default function HistoryPage() {
  const theme = useTheme();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(paths.loginCover);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await backendRequest<{
          history?: HistoryItem[];
          total?: number;
          pages?: number;
        }>(`/webtoon/user/history?page=${page}&limit=20`);

        if (response.success && response.data) {
          setHistory(response.data.history || []);
          setTotal(response.data.total || 0);
          setTotalPages(response.data.pages || 1);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error('Failed to fetch reading history:', error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page, router]);

  const handleRemoveHistory = async (historyId: string) => {
    try {
      const response = await backendRequest(`/webtoon/user/history/${historyId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setHistory(history.filter((item) => item._id !== historyId));
        setTotal(total - 1);
      }
    } catch (error) {
      console.error('Failed to remove history:', error);
    }
  };

  const getItemLink = (item: HistoryItem) => {
    if (item.type === 'comic' && item.comic) {
      if (item.chapter) {
        return paths.webtoon.chapter(item.comic._id, item.chapter._id);
      }
      return paths.webtoon.comic(item.comic._id);
    }
    if (item.type === 'novel' && item.novel) {
      if (item.chapter) {
        return paths.webtoon.novelChapter(item.novel._id, item.chapter._id);
      }
      return paths.webtoon.novel(item.novel._id);
    }
    return '#';
  };

  const getItemTitle = (item: HistoryItem) => {
    if (item.type === 'comic' && item.comic) {
      return item.comic.title;
    }
    if (item.type === 'novel' && item.novel) {
      return item.novel.title;
    }
    return 'Unknown';
  };

  const getItemCover = (item: HistoryItem) => {
    if (item.type === 'comic' && item.comic) {
      return item.comic.coverImage;
    }
    if (item.type === 'novel' && item.novel) {
      return item.novel.coverImage;
    }
    return '/assets/images/placeholder.jpg';
  };

  const getChapterTitle = (item: HistoryItem) => {
    if (item.chapter) {
      return item.chapter.title || `Бүлэг ${item.chapter.chapterNumber || ''}`;
    }
    return null;
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Уншсан түүх
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
          onClick={() => router.push(paths.profile.root)}
        >
          Буцах
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      )}
      {!loading && history.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Iconify icon="solar:history-bold" width={80} sx={{ color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Уншсан түүх байхгүй
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Та одоогоор уншсан комик эсвэл роман байхгүй байна
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push(paths.webtoon.browse)}
            startIcon={<Iconify icon="solar:book-2-bold" />}
          >
            Комик хайх
          </Button>
        </Box>
      )}
      {!loading && history.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Нийт <strong>{total}</strong> уншсан зүйл олдлоо
          </Typography>

          <Grid container spacing={3}>
            {history.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.customShadows.z24,
                    },
                  }}
                >
                  <Box onClick={() => router.push(getItemLink(item))} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={getItemCover(item) || '/assets/images/placeholder.jpg'}
                      alt={getItemTitle(item)}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveHistory(item._id);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(8px)',
                        '&:hover': {
                          bgcolor: theme.palette.error.main,
                          color: 'white',
                        },
                      }}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                    </IconButton>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {item.type === 'comic' ? 'Комик' : 'Роман'}
                    </Box>
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {getItemTitle(item)}
                    </Typography>

                    {getChapterTitle(item) && (
                      <Chip
                        label={getChapterTitle(item)}
                        size="small"
                        sx={{ mb: 1.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    )}

                    {item.progress > 0 && (
                      <Box sx={{ mb: 1.5 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ mb: 0.5 }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Уншсан хувь
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 600 }}
                          >
                            {item.progress}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={item.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        />
                      </Box>
                    )}

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify
                        icon="solar:clock-circle-bold"
                        width={16}
                        sx={{ color: 'text.secondary' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {fToNow(item.lastReadAt)}
                      </Typography>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
