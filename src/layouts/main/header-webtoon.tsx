import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Link from '@mui/material/Link';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Logo from 'src/components/logo';
import { bgBlur } from 'src/theme/css';
import Label from 'src/components/label';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
import { logout, getUser, isAuthenticated } from 'src/utils/auth';

import { HEADER } from '../config-layout';
import Searchbar from '../common/searchbar';
import HeaderShadow from '../common/header-shadow';
import SettingsButton from '../common/settings-button';

import { navConfig } from './config-navigation';
import NavMobileModern from './nav/mobile/nav-mobile-modern';
import NavDesktopModern from './nav/desktop/nav-desktop-modern';

// ----------------------------------------------------------------------

type Props = {
  headerOnDark: boolean;
};

interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  subdomain?: string;
}

export default function HeaderWebtoon({ headerOnDark }: Props) {
  const theme = useTheme();
  const offset = useOffSetTop();
  const mdUp = useResponsive('up', 'md');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication and load user data
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);

      if (isAuth) {
        const userData = getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case of same-tab changes
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
  };

  // Get user display data with fallbacks
  const displayUser = user || {
    name: 'Батбаяр',
    email: 'batbayar@example.com',
    avatar: '/assets/images/avatar/avatar_1.jpg',
    role: 'user',
  };

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(headerOnDark && {
            color: 'common.white',
            // Add text shadows for better visibility on dark backgrounds
            '& *': {
              textShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.8)},
                          0 1px 3px ${alpha(theme.palette.common.black, 0.6)}`,
            },
            // Ensure logo and icons are visible
            '& svg': {
              filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.common.black, 0.8)})`,
            },
            // Make ALL navigation text white - force override with maximum specificity
            '& nav': {
              '& a, & [class*="MuiBox-root"], & *': {
                color: 'common.white !important',
              },
              // Active nav item - white text with white background (override primary color)
              '& [data-active="true"], & [data-active="true"] a, & a[data-active="true"]': {
                color: 'common.white !important',
                backgroundColor: `${alpha(theme.palette.common.white, 0.15)} !important`,
              },
              // Hover state - white text with white background
              '& a:hover, & [class*="MuiBox-root"]:hover, & a[data-active="true"]:hover': {
                color: 'common.white !important',
                backgroundColor: `${alpha(theme.palette.common.white, 0.1)} !important`,
              },
            },
            // Additional override for any nested elements
            '& nav *': {
              color: 'common.white !important',
            },
          }),
          ...(offset && {
            // Glassmorphism effect when scrolled
            ...bgBlur({
              color: theme.palette.background.default,
              opacity: 0.8,
              blur: 20,
            }),
            backgroundColor: alpha(theme.palette.background.default, 0.7),
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
            color: 'text.primary',
            height: {
              md: HEADER.H_DESKTOP - 16,
            },
            // Remove text shadows when scrolled
            '& *': {
              textShadow: 'none',
            },
            '& svg': {
              filter: 'none',
            },
            // Reset navigation text to normal colors when scrolled
            '& nav': {
              '& a, & [class*="MuiBox-root"], & *': {
                color: 'text.primary !important',
              },
              // Active nav item - normal colors when scrolled
              '& [data-active="true"], & [data-active="true"] a, & a[data-active="true"]': {
                color: 'primary.main !important',
                backgroundColor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
              },
              // Hover state - normal colors when scrolled
              '& a:hover, & [class*="MuiBox-root"]:hover, & a[data-active="true"]:hover': {
                color: 'text.primary !important',
                backgroundColor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
              },
            },
            // Reset nav elements to normal colors
            '& nav *': {
              color: 'inherit !important',
            },
          }),
        }}
      >
        <Container
          sx={{ height: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Logo */}
          <Box
            sx={{
              lineHeight: 0,
              position: 'relative',
              ...(headerOnDark && {
                // Make logo white when on dark background
                filter: 'brightness(0) invert(1)',
                '& img': {
                  filter: 'brightness(0) invert(1)',
                },
              }),
              ...(offset && {
                // Remove filter when scrolled
                filter: 'none',
                '& img': {
                  filter: 'none',
                },
              }),
            }}
          >
            <Logo />
            <Link href="https://zone-docs.vercel.app/changelog" target="_blank" rel="noopener">
              <Label
                color="info"
                sx={{
                  ml: 0.5,
                  px: 0.5,
                  top: -14,
                  left: 60,
                  height: 20,
                  fontSize: 11,
                  cursor: 'pointer',
                  position: 'absolute',
                }}
              >
                v2.1.0
              </Label>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {mdUp && <NavDesktopModern data={navConfig} />}

          {/* Right Side Actions */}
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Search */}
            <Searchbar />

            {authenticated ? (
              <>
                {/* Quick Actions for authenticated users */}
                <Stack direction="row" spacing={1} sx={{ mx: 1 }}>
                  {/* Favorites */}
                  <IconButton
                    size="medium"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'error.main',
                        bgcolor: 'error.lighter',
                      },
                    }}
                    href={paths.profile.favorites}
                  >
                    <Iconify icon="carbon:favorite" />
                  </IconButton>

                  {/* History */}
                  <IconButton
                    size="medium"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'info.main',
                        bgcolor: 'info.lighter',
                      },
                    }}
                    href={paths.profile.history}
                  >
                    <Iconify icon="carbon:time" />
                  </IconButton>

                  {/* Notifications */}
                  <IconButton
                    size="medium"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'warning.main',
                        bgcolor: 'warning.lighter',
                      },
                    }}
                    onClick={handleNotificationOpen}
                  >
                    <Badge badgeContent={3} color="error">
                      <Iconify icon="carbon:notification" />
                    </Badge>
                  </IconButton>

                  {/* CMS Access for admins only */}
                  {displayUser.role === 'admin' && (
                    <IconButton
                      size="medium"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'success.main',
                          bgcolor: 'success.lighter',
                        },
                      }}
                      href={paths.webtoon.cms.dashboard}
                    >
                      <Iconify icon="carbon:dashboard" />
                    </IconButton>
                  )}
                </Stack>

                {/* User Profile */}
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    p: 0,
                    ml: 1,
                    '&:hover': {
                      '& .MuiAvatar-root': {
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                      },
                    },
                  }}
                >
                  <Avatar
                    src={displayUser.avatar}
                    alt={displayUser.name}
                    sx={{
                      width: 36,
                      height: 36,
                      transition: 'box-shadow 0.2s ease',
                    }}
                  >
                    {!displayUser.avatar && displayUser.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                {/* Profile Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: { width: 220, mt: 1 },
                  }}
                >
                  {[
                    <Box key="header" sx={{ p: 2 }}>
                      <Typography variant="subtitle2">{displayUser.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {displayUser.email}
                      </Typography>
                    </Box>,
                    <Divider key="divider1" />,
                    <MenuItem
                      key="profile"
                      onClick={handleProfileMenuClose}
                      href={paths.profile.root}
                    >
                      <Iconify icon="carbon:user" sx={{ mr: 2 }} />
                      Миний профайл
                    </MenuItem>,
                    <MenuItem
                      key="library"
                      onClick={handleProfileMenuClose}
                      href={paths.profile.library}
                    >
                      <Iconify icon="carbon:book" sx={{ mr: 2 }} />
                      Номын сан
                    </MenuItem>,
                    <MenuItem
                      key="favorites"
                      onClick={handleProfileMenuClose}
                      href={paths.profile.favorites}
                    >
                      <Iconify icon="carbon:favorite" sx={{ mr: 2 }} />
                      Дуртай комикууд
                    </MenuItem>,
                    <MenuItem
                      key="settings"
                      onClick={handleProfileMenuClose}
                      href={paths.profile.settings}
                    >
                      <Iconify icon="carbon:settings" sx={{ mr: 2 }} />
                      Тохиргоо
                    </MenuItem>,
                    ...(displayUser.role === 'admin'
                      ? [
                          <Divider key="divider2" />,
                          <MenuItem
                            key="cms"
                            onClick={handleProfileMenuClose}
                            href={paths.webtoon.cms.dashboard}
                          >
                            <Iconify icon="carbon:dashboard" sx={{ mr: 2 }} />
                            CMS Удирдлага
                          </MenuItem>,
                        ]
                      : []),
                    <Divider key="divider3" />,
                    <MenuItem key="logout" onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <Iconify icon="carbon:logout" sx={{ mr: 2 }} />
                      Гарах
                    </MenuItem>,
                  ]}
                </Menu>

                {/* Notifications Menu */}
                <Menu
                  anchorEl={notificationAnchor}
                  open={Boolean(notificationAnchor)}
                  onClose={handleNotificationClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: { width: 320, mt: 1 },
                  }}
                >
                  {[
                    <Box key="header" sx={{ p: 2 }}>
                      <Typography variant="h6">Мэдэгдэл</Typography>
                    </Box>,
                    <Divider key="divider1" />,
                    <MenuItem key="notif1" onClick={handleNotificationClose}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">
                          &ldquo;Миний дуртай комик&rdquo; шинэ бүлэг нэмэгдлээ
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          2 цагийн өмнө
                        </Typography>
                      </Stack>
                    </MenuItem>,
                    <MenuItem key="notif2" onClick={handleNotificationClose}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">
                          Таны дуртай зохиолч шинэ комик эхлүүллээ
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          1 өдрийн өмнө
                        </Typography>
                      </Stack>
                    </MenuItem>,
                    <MenuItem key="notif3" onClick={handleNotificationClose}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">
                          Долоо хоногийн шилдэг комикууд гарлаа
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          3 өдрийн өмнө
                        </Typography>
                      </Stack>
                    </MenuItem>,
                    <Divider key="divider2" />,
                    <MenuItem
                      key="viewAll"
                      onClick={handleNotificationClose}
                      sx={{ justifyContent: 'center' }}
                    >
                      <Typography variant="body2" color="primary">
                        Бүх мэдэгдлийг үзэх
                      </Typography>
                    </MenuItem>,
                  ]}
                </Menu>
              </>
            ) : (
              /* Login/Register buttons for non-authenticated users */
              <Stack direction="row" spacing={1.5}>
                <Button variant="outlined" size="small" href={paths.loginCover}>
                  Нэвтрэх
                </Button>
                <Button variant="contained" size="small" href={paths.registerCover}>
                  Бүртгүүлэх
                </Button>
              </Stack>
            )}

            {/* Settings - with proper spacing */}
            <Box sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
              <SettingsButton />
            </Box>

            {/* Mobile Navigation */}
            {!mdUp && <NavMobileModern data={navConfig} />}
          </Stack>
        </Container>
      </Toolbar>

      {offset && <HeaderShadow />}
    </AppBar>
  );
}
