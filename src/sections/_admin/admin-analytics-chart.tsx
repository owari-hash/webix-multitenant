import { m } from 'framer-motion';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const CHART_DATA = {
  daily: [
    { day: 'Даваа', views: 12500, users: 2300, revenue: 45000 },
    { day: 'Мягмар', views: 15200, users: 2800, revenue: 52000 },
    { day: 'Лхагва', views: 18900, users: 3200, revenue: 61000 },
    { day: 'Пүрэв', views: 21500, users: 3600, revenue: 68000 },
    { day: 'Баасан', views: 25800, users: 4100, revenue: 78000 },
    { day: 'Бямба', views: 32400, users: 5200, revenue: 95000 },
    { day: 'Ням', views: 28900, users: 4500, revenue: 82000 },
  ],
  weekly: [
    { week: '1-р долоо', views: 125000, users: 23000, revenue: 450000 },
    { week: '2-р долоо', views: 152000, users: 28000, revenue: 520000 },
    { week: '3-р долоо', views: 189000, users: 32000, revenue: 610000 },
    { week: '4-р долоо', views: 215000, users: 36000, revenue: 680000 },
  ],
};

const METRICS = [
  {
    label: 'Дундаж үзэлт',
    value: '21.5K',
    change: '+12.5%',
    icon: 'carbon:view',
    color: '#6366f1',
  },
  {
    label: 'Идэвхтэй хэрэглэгч',
    value: '3.4K',
    change: '+8.3%',
    icon: 'carbon:user-multiple',
    color: '#8b5cf6',
  },
  {
    label: 'Өдрийн орлого',
    value: '₮68K',
    change: '+15.7%',
    icon: 'carbon:currency',
    color: '#10b981',
  },
];

export default function AdminAnalyticsChart() {
  const theme = useTheme();
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');

  const currentData = CHART_DATA[period];
  const maxValue = Math.max(...currentData.map((d) => d.views));

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
                Статистик шинжилгээ
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Платформын үзэлт болон хэрэглэгчдийн идэвхжилт
              </Typography>
            </Box>

            <ButtonGroup variant="outlined" sx={{ alignSelf: 'center' }}>
              <Button
                onClick={() => setPeriod('daily')}
                variant={period === 'daily' ? 'contained' : 'outlined'}
              >
                Өдөр
              </Button>
              <Button
                onClick={() => setPeriod('weekly')}
                variant={period === 'weekly' ? 'contained' : 'outlined'}
              >
                Долоо хоног
              </Button>
            </ButtonGroup>
          </Stack>
        </m.div>

        {/* Metrics Cards */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
            },
          }}
        >
          {METRICS.map((metric) => (
            <m.div key={metric.label} variants={varFade().inUp}>
              <Card
                sx={{
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (t) => t.customShadows.z20,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(metric.color, 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon={metric.icon} sx={{ color: metric.color, fontSize: 24 }} />
                  </Box>

                  <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {metric.label}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {metric.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'success.main',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Iconify icon="carbon:arrow-up" sx={{ fontSize: 14, mr: 0.5 }} />
                        {metric.change}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            </m.div>
          ))}
        </Box>

        {/* Simple Bar Chart */}
        <m.div variants={varFade().inUp}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
              Үзэлтийн график
            </Typography>

            <Stack spacing={3}>
              {currentData.map((item, index) => {
                const label = 'day' in item ? item.day : item.week;
                const percentage = (item.views / maxValue) * 100;

                return (
                  <Box key={label}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2" sx={{ minWidth: 80 }}>
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80 }}>
                        {item.views.toLocaleString()} үзэлт
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        height: 40,
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, 
                            ${theme.palette.primary.main} 0%, 
                            ${theme.palette.secondary.main} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          px: 2,
                          transition: 'width 1s ease-out',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(90deg, 
                              transparent 0%, 
                              ${alpha(theme.palette.common.white, 0.2)} 50%, 
                              transparent 100%)`,
                            animation: 'shimmer 2s infinite',
                          },
                          '@keyframes shimmer': {
                            '0%': { transform: 'translateX(-100%)' },
                            '100%': { transform: 'translateX(100%)' },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Stack>

            {/* Chart Legend */}
            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              sx={{
                mt: 4,
                pt: 3,
                borderTop: `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                  }}
                />
                <Typography variant="caption">Үзэлт</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: theme.palette.success.main,
                  }}
                />
                <Typography variant="caption">Хэрэглэгч</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: theme.palette.warning.main,
                  }}
                />
                <Typography variant="caption">Орлого</Typography>
              </Stack>
            </Stack>
          </Card>
        </m.div>
      </Stack>
    </Container>
  );
}

