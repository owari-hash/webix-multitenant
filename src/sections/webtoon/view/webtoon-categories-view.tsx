'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { _webtoons, _webtoonCategories } from 'src/_mock';

// ----------------------------------------------------------------------

export default function WebtoonCategoriesView() {
  const getWebtoonsByCategory = (categorySlug: string) =>
    _webtoons.filter((webtoon) => webtoon.genre === categorySlug);

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      Action: 'carbon:flash',
      Romance: 'carbon:favorite',
      Fantasy: 'carbon:magic-wand',
      Comedy: 'carbon:face-satisfied',
      Drama: 'carbon:theater',
      Horror: 'carbon:ghost',
      'Slice of Life': 'carbon:earth',
      Thriller: 'carbon:warning-alt',
    };
    return iconMap[categoryName] || 'carbon:book';
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={5}>
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Веб комикийн ангиллууд
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Дуртай төрлөө сонгоод комик уншиж эхлээрэй
          </Typography>
        </Box>

        {/* Categories Grid */}
        <Grid container spacing={4}>
          {_webtoonCategories.map((category) => {
            const categoryWebtoons = getWebtoonsByCategory(category.slug);
            const categoryIcon = getCategoryIcon(category.name);

            return (
              <Grid key={category.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  component="a"
                  href={paths.webtoon.category(category.slug)}
                  sx={{
                    p: 4,
                    height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid',
                    borderColor: 'transparent',
                    background: `linear-gradient(145deg, ${alpha(category.color, 0.05)} 0%, ${alpha(
                      category.color,
                      0.1
                    )} 100%)`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: alpha(category.color, 0.3),
                      boxShadow: `0 12px 32px ${alpha(category.color, 0.2)}`,
                      '& .category-icon': {
                        transform: 'scale(1.2)',
                        color: category.color,
                      },
                      '& .category-title': {
                        color: category.color,
                      },
                    },
                  }}
                >
                  <Box
                    className="category-icon"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      bgcolor: alpha(category.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      transition: 'all 0.3s ease',
                      border: `2px solid ${alpha(category.color, 0.2)}`,
                    }}
                  >
                    <Iconify
                      icon={categoryIcon}
                      sx={{
                        fontSize: 40,
                        color: category.color,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Box>

                  <Typography
                    className="category-title"
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {category.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {categoryWebtoons.length} комик
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Popular in Each Category */}
        <Box>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            Ангилал тус бүрээс алдартай комикууд
          </Typography>

          <Stack spacing={6}>
            {_webtoonCategories.slice(0, 4).map((category) => {
              const categoryWebtoons = getWebtoonsByCategory(category.slug).slice(0, 4);

              return (
                <Box key={category.id}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          bgcolor: alpha(category.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Iconify
                          icon={getCategoryIcon(category.name)}
                          sx={{ color: category.color, fontSize: 24 }}
                        />
                      </Box>
                      <Typography variant="h5">{category.name}</Typography>
                    </Stack>

                    <Typography
                      component="a"
                      href={paths.webtoon.category(category.slug)}
                      variant="body2"
                      color="primary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Бүгдийг үзэх →
                    </Typography>
                  </Stack>

                  <Grid container spacing={3}>
                    {categoryWebtoons.map((webtoon) => (
                      <Grid key={webtoon.id} xs={12} sm={6} md={3}>
                        <Card
                          component="a"
                          href={paths.webtoon.comic(webtoon.id)}
                          sx={{
                            height: '100%',
                            textDecoration: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: (theme) => theme.customShadows.z20,
                            },
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <Box
                              sx={{
                                width: '100%',
                                height: 200,
                                backgroundImage: `url(${webtoon.coverUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '8px 8px 0 0',
                              }}
                            />
                          </Box>

                          <Stack spacing={1} sx={{ p: 2 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {webtoon.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {webtoon.author}
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Iconify icon="carbon:star-filled" sx={{ color: 'warning.main' }} />
                              <Typography variant="caption">4.5</Typography>
                              <Typography variant="caption" color="text.secondary">
                                • 12.5K үзэлт
                              </Typography>
                            </Stack>
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
