import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { _webtoonStats } from 'src/_mock';
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const STATS = [
  {
    label: 'Нийт Веб Комик',
    value: _webtoonStats.totalWebtoons,
    icon: 'carbon:book',
    color: '#ff6b6b',
  },
  {
    label: 'Нийт Үзэлт',
    value: _webtoonStats.totalViews.toLocaleString(),
    icon: 'carbon:view',
    color: '#4ecdc4',
  },
  {
    label: 'Нийт Лайк',
    value: _webtoonStats.totalLikes.toLocaleString(),
    icon: 'carbon:favorite',
    color: '#45b7d1',
  },
  {
    label: 'Нийт Бүлэг',
    value: _webtoonStats.totalChapters.toLocaleString(),
    icon: 'carbon:page-break',
    color: '#96ceb4',
  },
  {
    label: 'Дундаж Үнэлгээ',
    value: _webtoonStats.averageRating,
    icon: 'carbon:star',
    color: '#feca57',
  },
  {
    label: 'Идэвхтэй Уншигчид',
    value: '12.5K',
    icon: 'carbon:user-multiple',
    color: '#ff9ff3',
  },
];

export default function HomeWebtoonStats() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 5, md: 10 },
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
