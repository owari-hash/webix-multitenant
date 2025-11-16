import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const RECENT_USERS = [
  {
    id: '1',
    name: 'Батаа Доржийн',
    email: 'bataa.d@example.com',
    avatar: '/assets/images/avatar/avatar-1.jpg',
    role: 'premium',
    joinedAt: '2 өдрийн өмнө',
    totalRead: 45,
    status: 'active',
  },
  {
    id: '2',
    name: 'Сарнай Баяр',
    email: 'sarnai.b@example.com',
    avatar: '/assets/images/avatar/avatar-2.jpg',
    role: 'user',
    joinedAt: '5 өдрийн өмнө',
    totalRead: 23,
    status: 'active',
  },
  {
    id: '3',
    name: 'Энхээ Цэцэг',
    email: 'enkhee.ts@example.com',
    avatar: '/assets/images/avatar/avatar-3.jpg',
    role: 'premium',
    joinedAt: '1 долоо хоногийн өмнө',
    totalRead: 67,
    status: 'active',
  },
  {
    id: '4',
    name: 'Болд Ганбаатар',
    email: 'bold.g@example.com',
    avatar: '/assets/images/avatar/avatar-4.jpg',
    role: 'user',
    joinedAt: '2 долоо хоногийн өмнө',
    totalRead: 12,
    status: 'inactive',
  },
];

const USER_STATS = [
  {
    label: 'Нийт хэрэглэгч',
    value: 12547,
    growth: 8.5,
    color: '#8b5cf6',
  },
  {
    label: 'Premium хэрэглэгч',
    value: 3421,
    growth: 12.3,
    color: '#f59e0b',
  },
  {
    label: 'Идэвхтэй хэрэглэгч',
    value: 8934,
    growth: 5.7,
    color: '#10b981',
  },
];

export default function AdminUsersOverview() {
  const theme = useTheme();

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
            <Typography variant="h2" sx={{ mb: 1 }}>
              Хэрэглэгчид
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Шинээр бүртгүүлсэн болон идэвхтэй хэрэглэгчид
            </Typography>
          </m.div>

          {/* User Stats Cards */}
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
            {USER_STATS.map((stat) => (
              <m.div key={stat.label} variants={varFade().inUp}>
                <Card
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {stat.value.toLocaleString()}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LinearProgress
                        variant="determinate"
                        value={stat.growth * 10}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 1,
                          bgcolor: alpha(stat.color, 0.12),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: stat.color,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: stat.color, fontWeight: 700, minWidth: 45 }}
                      >
                        +{stat.growth}%
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </m.div>
            ))}
          </Box>

          {/* Recent Users List */}
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
            {RECENT_USERS.map((user) => (
              <m.div key={user.id} variants={varFade().inUp}>
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
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={user.avatar}
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      <Iconify icon="carbon:user" sx={{ fontSize: 28 }} />
                    </Avatar>

                    <Stack spacing={1} sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                        <Chip
                          label={user.role === 'premium' ? 'Premium' : 'Үндсэн'}
                          size="small"
                          color={user.role === 'premium' ? 'warning' : 'default'}
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>

                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user.email}
                      </Typography>

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
                            icon="carbon:book"
                            sx={{ fontSize: 14, color: 'text.secondary' }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {user.totalRead} уншсан
                          </Typography>
                        </Box>
                        <Box>
                          <Iconify
                            icon="carbon:time"
                            sx={{ fontSize: 14, color: 'text.secondary' }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {user.joinedAt}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              </m.div>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<Iconify icon="carbon:arrow-right" />}
              sx={{ px: 4 }}
            >
              Бүх хэрэглэгчид үзэх
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

