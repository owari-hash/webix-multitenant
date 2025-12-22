import React from 'react';
import { useRouter } from 'next/navigation';
import Slide from '@mui/material/Slide';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Theme, alpha, styled, SxProps } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';

import { HEADER } from '../config-layout';

// ----------------------------------------------------------------------

const StyledSearchbar = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER.H_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
  [theme.breakpoints.up('md')]: {
    height: HEADER.H_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

type SearchbarProps = {
  sx?: SxProps<Theme>;
};

export default function Searchbar({ sx }: SearchbarProps) {
  const router = useRouter();
  const searchOpen = useBoolean();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`${paths.webtoon.search}?q=${encodeURIComponent(searchQuery.trim())}`);
      searchOpen.onFalse();
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <ClickAwayListener onClickAway={searchOpen.onFalse}>
      <div>
        <IconButton color="inherit" aria-label="search" onClick={searchOpen.onTrue} sx={sx}>
          <Iconify icon="carbon:search" />
        </IconButton>

        <Slide direction="down" in={searchOpen.value} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Комик, зохиол, бүлэг хайх..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="carbon:search" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />
            <Button variant="contained" onClick={handleSearch}>
              Хайх
            </Button>
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
