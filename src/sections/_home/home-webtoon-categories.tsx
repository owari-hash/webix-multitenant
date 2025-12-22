import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeWebtoonCategories() {
  const theme = useTheme();
  const categories: any[] = []; // Empty for now, will be populated from API

  const getWebtoonsByCategory = (categorySlug: string): any[] => [];

  // Return null if no categories
  if (categories.length === 0) {
    return null;
  }

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      Экшн: 'carbon:flash',
      Зохиолс: 'carbon:favorite',
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
      Romance: 'Зохиолс',
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
        bgcolor: 'background.neutral',
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
        // Subtle gradient background
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg,
            ${alpha(theme.palette.primary.main, 0.02)} 0%,
            ${alpha(theme.palette.secondary.main, 0.02)} 50%,
            transparent 100%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container component={MotionViewport} maxWidth="lg">
        <Stack spacing={6}>
          {/* Header Section */}
          <m.div variants={varFade().inUp}>
            <Stack spacing={2} sx={{ textAlign: 'center', mb: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg,
                    ${theme.palette.primary.main} 0%,
                    ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Ангиллаар судлах
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 600,
                  mx: 'auto',
                  fontWeight: 400,
                  fontSize: { xs: '0.875rem', md: '1.25rem' },
                }}
              >
                Дуртай төрлөө олоод гайхамшигтай веб комикуудыг нээж үзээрэй
              </Typography>
            </Stack>
          </m.div>

          {/* Categories Grid */}
          <Box>
            <Grid
              container
              spacing={{ xs: 3, sm: 3, md: 4, lg: 4 }}
              sx={{
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              {categories.map((category: any, index: number) => {
                const categoryWebtoons = getWebtoonsByCategory(category.slug);
                const translatedName = translateCategoryName(category.name);
                const categoryIcon = getCategoryIcon(translatedName);

                return (
                  <Grid
                    key={category.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                      display: 'flex',
                      minHeight: { xs: 280, md: 320 },
                      p: { xs: 1, sm: 1.5, md: 2 },
                    }}
                  >
                    <m.div variants={varFade().inUp} style={{ width: '100%', height: '100%' }}>
                      <Card
                        sx={{
                          p: { xs: 2, md: 2.5 },
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          width: '100%',
                          borderRadius: 3,
                          border: `1px solid ${alpha(category.color, 0.2)}`,
                          bgcolor: 'background.paper',
                          background: `linear-gradient(135deg,
                            ${alpha(category.color, 0.03)} 0%,
                            ${alpha(category.color, 0.01)} 50%,
                            transparent 100%)`,
                          boxShadow: `0 4px 20px ${alpha(category.color, 0.1)},
                            0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: `linear-gradient(90deg,
                              ${category.color} 0%,
                              ${alpha(category.color, 0.8)} 50%,
                              ${alpha(category.color, 0.4)} 100%)`,
                            opacity: 0,
                            transition: 'opacity 0.4s ease',
                            zIndex: 1,
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            right: '-50%',
                            width: '200%',
                            height: '200%',
                            background: `radial-gradient(circle,
                              ${alpha(category.color, 0.08)} 0%,
                              transparent 70%)`,
                            opacity: 0,
                            transition: 'opacity 0.4s ease',
                            pointerEvents: 'none',
                          },
                          '&:hover': {
                            transform: 'translateY(-10px) scale(1.03)',
                            boxShadow: `0 20px 60px ${alpha(category.color, 0.25)},
                              0 12px 32px ${alpha(category.color, 0.18)},
                              0 4px 16px ${alpha(theme.palette.common.black, 0.1)}`,
                            borderColor: alpha(category.color, 0.6),
                            background: `linear-gradient(135deg,
                              ${alpha(category.color, 0.08)} 0%,
                              ${alpha(category.color, 0.04)} 50%,
                              transparent 100%)`,
                            '&::before': {
                              opacity: 1,
                            },
                            '&::after': {
                              opacity: 1,
                            },
                            '& .category-icon': {
                              transform: 'scale(1.15) rotate(8deg)',
                              bgcolor: alpha(category.color, 0.25),
                              boxShadow: `0 12px 24px ${alpha(category.color, 0.4)}`,
                            },
                            '& .category-name': {
                              color: category.color,
                              transform: 'translateX(6px)',
                              fontWeight: 800,
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
                                width: { xs: 44, md: 56 },
                                height: { xs: 44, md: 56 },
                                borderRadius: 2,
                                bgcolor: alpha(category.color, 0.12),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: `2px solid ${alpha(category.color, 0.3)}`,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: '-50%',
                                  left: '-50%',
                                  width: '200%',
                                  height: '200%',
                                  background: `radial-gradient(circle,
                                    ${alpha(category.color, 0.2)} 0%,
                                    transparent 70%)`,
                                  opacity: 0,
                                  transition: 'opacity 0.3s ease',
                                },
                                '&:hover::before': {
                                  opacity: 1,
                                },
                              }}
                            >
                              <Iconify
                                icon={categoryIcon}
                                sx={{
                                  color: category.color,
                                  fontSize: { xs: 22, md: 28 },
                                  filter: `drop-shadow(0 2px 4px ${alpha(category.color, 0.3)})`,
                                  position: 'relative',
                                  zIndex: 1,
                                }}
                              />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                className="category-name"
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 700,
                                  mb: 0.5,
                                  transition: 'all 0.3s ease',
                                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                                  lineHeight: 1.3,
                                  color: 'text.primary',
                                }}
                              >
                                {translatedName}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontWeight: 500,
                                  fontSize: { xs: '0.7rem', md: '0.75rem' },
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                }}
                              >
                                <Iconify icon="carbon:book" sx={{ fontSize: 14 }} />
                                {categoryWebtoons.length} веб комик
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Webtoon Previews */}
                          <Stack spacing={1.5} sx={{ flex: 1, minHeight: 140 }}>
                            {categoryWebtoons.map((webtoon: any, idx: number) => (
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
                                    borderRadius: 1.5,
                                    flexShrink: 0,
                                    border: `2px solid ${alpha(category.color, 0.2)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      borderColor: alpha(category.color, 0.5),
                                      transform: 'scale(1.05)',
                                    },
                                  }}
                                >
                                  <Image
                                    alt={webtoon.title}
                                    src={webtoon.coverUrl}
                                    sx={{
                                      width: { xs: 40, md: 48 },
                                      height: { xs: 40, md: 48 },
                                      objectFit: 'cover',
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: -4,
                                      right: -4,
                                      width: 20,
                                      height: 20,
                                      bgcolor: category.color,
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.65rem',
                                      color: 'white',
                                      fontWeight: 800,
                                      border: '2px solid white',
                                      boxShadow: `0 2px 8px ${alpha(category.color, 0.4)}`,
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
                                      mb: 0.5,
                                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                                      lineHeight: 1.3,
                                      color: 'text.primary',
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
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      fontSize: { xs: '0.65rem', md: '0.7rem' },
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    <Iconify icon="carbon:user" sx={{ fontSize: 12 }} />
                                    {webtoon.author}
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
                              borderWidth: 2,
                              color: category.color,
                              fontWeight: 600,
                              py: { xs: 0.75, md: 1 },
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: { xs: '0.75rem', md: '0.85rem' },
                              mt: 'auto',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(90deg,
                                  transparent,
                                  ${alpha(category.color, 0.1)},
                                  transparent)`,
                                transition: 'left 0.5s ease',
                              },
                              '&:hover': {
                                borderColor: category.color,
                                bgcolor: alpha(category.color, 0.1),
                                transform: 'translateX(4px)',
                                boxShadow: `0 4px 12px ${alpha(category.color, 0.2)}`,
                                '&::before': {
                                  left: '100%',
                                },
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
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<Iconify icon="carbon:view" />}
                sx={{
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 700,
                  borderRadius: 3,
                  background: `linear-gradient(135deg,
                    ${theme.palette.primary.main} 0%,
                    ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                }}
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
