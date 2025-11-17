import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const STATUS_MAP: Record<
  string,
  { label: string; color: 'success' | 'warning' | 'error' | 'default' }
> = {
  ongoing: { label: 'Үргэлжилж байна', color: 'success' },
  completed: { label: 'Дууссан', color: 'default' },
  hiatus: { label: 'Түр зогссон', color: 'warning' },
};

export default function AdminComicsManagement() {
  const theme = useTheme();
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('/api2/webtoon/comics');
        const result = await response.json();

        if (result.success && result.comics) {
          // Get only the 4 most recent comics
          const recentComics = result.comics
            .sort(
              (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
            .slice(0, 4);
          setComics(recentComics);
        }
      } catch (error) {
        console.error('Failed to fetch comics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  const formatViews = (views: number): string => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}М`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}К`;
    return views.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Дөнгөж сая';
    if (diffHours < 24) return `${diffHours} цагийн өмнө`;
    if (diffDays === 1) return '1 өдрийн өмнө';
    if (diffDays < 7) return `${diffDays} өдрийн өмнө`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} долоо хоногийн өмнө`;
    return date.toLocaleDateString('mn-MN');
  };

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 8, md: 10 },
      }}
    >
      <Stack spacing={5}>
        <m.div variants={varFade().inUp}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h2" sx={{ mb: 1 }}>
                Сүүлийн комикууд
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Сүүлд шинэчлэгдсэн веб комикууд
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<Iconify icon="carbon:add" />}
              href={paths.webtoon.cms.createComic}
              sx={{
                px: 4,
                py: 1.5,
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Шинэ комик
            </Button>
          </Stack>
        </m.div>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && comics.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Комик олдсонгүй
            </Typography>
          </Box>
        )}

        {!loading && comics.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              },
            }}
          >
            {comics.map((comic) => {
              const statusInfo = STATUS_MAP[comic.status] || STATUS_MAP.ongoing;
              return (
                <m.div key={comic._id || comic.id} variants={varFade().inUp}>
                  <Card
                    sx={{
                      p: 3,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (t) => t.customShadows.z20,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        variant="rounded"
                        src={comic.coverImage}
                        sx={{
                          width: 80,
                          height: 100,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        <Iconify icon="carbon:book" sx={{ fontSize: 32 }} />
                      </Avatar>

                      <Stack spacing={1.5} sx={{ flex: 1 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {comic.title}
                          </Typography>
                          <Chip
                            label={statusInfo.label}
                            size="small"
                            color={statusInfo.color}
                            sx={{ fontWeight: 600 }}
                          />
                        </Stack>

                        {Array.isArray(comic.genre) && comic.genre.length > 0 && (
                          <Stack direction="row" spacing={0.5}>
                            {comic.genre.slice(0, 2).map((g: string) => (
                              <Chip
                                key={g}
                                label={g}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                          </Stack>
                        )}

                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            '& > *': {
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            },
                          }}
                        >
                          <Box>
                            <Iconify
                              icon="carbon:page-break"
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {comic.chapters || 0} бүлэг
                            </Typography>
                          </Box>
                          <Box>
                            <Iconify
                              icon="carbon:view"
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {formatViews(comic.views || 0)} үзэлт
                            </Typography>
                          </Box>
                          {comic.likes && (
                            <Box>
                              <Iconify
                                icon="carbon:favorite-filled"
                                sx={{ fontSize: 16, color: 'error.main' }}
                              />
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {comic.likes}
                              </Typography>
                            </Box>
                          )}
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <Button
                            component={RouterLink}
                            href={paths.webtoon.cms.manageComic(comic._id || comic.id)}
                            size="small"
                            variant="outlined"
                            startIcon={<Iconify icon="carbon:settings" />}
                          >
                            Удирдах
                          </Button>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.disabled', ml: 'auto !important' }}
                          >
                            {comic.updatedAt ? formatDate(comic.updatedAt) : '-'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Card>
                </m.div>
              );
            })}
          </Box>
        )}

        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={RouterLink}
            href={paths.webtoon.cms.comics}
            variant="outlined"
            size="large"
            endIcon={<Iconify icon="carbon:arrow-right" />}
            sx={{ px: 4 }}
          >
            Бүх комикууд үзэх
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
