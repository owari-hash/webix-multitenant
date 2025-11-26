import { useState } from 'react';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            bgcolor: alpha(theme.palette.background.default, 0.9),
            backdropFilter: 'blur(20px)',
            boxShadow: `-8px 0 32px ${alpha(theme.palette.common.black, 0.24)}`,
          },
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Logo />
          <IconButton onClick={handleClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <List disablePadding sx={{ px: 2 }}>
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
                    minHeight: 48,
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

        <Box sx={{ p: 3, mt: 'auto' }}>
          <ListItemButton
            component="a"
            href={paths.zoneStore}
            target="_blank"
            rel="noopener"
            sx={{
              borderRadius: 1.5,
              typography: 'subtitle2',
              color: 'common.white',
              bgcolor: 'primary.main',
              justifyContent: 'center',
              py: 1.5,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Buy Now
          </ListItemButton>
        </Box>
      </Drawer>
    </>
  );
}
