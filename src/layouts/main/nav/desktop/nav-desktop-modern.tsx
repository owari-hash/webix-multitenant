import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledNavItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  ...theme.typography.subtitle2,
  padding: theme.spacing(1, 2),
  color: theme.palette.text.secondary, // Default color - will be overridden by header CSS
  borderRadius: theme.spacing(1),
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  transition: theme.transitions.create(['color', 'background-color'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  ...(active && {
    color: theme.palette.primary.main, // Default active color - will be overridden by header CSS
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    fontWeight: theme.typography.fontWeightSemiBold,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
  }),
}));

// ----------------------------------------------------------------------

type NavItem = {
  title: string;
  path: string;
};

type Props = {
  data: NavItem[];
  sx?: object;
};

export default function NavDesktopModern({ data, sx }: Props) {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      sx={{
        ...sx,
      }}
    >
      <Stack direction="row" spacing={{ md: 1, lg: 3 }}>
        {data.map((link) => {
          const isActive =
            pathname === link.path || (link.path !== '/' && pathname?.startsWith(link.path));

          return (
            <NextLink key={link.title} href={link.path} passHref>
              <StyledNavItem component="a" active={isActive} data-active={isActive}>
                {link.title}
              </StyledNavItem>
            </NextLink>
          );
        })}
      </Stack>
    </Box>
  );
}
