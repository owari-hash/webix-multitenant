import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { _webtoons, _webtoonCategories } from 'src/_mock';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeWebtoonCategories() {
  const theme = useTheme();

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
        position: 'relative',
        bgcolor: 'grey.50',
        py: { xs: 10, md: 15 },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          zIndex: 0,
        },
      }}
    >
      <Container component={MotionViewport} maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={8}>
          {/* Header Section */}
          <Stack spacing={3} sx={{ textAlign: 'center' }}>
            <m.div variants={varFade().inUp}>
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  letterSpacing: 1.5,
                }}
              >
                Ангилал
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Ангиллаар судлах
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 640,
                  mx: 'auto',
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Дуртай төрлөө олоод гайхамшигтай веб комикуудыг нээж үзээрэй
              </Typography>
            </m.div>
          </Stack>

          {/* Categories Grid */}
          <Box sx={{ px: { xs: 0, sm: 2 } }}>
            <Grid container spacing={4}>
              {_webtoonCategories.slice(0, 8).map((category, index) => {
                const categoryWebtoons = getWebtoonsByCategory(category.slug);
                const translatedName = translateCategoryName(category.name);
                const categoryIcon = getCategoryIcon(translatedName);

                return (
                  <Grid key={category.id} xs={12} sm={6} md={4} lg={3}>
                    <m.div variants={varFade().inUp} style={{ height: '100%' }}>
                      <Card
                        sx={{
                          p: 3,
                          height: '100%',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: '1px solid',
                          borderColor: 'transparent',
                          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.02)',
                            boxShadow: `0 20px 40px ${alpha(category.color, 0.15)}`,
                            borderColor: alpha(category.color, 0.3),
                            '& .category-icon': {
                              transform: 'scale(1.1) rotate(5deg)',
                            },
                            '& .category-name': {
                              color: category.color,
                            },
                          },
                        }}
                      >
                        <Stack spacing={3} sx={{ height: '100%' }}>
                          {/* Category Header */}
                          <Stack direction="row" alignItems="center" spacing={2.5}>
                            <Box
                              className="category-icon"
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${alpha(
                                  category.color,
                                  0.1
                                )} 0%, ${alpha(category.color, 0.2)} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                border: `2px solid ${alpha(category.color, 0.1)}`,
                              }}
                            >
                              <Iconify
                                icon={categoryIcon}
                                sx={{
                                  color: category.color,
                                  fontSize: 28,
                                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                                }}
                              />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                className="category-name"
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  mb: 0.5,
                                  transition: 'color 0.3s ease',
                                  fontSize: '1.1rem',
                                }}
                              >
                                {translatedName}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  fontWeight: 500,
                                }}
                              >
                                {categoryWebtoons.length} веб комик
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Webtoon Previews */}
                          <Stack spacing={2} sx={{ flex: 1 }}>
                            {categoryWebtoons.map((webtoon, idx) => (
                              <Stack
                                key={webtoon.id}
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
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
                                    borderRadius: 1.5,
                                  }}
                                >
                                  <Image
                                    alt={webtoon.title}
                                    src={webtoon.coverUrl}
                                    sx={{
                                      width: 44,
                                      height: 44,
                                      objectFit: 'cover',
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: 0,
                                      right: 0,
                                      width: 16,
                                      height: 16,
                                      bgcolor: category.color,
                                      borderRadius: '0 6px 0 6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'white',
                                        fontSize: '0.6rem',
                                        fontWeight: 700,
                                      }}
                                    >
                                      {idx + 1}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 600,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'block',
                                      mb: 0.25,
                                      fontSize: '0.85rem',
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
                                      fontSize: '0.75rem',
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
                            size="medium"
                            fullWidth
                            endIcon={<Iconify icon="carbon:arrow-right" />}
                            sx={{
                              borderColor: alpha(category.color, 0.3),
                              color: category.color,
                              fontWeight: 600,
                              py: 1.2,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '0.9rem',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: category.color,
                                bgcolor: alpha(category.color, 0.08),
                                transform: 'scale(1.02)',
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
            <Stack alignItems="center" spacing={3}>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  maxWidth: 480,
                }}
              >
                Бүх ангиллыг судлаж, өөрийн дуртай веб комикуудыг олоорой
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<Iconify icon="carbon:grid-view" />}
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                }}
              >
                Бүх ангиллыг үзэх
              </Button>
            </Stack>
          </m.div>
        </Stack>
      </Container>
    </Box>
  );
}
