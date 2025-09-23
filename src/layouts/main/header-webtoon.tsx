import { useState } from 'react';

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
import { useTheme } from '@mui/material/styles';
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

// Mock user data - in real app this would come from auth context
const mockUser = {
  id: '1',
  name: 'Батбаяр',
  email: 'batbayar@example.com',
  avatar: '/assets/images/avatar/avatar_1.jpg',
  role: 'user', // 'user', 'creator', 'admin'
  isAuthenticated: true,
};

export default function HeaderWebtoon({ headerOnDark }: Props) {
  const theme = useTheme();
  const offset = useOffSetTop();
  const mdUp = useResponsive('up', 'md');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

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

  const handleLogout = () => {
    // Handle logout logic
    handleProfileMenuClose();
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
          }),
          ...(offset && {
            ...bgBlur({ color: theme.palette.background.default }),
            color: 'text.primary',
            height: {
              md: HEADER.H_DESKTOP - 16,
            },
          }),
        }}
      >
        <Container
          sx={{ height: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Logo */}
          <Box sx={{ lineHeight: 0, position: 'relative' }}>
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

            {mockUser.isAuthenticated ? (
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

                  {/* CMS Access for creators/admins */}
                  {(mockUser.role === 'creator' || mockUser.role === 'admin') && (
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
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    sx={{
                      width: 36,
                      height: 36,
                      transition: 'box-shadow 0.2s ease',
                    }}
                  />
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
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2">{mockUser.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mockUser.email}
                    </Typography>
                  </Box>

                  <Divider />

                  <MenuItem onClick={handleProfileMenuClose} href={paths.profile.root}>
                    <Iconify icon="carbon:user" sx={{ mr: 2 }} />
                    Миний профайл
                  </MenuItem>

                  <MenuItem onClick={handleProfileMenuClose} href={paths.profile.library}>
                    <Iconify icon="carbon:book" sx={{ mr: 2 }} />
                    Номын сан
                  </MenuItem>

                  <MenuItem onClick={handleProfileMenuClose} href={paths.profile.favorites}>
                    <Iconify icon="carbon:favorite" sx={{ mr: 2 }} />
                    Дуртай комикууд
                  </MenuItem>

                  <MenuItem onClick={handleProfileMenuClose} href={paths.profile.settings}>
                    <Iconify icon="carbon:settings" sx={{ mr: 2 }} />
                    Тохиргоо
                  </MenuItem>

                  {(mockUser.role === 'creator' || mockUser.role === 'admin') && (
                    <>
                      <Divider />
                      <MenuItem onClick={handleProfileMenuClose} href={paths.webtoon.cms.dashboard}>
                        <Iconify icon="carbon:dashboard" sx={{ mr: 2 }} />
                        CMS Удирдлага
                      </MenuItem>
                    </>
                  )}

                  <Divider />

                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <Iconify icon="carbon:logout" sx={{ mr: 2 }} />
                    Гарах
                  </MenuItem>
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
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Мэдэгдэл</Typography>
                  </Box>

                  <Divider />

                  <MenuItem onClick={handleNotificationClose}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">
                        &ldquo;Миний дуртай комик&rdquo; шинэ бүлэг нэмэгдлээ
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 цагийн өмнө
                      </Typography>
                    </Stack>
                  </MenuItem>

                  <MenuItem onClick={handleNotificationClose}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">
                        Таны дуртай зохиолч шинэ комик эхлүүллээ
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        1 өдрийн өмнө
                      </Typography>
                    </Stack>
                  </MenuItem>

                  <MenuItem onClick={handleNotificationClose}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">
                        Долоо хоногийн шилдэг комикууд гарлаа
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        3 өдрийн өмнө
                      </Typography>
                    </Stack>
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center' }}>
                    <Typography variant="body2" color="primary">
                      Бүх мэдэгдлийг үзэх
                    </Typography>
                  </MenuItem>
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
            <Box sx={{ ml: 1 }}>
              <SettingsButton />
            </Box>
          </Stack>

          {/* Mobile Navigation */}
          {!mdUp && <NavMobileModern data={navConfig} />}
        </Container>
      </Toolbar>

      {offset && <HeaderShadow />}
    </AppBar>
  );
}
