import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { _webtoons, _webtoonCategories } from 'src/_mock';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeWebtoonCategories() {
  const getWebtoonsByCategory = (categorySlug: string) =>
    _webtoons.filter((webtoon) => webtoon.genre === categorySlug).slice(0, 3);

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      Экшн: 'carbon:flash',
      Романс: 'carbon:favorite',
      Фэнтэзи: 'carbon:magic-wand',
      Комеди: 'carbon:face-satisfied',
      Драма: 'carbon:theater',
      Аймшиг: 'carbon:ghost',
      'Амьдралын хэв маяг': 'carbon:earth',
      Трилл: 'carbon:warning-alt',
    };
    return iconMap[categoryName] || 'carbon:book';
  };

  const translateCategoryName = (name: string) => {
    const translations: Record<string, string> = {
      Action: 'Экшн',
      Romance: 'Романс',
      Fantasy: 'Фэнтэзи',
      Comedy: 'Комеди',
      Drama: 'Драма',
      Horror: 'Аймшиг',
      'Slice of Life': 'Амьдралын хэв маяг',
      Thriller: 'Трилл',
    };
    return translations[name] || name;
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.neutral',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container component={MotionViewport} maxWidth="lg">
        <Stack spacing={6}>
          {/* Header Section */}
          <m.div variants={varFade().inUp}>
            <Typography variant="h2" sx={{ textAlign: 'center', mb: 2 }}>
              Ангиллаар судлах
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Дуртай төрлөө олоод гайхамшигтай веб комикуудыг нээж үзээрэй
            </Typography>
          </m.div>

          {/* Categories Grid */}
          <Box>
            <Grid container spacing={3}>
              {_webtoonCategories.slice(0, 8).map((category, index) => {
                const categoryWebtoons = getWebtoonsByCategory(category.slug);
                const translatedName = translateCategoryName(category.name);
                const categoryIcon = getCategoryIcon(translatedName);

                return (
                  <Grid key={category.id} xs={12} sm={6} md={4} lg={3}>
                    <m.div variants={varFade().inUp}>
                      <Card
                        sx={{
                          p: 2.5,
                          height: 320,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          bgcolor: 'background.paper',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 24px ${alpha(category.color, 0.12)}`,
                            borderColor: alpha(category.color, 0.4),
                            '& .category-icon': {
                              transform: 'scale(1.05)',
                              bgcolor: alpha(category.color, 0.15),
                            },
                            '& .category-name': {
                              color: category.color,
                            },
                          },
                        }}
                      >
                        <Stack spacing={2.5} sx={{ height: '100%' }}>
                          {/* Category Header */}
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                              className="category-icon"
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 1.5,
                                bgcolor: alpha(category.color, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                border: `1px solid ${alpha(category.color, 0.2)}`,
                              }}
                            >
                              <Iconify
                                icon={categoryIcon}
                                sx={{
                                  color: category.color,
                                  fontSize: 24,
                                }}
                              />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                className="category-name"
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  mb: 0.25,
                                  transition: 'color 0.3s ease',
                                  fontSize: '1rem',
                                  lineHeight: 1.3,
                                }}
                              >
                                {translatedName}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                }}
                              >
                                {categoryWebtoons.length} веб комик
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Webtoon Previews */}
                          <Stack spacing={1.5} sx={{ flex: 1, minHeight: 140 }}>
                            {categoryWebtoons.map((webtoon, idx) => (
                              <Stack
                                key={webtoon.id}
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    bgcolor: alpha(category.color, 0.04),
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: 1,
                                    flexShrink: 0,
                                  }}
                                >
                                  <Image
                                    alt={webtoon.title}
                                    src={webtoon.coverUrl}
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      objectFit: 'cover',
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: -2,
                                      right: -2,
                                      width: 14,
                                      height: 14,
                                      bgcolor: category.color,
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.6rem',
                                      color: 'white',
                                      fontWeight: 700,
                                      border: '1px solid white',
                                    }}
                                  >
                                    {idx + 1}
                                  </Box>
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'block',
                                      mb: 0.25,
                                      fontSize: '0.8rem',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {webtoon.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: 'text.secondary',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'block',
                                      fontSize: '0.7rem',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {webtoon.author}-ын бүтээл
                                  </Typography>
                                </Box>
                              </Stack>
                            ))}
                          </Stack>

                          {/* Action Button */}
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            endIcon={<Iconify icon="carbon:arrow-right" />}
                            sx={{
                              borderColor: alpha(category.color, 0.4),
                              color: category.color,
                              fontWeight: 500,
                              py: 0.75,
                              borderRadius: 1.5,
                              textTransform: 'none',
                              fontSize: '0.8rem',
                              mt: 'auto',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: category.color,
                                bgcolor: alpha(category.color, 0.06),
                              },
                            }}
                          >
                            Бүгдийг үзэх
                          </Button>
                        </Stack>
                      </Card>
                    </m.div>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Call to Action */}
          <m.div variants={varFade().inUp}>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<Iconify icon="carbon:view" />}
                sx={{ px: 6, py: 2 }}
              >
                Бүх ангиллыг үзэх
              </Button>
            </Box>
          </m.div>
        </Stack>
      </Container>
    </Box>
  );
}
