import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { usePathname } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
//
import { NavProps } from '../types';
import { NAV } from '../../../config-layout';
import NavList from './nav-list';

// ----------------------------------------------------------------------

export default function NavMobile({ data }: NavProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const mobileOpen = useBoolean();

  useEffect(() => {
    if (mobileOpen.value) {
      mobileOpen.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <IconButton
        onClick={mobileOpen.onTrue}
        sx={{
          ml: 1,
          color: 'inherit',
          transition: theme.transitions.create('transform'),
          '&:hover': { transform: 'scale(1.1)' },
        }}
      >
        <Iconify icon="carbon:menu" width={24} />
      </IconButton>

      <Drawer
        open={mobileOpen.value}
        onClose={mobileOpen.onFalse}
        PaperProps={{
          sx: {
            pb: 5,
            width: NAV.W_VERTICAL,
            bgcolor: alpha(theme.palette.background.default, 0.9),
            backdropFilter: 'blur(20px)',
            boxShadow: `-8px 0 32px ${alpha(theme.palette.common.black, 0.24)}`,
          },
        }}
      >
        <Scrollbar>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 3 }}>
            <Logo />
            <IconButton onClick={mobileOpen.onFalse}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Box>

          <List component="nav" disablePadding>
            {data.map((link) => (
              <NavList key={link.title} item={link} />
            ))}
          </List>

          <Stack spacing={1.5} sx={{ p: 3, mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              href={paths.zoneStore}
              target="_blank"
              rel="noopener"
              sx={{
                boxShadow: `0 8px 16px 0 ${alpha(theme.palette.primary.main, 0.24)}`,
              }}
            >
              Buy Now
            </Button>
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}

