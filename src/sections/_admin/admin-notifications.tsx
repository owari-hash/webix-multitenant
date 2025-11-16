import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'warning',
    icon: 'carbon:warning',
    title: 'Систем шинэчлэл',
    message: 'Систем 2 цагийн дараа шинэчлэгдэх тул түр хугацаагаар унтрах болно',
    time: '10 минутын өмнө',
    color: '#f59e0b',
  },
  {
    id: '2',
    type: 'success',
    icon: 'carbon:checkmark-filled',
    title: 'Шинэ комик нэмэгдлээ',
    message: '"Solo Leveling" комикт 5 шинэ бүлэг нэмэгдлээ',
    time: '1 цагийн өмнө',
    color: '#10b981',
  },
  {
    id: '3',
    type: 'info',
    icon: 'carbon:information',
    title: 'Статистик мэдээлэл',
    message: 'Өнөөдрийн үзэлт 45,000 давлаа',
    time: '2 цагийн өмнө',
    color: '#3b82f6',
  },
  {
    id: '4',
    type: 'error',
    icon: 'carbon:warning-alt',
    title: 'Алдааны мэдэгдэл',
    message: 'Зарим хэрэглэгчид нэвтрэх үед асуудал гарч байна',
    time: '3 цагийн өмнө',
    color: '#ef4444',
  },
];

const QUICK_ACTIONS = [
  {
    title: 'Шинэ комик нэмэх',
    description: 'Платформд шинэ веб комик нэмэх',
    icon: 'carbon:add-filled',
    color: '#6366f1',
  },
  {
    title: 'Хэрэглэгч удирдах',
    description: 'Хэрэглэгчдийн эрх, мэдээллийг засах',
    icon: 'carbon:user-admin',
    color: '#8b5cf6',
  },
  {
    title: 'Тайлан харах',
    description: 'Өдрийн болон долоо хоногийн тайлан',
    icon: 'carbon:chart-line',
    color: '#ec4899',
  },
  {
    title: 'Тохиргоо',
    description: 'Системийн тохиргоо өөрчлөх',
    icon: 'carbon:settings',
    color: '#06b6d4',
  },
];

export default function AdminNotifications() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'background.neutral',
      }}
    >
      <Container component={MotionViewport}>
        <Stack spacing={6}>
          {/* Notifications Section */}
          <Box>
            <m.div variants={varFade().inUp}>
              <Typography variant="h2" sx={{ mb: 1 }}>
                Мэдэгдлүүд
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Сүүлийн үеийн мэдэгдэл болон анхааруулга
              </Typography>
            </m.div>

            <Stack spacing={2}>
              {NOTIFICATIONS.map((notification) => (
                <m.div key={notification.id} variants={varFade().inUp}>
                  <Card
                    sx={{
                      p: 3,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: (t) => t.customShadows.z20,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: alpha(notification.color, 0.12),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Iconify
                          icon={notification.icon}
                          sx={{ color: notification.color, fontSize: 24 }}
                        />
                      </Box>

                      <Stack spacing={1} sx={{ flex: 1 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type}
                            size="small"
                            sx={{
                              bgcolor: alpha(notification.color, 0.12),
                              color: notification.color,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          />
                        </Stack>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {notification.message}
                        </Typography>

                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                          <Iconify icon="carbon:time" sx={{ fontSize: 14, mr: 0.5 }} />
                          {notification.time}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </m.div>
              ))}
            </Stack>
          </Box>

          {/* Quick Actions Section */}
          <Box>
            <m.div variants={varFade().inUp}>
              <Typography variant="h2" sx={{ mb: 1 }}>
                Түргэн үйлдлүүд
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Түгээмэл хэрэглэгддэг үйлдлүүд
              </Typography>
            </m.div>

            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
              }}
            >
              {QUICK_ACTIONS.map((action) => (
                <m.div key={action.title} variants={varFade().inUp}>
                  <Card
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: (t) => t.customShadows.z24,
                        bgcolor: alpha(action.color, 0.04),
                      },
                    }}
                  >
                    <Stack spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          bgcolor: alpha(action.color, 0.12),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Iconify icon={action.icon} sx={{ color: action.color, fontSize: 32 }} />
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {action.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </m.div>
              ))}
            </Box>
          </Box>

          {/* Bottom CTA */}
          <Box sx={{ textAlign: 'center', pt: 4 }}>
            <m.div variants={varFade().inUp}>
              <Card
                sx={{
                  p: 6,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    Тусламж хэрэгтэй юу?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500 }}>
                    CMS системийн хэрэглэх заавар эсвэл техникийн дэмжлэг авах бол холбогдоно уу
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Iconify icon="carbon:help" />}
                    sx={{
                      px: 5,
                      py: 1.5,
                      fontSize: '1rem',
                    }}
                  >
                    Дэмжлэгтэй холбогдох
                  </Button>
                </Stack>
              </Card>
            </m.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

