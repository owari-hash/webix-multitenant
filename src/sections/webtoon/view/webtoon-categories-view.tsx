'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

interface Comic {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  coverImage: string;
  genre: string[];
  rating?: number;
  views?: number;
  status: string;
}

interface Category {
  name: string;
  slug: string;
  count: number;
  comics: Comic[];
}

export default function WebtoonCategoriesView() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [comics, setComics] = useState<Comic[]>([]);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('/api2/webtoon/comics');
        const result = await response.json();

        let comicsData: Comic[] = [];
        if (result.success && Array.isArray(result.data)) {
          comicsData = result.data;
        } else if (result.success && Array.isArray(result.comics)) {
          comicsData = result.comics;
        } else if (Array.isArray(result)) {
          comicsData = result;
        }

        setComics(comicsData);
      } catch (error) {
        console.error('Failed to fetch comics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  // Generate categories from real comic data
  const categories: Category[] = useMemo(() => {
    const categoryMap = new Map<string, Comic[]>();

    comics.forEach((comic) => {
      const genres = Array.isArray(comic.genre) ? comic.genre : [comic.genre];
      genres.forEach((genre) => {
        if (genre) {
          if (!categoryMap.has(genre)) {
            categoryMap.set(genre, []);
          }
          categoryMap.get(genre)!.push(comic);
        }
      });
    });

    return Array.from(categoryMap.entries())
      .map(([name, comicsList]) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        count: comicsList.length,
        comics: comicsList.sort((a, b) => (b.views || 0) - (a.views || 0)),
      }))
      .sort((a, b) => b.count - a.count);
  }, [comics]);

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      Action: 'solar:bolt-bold-duotone',
      Romance: 'solar:heart-bold-duotone',
      Fantasy: 'solar:magic-stick-bold-duotone',
      Comedy: 'solar:smile-circle-bold-duotone',
      Drama: 'solar:mask-happly-bold-duotone',
      Horror: 'solar:ghost-bold-duotone',
      'Slice of Life': 'solar:home-smile-bold-duotone',
      Thriller: 'solar:danger-triangle-bold-duotone',
      Adventure: 'solar:map-bold-duotone',
      Mystery: 'solar:question-circle-bold-duotone',
      Sci: 'solar:atom-bold-duotone',
      Historical: 'solar:history-bold-duotone',
      Sports: 'solar:running-bold-duotone',
      Supernatural: 'solar:star-bold-duotone',
    };

    // Check for partial matches
    const key = Object.keys(iconMap).find((k) =>
      categoryName.toLowerCase().includes(k.toLowerCase())
    );

    return iconMap[key || categoryName] || 'solar:book-bold-duotone';
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      theme.palette.error.main,
      theme.palette.primary.main,
      theme.palette.warning.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.secondary.main,
      '#9C27B0',
      '#FF6F00',
      '#00BCD4',
      '#4CAF50',
      '#E91E63',
      '#3F51B5',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="body2" color="text.secondary">
            Ангиллууд ачааллаж байна...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={6}>
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 800 }}>
            Веб комикийн ангиллууд
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Дуртай төрлөө сонгоод комик уншиж эхлээрэй
          </Typography>
          <Chip
            label={`${categories.length} ангилал • ${comics.length} комик`}
            color="primary"
            variant="soft"
            sx={{ mt: 2 }}
          />
        </Box>

        {/* Categories Grid */}
        <Box>
          <Grid container spacing={3}>
            {categories.map((category, index) => {
              const categoryIcon = getCategoryIcon(category.name);
              const categoryColor = getCategoryColor(index);

              return (
                <Grid key={category.slug} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    component={RouterLink}
                    href={`${paths.webtoon.browse}?category=${category.slug}`}
                    sx={{
                      p: 3,
                      height: '100%',
                      minHeight: 180,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: 'transparent',
                      background: `linear-gradient(145deg, ${alpha(
                        categoryColor,
                        0.03
                      )} 0%, ${alpha(categoryColor, 0.08)} 100%)`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${categoryColor}, ${alpha(
                          categoryColor,
                          0.6
                        )})`,
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: alpha(categoryColor, 0.4),
                        boxShadow: `0 16px 40px ${alpha(categoryColor, 0.25)}`,
                        '&::before': {
                          transform: 'scaleX(1)',
                        },
                        '& .category-icon-wrapper': {
                          transform: 'scale(1.15) rotate(5deg)',
                          bgcolor: categoryColor,
                        },
                        '& .category-icon': {
                          color: '#fff',
                        },
                        '& .category-title': {
                          color: categoryColor,
                        },
                      },
                    }}
                  >
                    <Box
                      className="category-icon-wrapper"
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2.5,
                        bgcolor: alpha(categoryColor, 0.12),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: `2px solid ${alpha(categoryColor, 0.2)}`,
                      }}
                    >
                      <Iconify
                        icon={categoryIcon}
                        className="category-icon"
                        sx={{
                          width: 40,
                          height: 40,
                          color: categoryColor,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </Box>

                    <Typography
                      className="category-title"
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {category.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {category.count} комик
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Popular in Each Category */}
        {categories.length > 0 && (
          <Box>
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontWeight: 800,
              }}
            >
              Ангилал тус бүрээс алдартай комикууд
            </Typography>

            <Stack spacing={6}>
              {categories.slice(0, 6).map((category, index) => {
                const categoryWebtoons = category.comics.slice(0, 4);
                const categoryColor = getCategoryColor(index);

                if (categoryWebtoons.length === 0) return null;

                return (
                  <Box key={category.slug}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 3 }}
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: alpha(categoryColor, 0.12),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${alpha(categoryColor, 0.2)}`,
                          }}
                        >
                          <Iconify
                            icon={getCategoryIcon(category.name)}
                            sx={{ color: categoryColor, width: 28, height: 28 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {category.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {category.count} комик
                          </Typography>
                        </Box>
                      </Stack>

                      <Box
                        component={RouterLink}
                        href={`${paths.webtoon.browse}?category=${category.slug}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: categoryColor,
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                          '&:hover': {
                            gap: 1,
                            '& .arrow-icon': {
                              transform: 'translateX(4px)',
                            },
                          },
                        }}
                      >
                        Бүгдийг үзэх
                        <Iconify
                          icon="solar:arrow-right-linear"
                          className="arrow-icon"
                          sx={{ transition: 'transform 0.2s' }}
                        />
                      </Box>
                    </Stack>

                    <Grid container spacing={3}>
                      {categoryWebtoons.map((comic) => {
                        const comicId = comic._id || comic.id;
                        const rating = comic.rating || 0;

                        return (
                          <Grid key={comicId} xs={12} sm={6} md={3}>
                            <Card
                              component={RouterLink}
                              href={paths.webtoon.comic(comicId || '')}
                              sx={{
                                height: '100%',
                                textDecoration: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                '&:hover': {
                                  transform: 'translateY(-8px)',
                                  boxShadow: (t) => t.customShadows.z24,
                                  '& .comic-image': {
                                    transform: 'scale(1.05)',
                                  },
                                },
                              }}
                            >
                              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                <Box
                                  className="comic-image"
                                  component="img"
                                  src={comic.coverImage || '/assets/placeholder.png'}
                                  alt={comic.title}
                                  sx={{
                                    width: '100%',
                                    height: 280,
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  }}
                                />

                                {/* Status Badge */}
                                <Chip
                                  label={
                                    comic.status === 'ongoing' ? 'Үргэлжилж байгаа' : 'Дууссан'
                                  }
                                  size="small"
                                  color={comic.status === 'ongoing' ? 'success' : 'default'}
                                  sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    fontWeight: 600,
                                    backdropFilter: 'blur(8px)',
                                    bgcolor: (t) =>
                                      alpha(
                                        t.palette.background.paper,
                                        comic.status === 'ongoing' ? 0.9 : 0.85
                                      ),
                                  }}
                                />
                              </Box>

                              <Stack spacing={1.5} sx={{ p: 2 }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 700,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {comic.title}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {comic.author}
                                </Typography>

                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <Rating value={rating} precision={0.5} size="small" readOnly />
                                    <Typography variant="caption" fontWeight={600}>
                                      {rating.toFixed(1)}
                                    </Typography>
                                  </Stack>

                                  <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <Iconify icon="solar:eye-bold" width={16} />
                                    <Typography variant="caption" fontWeight={600}>
                                      {(() => {
                                        const views = comic.views || 0;
                                        if (views >= 1000000)
                                          return `${(views / 1000000).toFixed(1)}M`;
                                        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
                                        return views;
                                      })()}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}

        {/* Empty State */}
        {categories.length === 0 && !loading && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Iconify
              icon="solar:library-bold-duotone"
              sx={{ width: 80, height: 80, color: 'text.disabled', mb: 2 }}
            />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              Ангилал олдсонгүй
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Одоогоор комик нэмэгдээгүй байна
            </Typography>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
