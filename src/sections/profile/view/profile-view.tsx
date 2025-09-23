'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { _webtoons } from 'src/_mock';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

// Mock user data
const mockUser = {
  id: '1',
  name: 'Батбаяр',
  email: 'batbayar@example.com',
  avatar: '/assets/images/avatar/avatar_1.jpg',
  role: 'user',
  joinDate: '2023-01-15',
  stats: {
    readComics: 45,
    favoriteComics: 12,
    readingHours: 156,
    chaptersRead: 342,
  },
  badges: [
    { id: '1', name: 'Шинэ уншигч', icon: 'carbon:star', color: 'primary' },
    { id: '2', name: 'Комик дуртай', icon: 'carbon:favorite', color: 'error' },
    { id: '3', name: 'Идэвхтэй уншигч', icon: 'carbon:fire', color: 'warning' },
  ],
};

const mockReadingHistory = _webtoons.slice(0, 8).map((webtoon, index) => ({
  ...webtoon,
  lastRead: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
  progress: Math.floor(Math.random() * 100),
  currentChapter: Math.floor(Math.random() * 50) + 1,
}));

const mockFavorites = _webtoons.slice(0, 6);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function ProfileView() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={5}>
        {/* Profile Header */}
        <Card sx={{ p: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <Avatar src={mockUser.avatar} alt={mockUser.name} sx={{ width: 120, height: 120 }} />

            <Stack spacing={2} sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h4">{mockUser.name}</Typography>
                <Chip
                  label={mockUser.role === 'user' ? 'Уншигч' : 'Зохиолч'}
                  color="primary"
                  size="small"
                />
              </Stack>

              <Typography variant="body1" color="text.secondary">
                {mockUser.email}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Нэгдсэн огноо: {new Date(mockUser.joinDate).toLocaleDateString('mn-MN')}
              </Typography>

              {/* Badges */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {mockUser.badges.map((badge) => (
                  <Chip
                    key={badge.id}
                    icon={<Iconify icon={badge.icon} />}
                    label={badge.name}
                    color={badge.color as any}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </Stack>

            <Button variant="contained" href={paths.profile.settings}>
              Профайл засах
            </Button>
          </Stack>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:book" sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4">{mockUser.stats.readComics}</Typography>
              <Typography variant="body2" color="text.secondary">
                Уншсан комик
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:favorite" sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h4">{mockUser.stats.favoriteComics}</Typography>
              <Typography variant="body2" color="text.secondary">
                Дуртай комик
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:time" sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4">{mockUser.stats.readingHours}</Typography>
              <Typography variant="body2" color="text.secondary">
                Цаг унших
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="carbon:page-break"
                sx={{ fontSize: 48, color: 'success.main', mb: 2 }}
              />
              <Typography variant="h4">{mockUser.stats.chaptersRead}</Typography>
              <Typography variant="body2" color="text.secondary">
                Уншсан бүлэг
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
          >
            <Tab label="Унших түүх" />
            <Tab label="Дуртай комикууд" />
            <Tab label="Тохиргоо" />
          </Tabs>

          {/* Reading History Tab */}
          <TabPanel value={currentTab} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Сүүлд уншсан комикууд
              </Typography>

              <Grid container spacing={3}>
                {mockReadingHistory.map((comic) => (
                  <Grid key={comic.id} xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ height: '100%' }}>
                      <Image src={comic.coverUrl} alt={comic.title} ratio="3/4" />

                      <Stack spacing={2} sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {comic.title}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Бүлэг {comic.currentChapter} - {comic.progress}% дууссан
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={comic.progress}
                          sx={{ height: 6, borderRadius: 3 }}
                        />

                        <Button variant="outlined" size="small" fullWidth>
                          Үргэлжлүүлэх
                        </Button>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Favorites Tab */}
          <TabPanel value={currentTab} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Дуртай комикууд
              </Typography>

              <Grid container spacing={3}>
                {mockFavorites.map((comic) => (
                  <Grid key={comic.id} xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ height: '100%' }}>
                      <Image src={comic.coverUrl} alt={comic.title} ratio="3/4" />

                      <Stack spacing={2} sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {comic.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {comic.author}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Rating value={4.5} precision={0.1} size="small" readOnly />
                          <Typography variant="caption" color="text.secondary">
                            4.5
                          </Typography>
                        </Stack>

                        <Button variant="contained" size="small" fullWidth>
                          Унших
                        </Button>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={currentTab} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Профайлын тохиргоо
              </Typography>

              <Stack spacing={3}>
                <Button variant="outlined" href={paths.profile.settings}>
                  Хувийн мэдээлэл засах
                </Button>

                <Button variant="outlined">Нууц үг солих</Button>

                <Button variant="outlined">Мэдэгдлийн тохиргоо</Button>

                <Button variant="outlined">Хувийн нууцлал</Button>

                <Button variant="outlined" color="error">
                  Бүртгэл устгах
                </Button>
              </Stack>
            </Box>
          </TabPanel>
        </Card>
      </Stack>
    </Container>
  );
}
