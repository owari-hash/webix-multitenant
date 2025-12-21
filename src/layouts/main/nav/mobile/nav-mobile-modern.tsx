import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { getUser, isAuthenticated, logout } from 'src/utils/auth';
import NotificationsPopover from '../../../common/notifications-popover';

// ----------------------------------------------------------------------

type NavItem = {
  title: string;
  path: string;
};

type Props = {
  data: NavItem[];
};

export default function NavMobileModern({ data }: Props) {
  const theme = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
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
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  const displayUser = user || {
    name: 'Хэрэглэгч',
    email: '',
    avatar: null,
    role: 'user',
    premium: false,
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          ml: 1,
          color: 'text.secondary',
          transition: theme.transitions.create(['color', 'transform', 'background-color']),
          zIndex: 10,
          '&:hover': {
            color: 'text.primary',
            transform: 'scale(1.1)',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        <Iconify icon="carbon:menu" width={24} />
      </IconButton>

      <Drawer
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 280,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: alpha(theme.palette.background.default, 0.9),
            backdropFilter: 'blur(20px)',
            boxShadow: `-8px 0 32px ${alpha(theme.palette.common.black, 0.24)}`,
          },
        }}
      >
        <Scrollbar sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              px: 2.5,
              py: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Logo />
            <IconButton onClick={handleClose} size="small">
              <Iconify icon="mingcute:close-line" width={24} />
            </IconButton>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}
          >
            <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              href={paths.webtoon.search}
              onClick={handleClose}
              startIcon={<Iconify icon="carbon:search" width={20} />}
              sx={{
                justifyContent: 'flex-start',
                py: 1.25,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.grey[500], 0.08),
                borderColor: alpha(theme.palette.grey[500], 0.2),
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: alpha(theme.palette.grey[500], 0.12),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: 'text.primary',
                },
              }}
            >
              Хайх...
            </Button>
          </Box>

          {/* User Profile Section (if authenticated) */}
          {authenticated && user && (
            <>
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={displayUser.avatar}
                    alt={displayUser.name}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {!displayUser.avatar && displayUser.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                      <Typography
                        variant="subtitle2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {displayUser.name || 'Хэрэглэгч'}
                      </Typography>
                      {displayUser.premium ? (
                        <Chip
                          icon={<Iconify icon="solar:crown-bold" width={14} />}
                          label="Premium"
                          color="warning"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: 'warning.main',
                            color: 'warning.contrastText',
                            '& .MuiChip-icon': {
                              color: 'warning.contrastText',
                            },
                          }}
                        />
                      ) : (
                        <Chip
                          label="Энгийн"
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayUser.email}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Quick Actions */}
              <Box sx={{ px: 2.5, py: 2 }}>
                <Stack direction="row" spacing={1} justifyContent="space-around">
                  <Button
                    component={RouterLink}
                    href={paths.profile.favorites}
                    onClick={handleClose}
                    startIcon={<Iconify icon="carbon:favorite" />}
                    sx={{
                      flex: 1,
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.lighter',
                      },
                    }}
                  >
                    Дуртай
                  </Button>
                  <Button
                    component={RouterLink}
                    href={paths.profile.history}
                    onClick={handleClose}
                    startIcon={<Iconify icon="carbon:time" />}
                    sx={{
                      flex: 1,
                      color: 'info.main',
                      '&:hover': {
                        bgcolor: 'info.lighter',
                      },
                    }}
                  >
                    Түүх
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationsPopover />
                  </Box>
                </Stack>
              </Box>
            </>
          )}

          {/* Main Navigation */}
          <Box sx={{ px: 1.5, py: 1 }}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 1,
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Цэс
            </Typography>
            <List disablePadding>
              {data.map((item) => {
                const isActive =
                  pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));

                return (
                  <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink}
                      href={item.path}
                      onClick={handleClose}
                      sx={{
                        borderRadius: 1.5,
                        typography: 'body2',
                        fontWeight: 'fontWeightMedium',
                        color: 'text.secondary',
                        minHeight: 44,
                        px: 2,
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                        ...(isActive && {
                          color: 'primary.main',
                          backgroundColor: alpha(theme.palette.primary.main, 0.12),
                          fontWeight: 'fontWeightSemiBold',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.16),
                          },
                        }),
                      }}
                    >
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          typography: 'body2',
                          fontWeight: isActive ? 'fontWeightSemiBold' : 'fontWeightMedium',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* User Menu Section (if authenticated) */}
          {authenticated && user && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 1.5, py: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Хувийн мэдээлэл
                </Typography>
                <List disablePadding>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink}
                      href={paths.profile.root}
                      onClick={handleClose}
                      sx={{
                        borderRadius: 1.5,
                        minHeight: 44,
                        px: 2,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Iconify icon="carbon:user" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Миний профайл"
                        primaryTypographyProps={{ typography: 'body2' }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink}
                      href={paths.profile.library}
                      onClick={handleClose}
                      sx={{
                        borderRadius: 1.5,
                        minHeight: 44,
                        px: 2,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Iconify icon="carbon:book" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Номын сан"
                        primaryTypographyProps={{ typography: 'body2' }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink}
                      href={paths.feedback.root}
                      onClick={handleClose}
                      sx={{
                        borderRadius: 1.5,
                        minHeight: 44,
                        px: 2,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Iconify icon="carbon:chat" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Санал хүсэл гомдол"
                        primaryTypographyProps={{ typography: 'body2' }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink}
                      href={paths.webtoon.premium}
                      onClick={handleClose}
                      sx={{
                        borderRadius: 1.5,
                        minHeight: 44,
                        px: 2,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Iconify icon="carbon:wallet" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Төлбөр тооцоо"
                        primaryTypographyProps={{ typography: 'body2' }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink}
                      href={paths.profile.settings}
                      onClick={handleClose}
                      sx={{
                        borderRadius: 1.5,
                        minHeight: 44,
                        px: 2,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Iconify icon="carbon:settings" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Тохиргоо"
                        primaryTypographyProps={{ typography: 'body2' }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {displayUser.role === 'admin' && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          py: 1,
                          color: 'text.secondary',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Удирдлага
                      </Typography>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                          component={RouterLink}
                          href={paths.webtoon.cms.dashboard}
                          onClick={handleClose}
                          sx={{
                            borderRadius: 1.5,
                            minHeight: 44,
                            px: 2,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Iconify icon="carbon:dashboard" width={20} />
                          </ListItemIcon>
                          <ListItemText
                            primary="CMS Удирдлага"
                            primaryTypographyProps={{ typography: 'body2' }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </>
          )}

          {/* Premium Upgrade Button (if not premium) */}
          {authenticated && user && !displayUser.premium && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2.5, py: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  startIcon={<Iconify icon="solar:crown-bold" />}
                  component={RouterLink}
                  href={paths.webtoon.premium}
                  onClick={handleClose}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    boxShadow: `0 4px 14px ${alpha(theme.palette.warning.main, 0.3)}`,
                    '&:hover': {
                      boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.4)}`,
                    },
                  }}
                >
                  Premium эрх авах
                </Button>
              </Box>
            </>
          )}

          {/* Footer Actions */}
          <Box sx={{ mt: 'auto', p: 2.5, pt: 2 }}>
            {authenticated ? (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="carbon:logout" />}
                onClick={handleLogout}
                sx={{
                  py: 1.25,
                  borderRadius: 2,
                }}
              >
                Гарах
              </Button>
            ) : (
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  component={RouterLink}
                  href={paths.loginCover}
                  onClick={handleClose}
                  sx={{
                    py: 1.25,
                    borderRadius: 2,
                  }}
                >
                  Нэвтрэх
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  component={RouterLink}
                  href={paths.registerCover}
                  onClick={handleClose}
                  sx={{
                    py: 1.25,
                    borderRadius: 2,
                    fontWeight: 700,
                  }}
                >
                  Бүртгүүлэх
                </Button>
              </Stack>
            )}
          </Box>
        </Scrollbar>
      </Drawer>
    </>
  );
}
