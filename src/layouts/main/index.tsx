'use client';

import Box from '@mui/material/Box';

import { usePathname } from 'src/routes/hooks';

import { HEADER } from '../config-layout';

import Footer from './footer';
import Header from './header';
import HeaderWebtoon from './header-webtoon';

// ----------------------------------------------------------------------

const pathsOnDark = ['/career', '/career/', '/travel', '/travel/'];

const spacingLayout = [
  ...pathsOnDark,
  '/',
  '/e-learning',
  '/e-learning/',
  '/marketing',
  '/marketing/',
];

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  const pathname = usePathname();

  const actionPage = (arr: string[]) => arr.some((path) => pathname === path);

  // Use webtoon header for webtoon-related pages
  const isWebtoonPage =
    pathname.startsWith('/webtoon') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/cms') ||
    pathname === '/';

  // Homepage has dark hero background, so header should be on dark
  const isHomePage = pathname === '/';

  // Show spacing for all webtoon pages except homepage (hero section)
  const showSpacing = isWebtoonPage ? !isHomePage : !actionPage(spacingLayout);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      {isWebtoonPage ? (
        <HeaderWebtoon headerOnDark={isHomePage || actionPage(pathsOnDark)} />
      ) : (
        <Header headerOnDark={actionPage(pathsOnDark)} />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        {showSpacing && <Spacing />}

        {children}
      </Box>

      <Footer />
    </Box>
  );
}

// ----------------------------------------------------------------------

function Spacing() {
  return (
    <Box
      sx={{
        height: { xs: HEADER.H_MOBILE, md: HEADER.H_DESKTOP },
        flexShrink: 0,
      }}
    />
  );
}
