'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { Feedback, feedbackApi, FeedbackStatus, FeedbackPriority } from 'src/utils/feedback-api';

// ----------------------------------------------------------------------

type Props = {
  feedbackId: string;
};

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  pending: 'warning',
  in_progress: 'info',
  resolved: 'success',
  closed: 'default',
};

const PRIORITY_COLORS: Record<FeedbackPriority, string> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'error',
};

const getStatusLabel = (status: FeedbackStatus) => {
  if (status === 'pending') return 'Хүлээгдэж буй';
  if (status === 'in_progress') return 'Хийгдэж буй';
  if (status === 'resolved') return 'Шийдэгдсэн';
  return 'Хаагдсан';
};

const getPriorityLabel = (priority: FeedbackPriority) => {
  if (priority === 'low') return 'Бага';
  if (priority === 'medium') return 'Дунд';
  if (priority === 'high') return 'Өндөр';
  return 'Яаралтай';
};

export default function FeedbackDetailView({ feedbackId }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const data = await feedbackApi.getFeedbackById(feedbackId);
      setFeedback(data);
      setResponseText(data.response || '');
    } catch (error: any) {
      console.error('Load feedback error:', error);
      enqueueSnackbar(error?.message || 'Санал хүсэл гомдол ачаалахад алдаа гарлаа', {
        variant: 'error',
      });
      router.push(paths.webtoon.cms.feedback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackId]);

  const handleSubmitResponse = async () => {
    if (!feedback || !responseText.trim()) {
      enqueueSnackbar('Хариу бичих шаардлагатай', { variant: 'warning' });
      return;
    }

    try {
      setSubmitting(true);
      await feedbackApi.respondToFeedback(feedback._id, responseText.trim(), 'resolved');
      enqueueSnackbar('Хариу амжилттай илгээгдлээ', { variant: 'success' });
      loadFeedback();
    } catch (error: any) {
      console.error('Respond to feedback error:', error);
      enqueueSnackbar(error?.message || 'Хариу илгээхэд алдаа гарлаа', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (status: FeedbackStatus) => {
    if (!feedback) return;

    try {
      await feedbackApi.updateFeedbackStatus(feedback._id, status);
      enqueueSnackbar('Төлөв амжилттай шинэчлэгдлээ', { variant: 'success' });
      loadFeedback();
    } catch (error: any) {
      console.error('Update status error:', error);
      enqueueSnackbar(error?.message || 'Төлөв шинэчлэхэд алдаа гарлаа', { variant: 'error' });
    }
  };

  const handleUpdatePriority = async (priority: FeedbackPriority) => {
    if (!feedback) return;

    try {
      await feedbackApi.updateFeedbackStatus(feedback._id, undefined, priority);
      enqueueSnackbar('Анхаарал амжилттай шинэчлэгдлээ', { variant: 'success' });
      loadFeedback();
    } catch (error: any) {
      console.error('Update priority error:', error);
      enqueueSnackbar(error?.message || 'Анхаарал шинэчлэхэд алдаа гарлаа', { variant: 'error' });
    }
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
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
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
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={3}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:arrow-left" />}
          onClick={() => router.push(paths.webtoon.cms.feedback)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Буцах
        </Button>

        <Card sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
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
                      {feedback.user_email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(feedback.createdAt)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={feedback.type} color="info" size="medium" />
                <Chip
                  label={getStatusLabel(feedback.status)}
                  color={STATUS_COLORS[feedback.status] as any}
                  size="medium"
                />
                <Chip
                  label={getPriorityLabel(feedback.priority)}
                  color={PRIORITY_COLORS[feedback.priority] as any}
                  size="medium"
                  variant="outlined"
                />
              </Stack>
            </Stack>

            <Divider />

            {/* Content */}
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

            {/* Tags */}
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

            {/* Status and Priority Controls */}
            <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Төлөв удирдлага</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <TextField
                    select
                    label="Төлөв"
                    value={feedback.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as FeedbackStatus)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="pending">Хүлээгдэж буй</MenuItem>
                    <MenuItem value="in_progress">Хийгдэж буй</MenuItem>
                    <MenuItem value="resolved">Шийдэгдсэн</MenuItem>
                    <MenuItem value="closed">Хаагдсан</MenuItem>
                  </TextField>

                  <TextField
                    select
                    label="Анхаарал"
                    value={feedback.priority}
                    onChange={(e) => handleUpdatePriority(e.target.value as FeedbackPriority)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="low">Бага</MenuItem>
                    <MenuItem value="medium">Дунд</MenuItem>
                    <MenuItem value="high">Өндөр</MenuItem>
                    <MenuItem value="urgent">Яаралтай</MenuItem>
                  </TextField>
                </Stack>
              </Stack>
            </Card>

            {/* Response Section */}
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Хариу өгөх
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Хариу бичнэ үү..."
                sx={{ mt: 2 }}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <LoadingButton
                  variant="contained"
                  onClick={handleSubmitResponse}
                  loading={submitting}
                  startIcon={<Iconify icon="carbon:send" />}
                >
                  Хариу илгээх
                </LoadingButton>
              </Stack>
            </Box>

            {/* Existing Response */}
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
