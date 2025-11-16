import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  comics: any[];
};

export default function HomeWebtoonStats({ comics }: Props) {
  const theme = useTheme();

  // Calculate stats from real data
  const totalComics = comics.length;
  const totalChapters = comics.reduce((sum, comic) => sum + (comic.chapters || 0), 0);
  const totalViews = comics.reduce((sum, comic) => sum + (comic.views || 0), 0);
  const totalLikes = comics.reduce((sum, comic) => sum + (comic.likes || 0), 0);
  const averageRating = totalLikes > 0 ? Math.min(5, (totalLikes / totalComics) / 20).toFixed(1) : '4.5';

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}М`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}К`;
    return num.toString();
  };

  const STATS = [
    {
      label: 'Нийт Веб Комик',
      value: totalComics.toString(),
      icon: 'carbon:book',
      color: '#ff6b6b',
    },
    {
      label: 'Нийт Үзэлт',
      value: formatNumber(totalViews),
      icon: 'carbon:view',
      color: '#4ecdc4',
    },
    {
      label: 'Нийт Лайк',
      value: formatNumber(totalLikes),
      icon: 'carbon:favorite',
      color: '#45b7d1',
    },
    {
      label: 'Нийт Бүлэг',
      value: formatNumber(totalChapters),
      icon: 'carbon:page-break',
      color: '#96ceb4',
    },
    {
      label: 'Дундаж Үнэлгээ',
      value: averageRating,
      icon: 'carbon:star',
      color: '#feca57',
    },
    {
      label: 'Идэвхтэй Уншигчид',
      value: formatNumber(totalViews / 100), // Estimated active readers
      icon: 'carbon:user-multiple',
      color: '#ff9ff3',
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
          theme.palette.secondary.main,
          0.1
        )} 100%)`,
      }}
    >
      <Container component={MotionViewport}>
        <Stack spacing={5}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h2" sx={{ textAlign: 'center', mb: 2 }}>
              Платформын Статистик
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Манай платформ дээр гайхамшигтай түүхүүдийг олж мэдсэн олон мянган уншигчидтай
              нэгдээрэй
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
                lg: 'repeat(6, 1fr)',
              },
            }}
          >
            {STATS.map((stat, index) => (
              <m.div key={stat.label} variants={varFade().inUp}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (t) => t.customShadows.z20,
                    },
                  }}
                >
                  <Stack spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: alpha(stat.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon={stat.icon} sx={{ color: stat.color, fontSize: 28 }} />
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: stat.color,
                        background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(
                          stat.color,
                          0.7
                        )} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Stack>
                </Card>
              </m.div>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
