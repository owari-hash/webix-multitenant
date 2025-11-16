import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const STAT_CONFIG = [
  {
    key: 'comics',
    label: 'Нийт комик',
    icon: 'carbon:book',
    color: '#6366f1',
  },
  {
    key: 'chapters',
    label: 'Нийт бүлэг',
    icon: 'carbon:page-break',
    color: '#06b6d4',
  },
  {
    key: 'users',
    label: 'Нийт хэрэглэгч',
    icon: 'carbon:user-multiple',
    color: '#8b5cf6',
  },
  {
    key: 'views',
    label: 'Сарын үзэлт',
    icon: 'carbon:view',
    color: '#ec4899',
  },
  {
    key: 'pending',
    label: 'Хүлээгдэж байна',
    icon: 'carbon:time',
    color: '#f59e0b',
  },
  {
    key: 'activeAuthors',
    label: 'Идэвхтэй зохиолч',
    icon: 'carbon:user-avatar-filled',
    color: '#10b981',
  },
];

export default function AdminDashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch comics
        const comicsResponse = await fetch('/api2/webtoon/comics');
        const comicsData = await comicsResponse.json();

        const comics = comicsData.comics || [];
        const totalComics = comics.length;

        // Calculate total chapters
        const totalChapters = comics.reduce(
          (sum: number, comic: any) => sum + (comic.chapters || 0),
          0
        );

        // Calculate total views
        const totalViews = comics.reduce((sum: number, comic: any) => sum + (comic.views || 0), 0);

        // Calculate pending (hiatus status comics)
        const pendingComics = comics.filter((comic: any) => comic.status === 'hiatus').length;

        // Calculate active authors (unique authors with ongoing comics)
        const activeAuthors = new Set(
          comics
            .filter((comic: any) => comic.status === 'ongoing')
            .map((comic: any) => comic.author)
        ).size;

        setStats({
          comics: totalComics,
          chapters: totalChapters,
          users: 0, // Will need user API endpoint
          views: totalViews,
          pending: pendingComics,
          activeAuthors,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}М`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}К`;
    return num.toString();
  };

  if (loading) {
    return (
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          bgcolor: 'background.neutral',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'background.neutral',
      }}
    >
      <Container component={MotionViewport}>
        <Stack spacing={5}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Үндсэн Статистик
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 700,
              }}
            >
              Платформын үйл ажиллагааны бодит цагийн статистик мэдээлэл
            </Typography>
          </m.div>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {STAT_CONFIG.map((config) => {
              const value = stats?.[config.key] || 0;
              return (
                <m.div key={config.key} variants={varFade().inUp}>
                  <Card
                    sx={{
                      p: 3,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (t) => t.customShadows.z20,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${config.color} 0%, ${alpha(
                          config.color,
                          0.5
                        )} 100%)`,
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: alpha(config.color, 0.12),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Iconify icon={config.icon} sx={{ color: config.color, fontSize: 32 }} />
                      </Box>

                      <Box>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 'bold',
                            color: config.color,
                            mb: 0.5,
                          }}
                        >
                          {formatNumber(value)}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                          }}
                        >
                          {config.label}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </m.div>
              );
            })}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
