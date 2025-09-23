import { memo } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

interface LogoProps extends BoxProps {
  single?: boolean;
}

function Logo({ single = false, sx }: LogoProps) {
  const logoSrc = single
    ? '/favicon/android-chrome-192x192.png'
    : '/favicon/android-chrome-512x512.png';

  const logoSize = single ? 96 : 96;

  return (
    <Link
      component={RouterLink}
      href="/"
      color="inherit"
      aria-label="go to homepage"
      sx={{ lineHeight: 0 }}
    >
      <Box
        sx={{
          width: logoSize,
          height: logoSize,
          lineHeight: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...sx,
        }}
      >
        <Box
          component="img"
          src={logoSrc}
          alt="WebtoonHub Logo"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: 1,
          }}
        />
      </Box>
    </Link>
  );
}

export default memo(Logo);
