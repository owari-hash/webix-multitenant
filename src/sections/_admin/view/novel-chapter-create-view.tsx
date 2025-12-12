'use client';

import { useState, useEffect } from 'react';

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

import NovelChapterCreateForm from '../novel-chapter-create-form';

// ----------------------------------------------------------------------

type Props = {
  novelId: string;
};

export default function NovelChapterCreateView({ novelId }: Props) {
  const theme = useTheme();
  const [novelTitle, setNovelTitle] = useState<string>('');

  useEffect(() => {
    // Fetch novel details to show title
    const fetchNovel = async () => {
      try {
        const response = await fetch(`/api2/novel/${novelId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch novel:', response.status, response.statusText);
          return;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Response is not JSON');
          return;
        }

        const result = await response.json();
        if (result.success && result.novel) {
          setNovelTitle(result.novel.title);
        }
      } catch (error) {
        console.error('Fetch novel error:', error);
      }
    };

    if (novelId) {
      fetchNovel();
    }
  }, [novelId]);

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
                href={paths.webtoon.cms.novels}
                color="inherit"
                sx={{ minWidth: 'auto' }}
              >
                Романууд
              </Button>
              <Button
                component={RouterLink}
                href={paths.webtoon.cms.novelChapters(novelId)}
                color="inherit"
                sx={{ minWidth: 'auto' }}
              >
                Бүлгүүд
              </Button>
              <Typography color="text.primary">Шинэ нэмэх</Typography>
            </Breadcrumbs>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.secondary.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon="carbon:add-filled"
                  sx={{ color: theme.palette.secondary.main, fontSize: 28 }}
                />
              </Box>

              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Шинэ бүлэг нэмэх
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {novelTitle ? `"${novelTitle}" романд бүлэг нэмэх` : 'Романд шинэ бүлэг нэмэх'}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Form Content */}
      <Container sx={{ py: { xs: 3, md: 5 } }}>
        <NovelChapterCreateForm novelId={novelId} novelTitle={novelTitle} />
      </Container>
    </>
  );
}

