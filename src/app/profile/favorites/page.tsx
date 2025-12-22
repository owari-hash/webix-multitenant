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
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { backendRequest } from 'src/utils/backend-api';
import { fDate } from 'src/utils/format-time';
import { isAuthenticated } from 'src/utils/auth';

// ----------------------------------------------------------------------

interface Favorite {
  _id: string;
  type: 'comic' | 'novel';
  comic?: any;
  novel?: any;
  createdAt: string;
}

export default function FavoritesPage() {
  const theme = useTheme();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(paths.loginCover);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await backendRequest<{
          favorites?: Favorite[];
          total?: number;
          pages?: number;
        }>(`/webtoon/user/favorites?page=${page}&limit=20`);

        if (response.success && response.data) {
          setFavorites(response.data.favorites || []);
          setTotal(response.data.total || 0);
          setTotalPages(response.data.pages || 1);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [page, router]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const response = await backendRequest(`/webtoon/user/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
        setTotal(total - 1);
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const getItemLink = (favorite: Favorite) => {
    if (favorite.type === 'comic' && favorite.comic) {
      return paths.webtoon.comic(favorite.comic._id);
    }
    if (favorite.type === 'novel' && favorite.novel) {
      return paths.webtoon.novel(favorite.novel._id);
    }
    return '#';
  };

  const getItemTitle = (favorite: Favorite) => {
    if (favorite.type === 'comic' && favorite.comic) {
      return favorite.comic.title;
    }
    if (favorite.type === 'novel' && favorite.novel) {
      return favorite.novel.title;
    }
    return 'Unknown';
  };

  const getItemCover = (favorite: Favorite) => {
    if (favorite.type === 'comic' && favorite.comic) {
      return favorite.comic.coverImage;
    }
    if (favorite.type === 'novel' && favorite.novel) {
      return favorite.novel.coverImage;
    }
    return '/assets/images/placeholder.jpg';
  };

  const getItemDescription = (favorite: Favorite) => {
    if (favorite.type === 'comic' && favorite.comic) {
      return favorite.comic.description;
    }
    if (favorite.type === 'novel' && favorite.novel) {
      return favorite.novel.description;
    }
    return '';
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Дуртай
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
      {!loading && favorites.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Iconify
            icon="solar:heart-bold"
            width={80}
            sx={{ color: 'text.disabled', mb: 2 }}
          />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Дуртай зүйлс байхгүй
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Та одоогоор дуртай комик эсвэл зохиол нэмээгүй байна
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
      {!loading && favorites.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Нийт <strong>{total}</strong> дуртай зүйл олдлоо
          </Typography>

          <Grid container spacing={3}>
            {favorites.map((favorite) => (
              <Grid item xs={12} sm={6} md={4} key={favorite._id}>
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
                  <Box
                    onClick={() => router.push(getItemLink(favorite))}
                    sx={{ position: 'relative' }}
                  >
                    <Box
                      component="img"
                      src={getItemCover(favorite) || '/assets/images/placeholder.jpg'}
                      alt={getItemTitle(favorite)}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(favorite._id);
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
                      <Iconify icon="solar:heart-bold" width={20} />
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
                      {favorite.type === 'comic' ? 'Комик' : 'Зохиол'}
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
                      {getItemTitle(favorite)}
                    </Typography>

                    {getItemDescription(favorite) && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {getItemDescription(favorite)}
                      </Typography>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Нэмсэн: {fDate(favorite.createdAt)}
                    </Typography>
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

