import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

type Props = {
  data: any[];
};

export default function HomeWebtoonFinished({ data }: Props) {
  const theme = useTheme();
  const router = useRouter();

  // Filter completed/finished comics
  const finishedComics = data.filter(
    (comic) => comic.status === 'completed' || comic.status === 'finished'
  );

  if (finishedComics.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        background: `linear-gradient(180deg,
          ${alpha(theme.palette.grey[900], 0.95)} 0%,
          ${theme.palette.grey[800]} 50%,
          ${theme.palette.grey[900]} 100%)`,
        py: { xs: 5, md: 8 },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at top,
            ${alpha(theme.palette.secondary.main, 0.08)} 0%,
            transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Iconify
              icon="solar:fire-bold"
              sx={{
                fontSize: { xs: 24, md: 32 },
                color: '#FF5252',
              }}
            />
            <Typography
              variant="h3"
              sx={{
                color: 'common.white',
                fontWeight: 800,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Гарч Дууссан Номнууд
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              overflowY: 'hidden',
              pb: 2,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: alpha(theme.palette.common.black, 0.2),
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha(theme.palette.primary.main, 0.5),
                borderRadius: 4,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.7),
                },
              },
            }}
          >
            {finishedComics.map((comic, index) => (
              <Card
                key={comic._id || comic.id || index}
                sx={{
                  width: { xs: 140, sm: 160, md: 180 },
                  flexShrink: 0,
                  cursor: 'pointer',
                  bgcolor: alpha(theme.palette.common.white, 0.05),
                  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                }}
                onClick={() => router.push(paths.webtoon.comic(comic._id || comic.id))}
              >
                <Box sx={{ position: 'relative' }}>
                  <Image
                    alt={comic.title || 'Comic cover'}
                    src={comic.coverImage || comic.coverUrl || '/assets/placeholder.jpg'}
                    ratio="3/4"
                    sx={{
                      borderRadius: '8px 8px 0 0',
                    }}
                  />

                  {(comic.publisher === 'MANGA.MN' || comic.source?.includes('manga')) && (
                    <Chip
                      label="MANGA.MN"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: '#FF5252',
                        color: 'common.white',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 20,
                        px: 0.5,
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ p: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'common.white',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      lineHeight: 1.3,
                      minHeight: { xs: 36, md: 40 },
                    }}
                  >
                    {comic.title}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
