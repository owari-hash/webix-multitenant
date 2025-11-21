import { alpha, styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

import { NavItemProps } from '../types';

// ----------------------------------------------------------------------

type StyledNavItemProps = Omit<NavItemProps, 'item'>;

export const StyledNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<StyledNavItemProps>(({ active, theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  height: 48,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  // Active
  ...(active && {
    color: theme.palette.primary.main,
    ...theme.typography.subtitle2,
    backgroundColor: alpha(theme.palette.primary.main, 0.16),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.24),
    },
  }),
}));
