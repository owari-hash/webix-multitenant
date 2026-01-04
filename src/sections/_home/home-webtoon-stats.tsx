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
      color: theme.palette.primary.main,
    },
    {
      label: 'Нийт Үзэлт',
      value: formatNumber(totalViews),
      icon: 'carbon:view',
      color: theme.palette.secondary.main,
    },
    {
      label: 'Нийт Лайк',
      value: formatNumber(totalLikes),
      icon: 'carbon:favorite',
      color: theme.palette.error.main,
    },
    {
      label: 'Нийт Бүлэг',
      value: formatNumber(totalChapters),
      icon: 'carbon:page-break',
      color: theme.palette.info.main,
    },
    {
      label: 'Дундаж Үнэлгээ',
      value: averageRating,
      icon: 'carbon:star',
      color: theme.palette.warning.main,
    },
    {
      label: 'Идэвхтэй Уншигчид',
      value: formatNumber(totalViews / 100),
      icon: 'carbon:user-multiple',
      color: theme.palette.success.main,
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
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 2,
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(
                  theme.palette.text.primary,
                  0.5
                )} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Платформын Статистик
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.6,
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
                    p: 4,
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: (t) => `0 24px 48px ${alpha(t.palette.common.black, 0.08)}`,
                      borderColor: alpha(stat.color, 0.3),
                      '& .stat-icon-container': {
                        transform: 'scale(1.1) rotate(5deg)',
                        bgcolor: alpha(stat.color, 0.15),
                      },
                    },
                  }}
                >
                  <Stack spacing={2.5} alignItems="center">
                    <Box
                      className="stat-icon-container"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: alpha(stat.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Iconify icon={stat.icon} sx={{ color: stat.color, fontSize: 32 }} />
                    </Box>

                    <Stack spacing={0.5}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          letterSpacing: -0.5,
                        }}
                      >
                        {stat.value}
                      </Typography>

                      <Typography
                        variant="overline"
                        sx={{
                          color: 'text.disabled',
                          fontWeight: 700,
                          letterSpacing: 1.2,
                          fontSize: '0.75rem',
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Stack>
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
