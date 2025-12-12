'use client';

import { useMemo, useState, useEffect } from 'react';

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
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { getUser, getAuthHeaders, getCurrentUser, isAuthenticated } from 'src/utils/auth';
import { LevelProgress, ProfileBorder, AchievementsGallery } from 'src/components/achievements';

// ----------------------------------------------------------------------

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subdomain?: string;
  createdAt?: string;
  lastLogin?: string;
  avatar?: string;
}

interface Comic {
  _id?: string;
  id?: string;
  title: string;
  coverUrl?: string;
  cover?: string;
  author?: string;
  genre?: string[];
  rating?: number;
  views?: number;
  likes?: number;
  status?: string;
}

interface ReadingHistoryItem extends Comic {
  lastRead?: string;
  progress?: number;
  currentChapter?: number;
  chapterId?: string;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<Comic[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!isAuthenticated()) {
          // Redirect to login if not authenticated
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          return;
        }

        // Try to get user from API first, fallback to localStorage
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (apiError) {
          // If API fails, try to get from localStorage
          const storedUser = getUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            throw new Error('No user data found');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user data');
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Fetch reading history
  useEffect(() => {
    const fetchReadingHistory = async () => {
      if (!isAuthenticated()) return;

      try {
        setLoadingHistory(true);
        // Try to fetch from API endpoint for reading history
        try {
          const response = await fetch('/api2/webtoon/user/history', {
            headers: getAuthHeaders(),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
              setReadingHistory(result.data);
            } else if (result.success && Array.isArray(result.history)) {
              setReadingHistory(result.history);
            }
          }
        } catch (apiError) {
          // If API endpoint doesn't exist, try to get from localStorage or use empty array
          console.log('Reading history API not available');
        }
      } catch (err) {
        console.error('Error loading reading history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (currentTab === 0) {
      fetchReadingHistory();
    }
  }, [currentTab]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated()) return;

      try {
        setLoadingFavorites(true);
        // Try to fetch from API endpoint for favorites
        try {
          const response = await fetch('/api2/webtoon/user/favorites', {
            headers: getAuthHeaders(),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
              setFavorites(result.data);
            } else if (result.success && Array.isArray(result.favorites)) {
              setFavorites(result.favorites);
            }
          }
        } catch (apiError) {
          // If API endpoint doesn't exist, try to get from localStorage or use empty array
          console.log('Favorites API not available');
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setLoadingFavorites(false);
      }
    };

    if (currentTab === 1) {
      fetchFavorites();
    }
  }, [currentTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Calculate stats from real data (must be before early returns)
  const stats = useMemo(() => {
    const uniqueComicsRead = new Set(readingHistory.map((item) => item._id || item.id)).size;
    const totalChaptersRead = readingHistory.reduce(
      (sum, item) => sum + (item.currentChapter || 0),
      0
    );
    const estimatedHours = Math.floor(totalChaptersRead * 0.5); // Estimate 0.5 hours per chapter

    return {
      readComics: uniqueComicsRead || readingHistory.length,
      favoriteComics: favorites.length,
      readingHours: estimatedHours,
      chaptersRead: totalChaptersRead,
    };
  }, [readingHistory, favorites]);

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 5, md: 8 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Alert severity="error">{error || 'Failed to load profile. Please try again.'}</Alert>
      </Container>
    );
  }

  // Format user data for display
  const displayUser = {
    id: user.id || '',
    name: user.name || 'Батбаяр',
    email: user.email || 'batbayar@example.com',
    avatar: user.avatar || '/assets/images/avatar/avatar_1.jpg',
    role: user.role || 'user',
    joinDate: user.createdAt || new Date().toISOString(),
    stats,
    badges: [
      { id: '1', name: 'Шинэ уншигч', icon: 'carbon:star', color: 'primary' },
      { id: '2', name: 'Комик дуртай', icon: 'carbon:favorite', color: 'error' },
      { id: '3', name: 'Идэвхтэй уншигч', icon: 'carbon:fire', color: 'warning' },
    ],
  };

  // Get role label
  const getRoleLabel = () => {
    if (displayUser.role === 'user') return 'Уншигч';
    if (displayUser.role === 'admin') return 'Админ';
    return 'Зохиолч';
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={5}>
        {/* Profile Header */}
        <Card sx={{ p: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <ProfileBorder userId={user.id} size={120} showLevel />

            <Stack spacing={2} sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h4">{displayUser.name}</Typography>
                <Chip label={getRoleLabel()} color="primary" size="small" />
              </Stack>

              <Typography variant="body1" color="text.secondary">
                {displayUser.email}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Нэгдсэн огноо: {new Date(displayUser.joinDate).toLocaleDateString('mn-MN')}
                {user.subdomain && (
                  <Chip
                    label={`Subdomain: ${user.subdomain}`}
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>

              {/* Badges */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {displayUser.badges.map((badge) => (
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

            <Button variant="contained" component={RouterLink} href={paths.profile.settings}>
              Профайл засах
            </Button>
          </Stack>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:book" sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4">{displayUser.stats.readComics}</Typography>
              <Typography variant="body2" color="text.secondary">
                Уншсан комик
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:favorite" sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h4">{displayUser.stats.favoriteComics}</Typography>
              <Typography variant="body2" color="text.secondary">
                Дуртай комик
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="carbon:time" sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4">{displayUser.stats.readingHours}</Typography>
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
              <Typography variant="h4">{displayUser.stats.chaptersRead}</Typography>
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
            <Tab label="Амжилт" />
          </Tabs>

          {/* Reading History Tab */}
          <TabPanel value={currentTab} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Сүүлд уншсан комикууд
              </Typography>

              {(() => {
                if (loadingHistory) {
                  return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                      <CircularProgress />
                    </Box>
                  );
                }

                if (readingHistory.length === 0) {
                  return (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 8,
                        color: 'text.secondary',
                      }}
                    >
                      <Iconify icon="carbon:book" sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Уншсан түүх байхгүй байна
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3 }}>
                        Комик уншаад түүхээ эндээс харна уу
                      </Typography>
                      <Button
                        variant="contained"
                        component={RouterLink}
                        href={paths.webtoon.browse}
                      >
                        Комик хайх
                      </Button>
                    </Box>
                  );
                }

                return (
                  <Grid container spacing={3}>
                    {readingHistory.map((comic) => {
                      const comicId = comic._id || comic.id || '';
                      const coverUrl = comic.coverUrl || comic.cover || '/assets/placeholder.svg';
                      const progress = comic.progress || 0;
                      const currentChapter = comic.currentChapter || 1;

                      return (
                        <Grid key={comicId} xs={12} sm={6} md={4} lg={3}>
                          <Card
                            sx={{ height: '100%', cursor: 'pointer' }}
                            component={RouterLink}
                            href={paths.webtoon.comic(comicId)}
                          >
                            <Image src={coverUrl} alt={comic.title} ratio="3/4" />

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
                                Бүлэг {currentChapter} - {progress}% дууссан
                              </Typography>

                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ height: 6, borderRadius: 3 }}
                              />

                              <Button
                                variant="outlined"
                                size="small"
                                fullWidth
                                component={RouterLink}
                                href={
                                  comic.chapterId
                                    ? paths.webtoon.chapter(comicId, comic.chapterId)
                                    : paths.webtoon.comic(comicId)
                                }
                                onClick={(e) => e.stopPropagation()}
                              >
                                Үргэлжлүүлэх
                              </Button>
                            </Stack>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              })()}
            </Box>
          </TabPanel>

          {/* Favorites Tab */}
          <TabPanel value={currentTab} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Дуртай комикууд
              </Typography>

              {(() => {
                if (loadingFavorites) {
                  return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                      <CircularProgress />
                    </Box>
                  );
                }

                if (favorites.length === 0) {
                  return (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 8,
                        color: 'text.secondary',
                      }}
                    >
                      <Iconify icon="carbon:favorite" sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Дуртай комик байхгүй байна
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3 }}>
                        Комик дуртай болгож тэндээс харна уу
                      </Typography>
                      <Button
                        variant="contained"
                        component={RouterLink}
                        href={paths.webtoon.browse}
                      >
                        Комик хайх
                      </Button>
                    </Box>
                  );
                }

                return (
                  <Grid container spacing={3}>
                    {favorites.map((comic) => {
                      const comicId = comic._id || comic.id || '';
                      const coverUrl = comic.coverUrl || comic.cover || '/assets/placeholder.svg';
                      const rating = comic.rating || 0;

                      return (
                        <Grid key={comicId} xs={12} sm={6} md={4} lg={3}>
                          <Card
                            sx={{ height: '100%', cursor: 'pointer' }}
                            component={RouterLink}
                            href={paths.webtoon.comic(comicId)}
                          >
                            <Image src={coverUrl} alt={comic.title} ratio="3/4" />

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

                              {comic.author && (
                                <Typography variant="body2" color="text.secondary">
                                  {comic.author}
                                </Typography>
                              )}

                              {rating > 0 && (
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                  <Rating value={rating} precision={0.1} size="small" readOnly />
                                  <Typography variant="caption" color="text.secondary">
                                    {rating.toFixed(1)}
                                  </Typography>
                                </Stack>
                              )}

                              <Button
                                variant="contained"
                                size="small"
                                fullWidth
                                component={RouterLink}
                                href={paths.webtoon.comic(comicId)}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Унших
                              </Button>
                            </Stack>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              })()}
            </Box>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={currentTab} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Профайлын тохиргоо
              </Typography>

              <Stack spacing={3}>
                <Button variant="outlined" component={RouterLink} href={paths.profile.settings}>
                  Хувийн мэдээлэл засах
                </Button>

                <Button variant="outlined" component={RouterLink} href={paths.profile.settings}>
                  Нууц үг солих
                </Button>

                <Button variant="outlined" component={RouterLink} href={paths.profile.settings}>
                  Мэдэгдлийн тохиргоо
                </Button>

                <Button variant="outlined" component={RouterLink} href={paths.profile.settings}>
                  Хувийн нууцлал
                </Button>

                <Button variant="outlined" color="error">
                  Бүртгэл устгах
                </Button>
              </Stack>
            </Box>
          </TabPanel>

          {/* Achievements Tab */}
          <TabPanel value={currentTab} index={3}>
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                <LevelProgress userId={user.id} compact={false} />
                <AchievementsGallery userId={user.id} />
              </Stack>
            </Box>
          </TabPanel>
        </Card>
      </Stack>
    </Container>
  );
}
