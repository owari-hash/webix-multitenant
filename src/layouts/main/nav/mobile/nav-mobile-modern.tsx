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
          '&:hover': {
            color: 'text.primary',
          },
        }}
      >
        <Iconify icon="carbon:menu" />
      </IconButton>

      <Drawer
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'background.default',
          },
        }}
      >
        <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
          <Logo />
        </Box>

        <List disablePadding sx={{ px: 2 }}>
          {data.map((item) => {
            const isActive =
              pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

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
      </Drawer>
    </>
  );
}
