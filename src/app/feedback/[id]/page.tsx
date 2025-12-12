'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { Feedback, feedbackApi, FeedbackType, FeedbackStatus } from 'src/utils/feedback-api';

// ----------------------------------------------------------------------

const TYPE_COLORS: Record<FeedbackType, string> = {
  санал: 'info',
  хүсэл: 'warning',
  гомдол: 'error',
};

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  pending: 'warning',
  in_progress: 'info',
  resolved: 'success',
  closed: 'default',
};

export default function FeedbackDetailPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);

  const feedbackId = params?.id as string;

  const loadFeedback = async () => {
    if (!feedbackId) return;

    try {
      setLoading(true);
      const data = await feedbackApi.getFeedbackById(feedbackId);
      setFeedback(data);
    } catch (error: any) {
      console.error('Load feedback error:', error);
      enqueueSnackbar(error?.message || 'Санал хүсэл гомдол ачаалахад алдаа гарлаа', {
        variant: 'error',
      });
      router.push(paths.feedback.root);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (feedbackId) {
      loadFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackId]);

  const getStatusLabel = (status: FeedbackStatus) => {
    if (status === 'pending') return 'Хүлээгдэж буй';
    if (status === 'in_progress') return 'Хийгдэж буй';
    if (status === 'resolved') return 'Шийдэгдсэн';
    return 'Хаагдсан';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container
        sx={{
          overflow: 'hidden',
          minHeight: 1,
          pt: { xs: 13, md: 16 },
          pb: { xs: 10, md: 15 },
        }}
      >
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography color="text.secondary">Ачааллаж байна...</Typography>
        </Box>
      </Container>
    );
  }

  if (!feedback) {
    return null;
  }

  return (
    <Container
      sx={{
        overflow: 'hidden',
        minHeight: 1,
        pt: { xs: 13, md: 16 },
        pb: { xs: 10, md: 15 },
      }}
    >
      <Stack spacing={3}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:arrow-left" />}
          onClick={() => router.back()}
          sx={{ alignSelf: 'flex-start' }}
        >
          Буцах
        </Button>

        <Card sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                  }}
                >
                  {feedback.user_name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {feedback.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" color="text.secondary">
                      {feedback.user_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(feedback.createdAt)}
                    </Typography>
                    {feedback.views && feedback.views > 0 && (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <Iconify
                            icon="solar:eye-bold"
                            width={16}
                            sx={{ verticalAlign: 'middle', mr: 0.5 }}
                          />
                          {feedback.views}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={feedback.type}
                  color={TYPE_COLORS[feedback.type] as any}
                  size="medium"
                />
                <Chip
                  label={getStatusLabel(feedback.status)}
                  color={STATUS_COLORS[feedback.status] as any}
                  size="medium"
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Агуулга
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {feedback.content}
              </Typography>
            </Box>

            {feedback.tags && feedback.tags.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Шошго
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {feedback.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Box>
            )}

            {feedback.response && (
              <>
                <Divider />
                <Box
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="mdi:check-circle" width={24} sx={{ color: 'success.main' }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Хариу
                      </Typography>
                      {feedback.responded_at && (
                        <Typography variant="caption" color="text.secondary">
                          • {formatDate(feedback.responded_at)}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {feedback.response}
                    </Typography>
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
