'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import {
  Feedback,
  FeedbackPriority,
  FeedbackStatus,
  FeedbackType,
  feedbackApi,
} from 'src/utils/feedback-api';

// ----------------------------------------------------------------------

type Props = {
  showCreateButton?: boolean;
  adminView?: boolean;
};

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

export default function FeedbackList({ showCreateButton = true, adminView = false }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const response = adminView
        ? await feedbackApi.getAllFeedback({ limit: 50, sort: 'createdAt', order: 'desc' })
        : await feedbackApi.getMyFeedback({ limit: 50 });
      setFeedbacks(response.feedbacks);
    } catch (error: any) {
      console.error('Load feedbacks error:', error);
      enqueueSnackbar(error?.message || 'Санал хүсэл гомдол ачаалахад алдаа гарлаа', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography color="text.secondary">Ачааллаж байна...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {showCreateButton && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Миний санал хүсэл гомдол</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.feedback.create)}
          >
            Шинэ санал хүсэл гомдол
          </Button>
        </Box>
      )}

      {feedbacks.length === 0 ? (
        <Card sx={{ p: 5, textAlign: 'center' }}>
          <Iconify icon="mdi:inbox-outline" width={64} sx={{ color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Санал хүсэл гомдол байхгүй
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {showCreateButton
              ? 'Таны илгээсэн санал хүсэл гомдол энд харагдана'
              : 'Санал хүсэл гомдол олдсонгүй'}
          </Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {feedbacks.map((feedback) => (
            <Card
              key={feedback._id}
              sx={{
                p: 3,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: theme.customShadows.z16,
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => router.push(paths.feedback.detail(feedback._id))}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                      }}
                    >
                      {feedback.user_name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {feedback.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {feedback.user_name} • {formatDate(feedback.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={feedback.type}
                      color={TYPE_COLORS[feedback.type] as any}
                      size="small"
                    />
                    <Chip
                      label={getStatusLabel(feedback.status)}
                      color={STATUS_COLORS[feedback.status] as any}
                      size="small"
                    />
                  </Stack>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {feedback.content}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={getPriorityLabel(feedback.priority)}
                    color={PRIORITY_COLORS[feedback.priority] as any}
                    size="small"
                    variant="outlined"
                  />
                  {feedback.response && (
                    <Chip
                      icon={<Iconify icon="mdi:check-circle" width={16} />}
                      label="Хариу өгсөн"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {feedback.views && feedback.views > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      <Iconify icon="solar:eye-bold" width={14} sx={{ verticalAlign: 'middle' }} />{' '}
                      {feedback.views}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

