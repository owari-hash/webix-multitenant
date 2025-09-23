import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Logo from 'src/components/logo';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.neutral' }}>
      <Divider />

      <Container>
        <Stack
          spacing={3}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 4 }}
        >
          {/* Logo */}
          <Logo />

          {/* Navigation Links */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 3 }}
            alignItems="center"
          >
            <Link
              href={paths.webtoon.browse}
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Жагсаалт
            </Link>

            <Link
              href={paths.webtoon.categories}
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Ангиллууд
            </Link>

            <Link
              href={paths.support}
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Тусламж
            </Link>
          </Stack>

          {/* Copyright */}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © 2024 WebtoonHub. Бүх эрх хуулиар хамгаалагдсан.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
