'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

import ComicCreateForm from '../comic-create-form';

// ----------------------------------------------------------------------

export default function ComicCreateView() {
  const theme = useTheme();

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          py: { xs: 3, md: 5 },
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        }}
      >
        <Container>
          <Stack spacing={2}>
            <Breadcrumbs
              separator={<Iconify icon="carbon:chevron-right" width={16} />}
              sx={{ color: 'text.secondary' }}
            >
              <Button
                component={RouterLink}
                href={paths.webtoon.cms.dashboard}
                color="inherit"
                startIcon={<Iconify icon="carbon:dashboard" />}
                sx={{ minWidth: 'auto' }}
              >
                Хяналтын самбар
              </Button>
              <Button
                component={RouterLink}
                href={paths.webtoon.cms.comics}
                color="inherit"
                sx={{ minWidth: 'auto' }}
              >
                Комикууд
              </Button>
              <Typography color="text.primary">Шинэ нэмэх</Typography>
            </Breadcrumbs>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon="carbon:add-filled"
                  sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                />
              </Box>

              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Шинэ веб комик нэмэх
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Платформд шинэ веб комик нэмж, уншигчидтай хуваалцаарай
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Form Content */}
      <Container sx={{ py: { xs: 3, md: 5 } }}>
        <ComicCreateForm />
      </Container>
    </>
  );
}

