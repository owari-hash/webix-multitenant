'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
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

export default function FeedbackManagementView() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<FeedbackType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<FeedbackPriority | 'all'>('all');

  const loadFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await feedbackApi.getAllFeedback({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        sort: 'createdAt',
        order: 'desc',
      });
      setFeedbacks(response.feedbacks);
      setTotal(response.total);
    } catch (error: any) {
      console.error('Load feedbacks error:', error);
      enqueueSnackbar(error?.message || 'Санал хүсэл гомдол ачаалахад алдаа гарлаа', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, typeFilter, priorityFilter, enqueueSnackbar]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenResponseDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.response || '');
    setResponseDialogOpen(true);
  };

  const handleCloseResponseDialog = () => {
    setResponseDialogOpen(false);
    setSelectedFeedback(null);
    setResponseText('');
  };

  const handleSubmitResponse = async () => {
    if (!selectedFeedback || !responseText.trim()) {
      enqueueSnackbar('Хариу бичих шаардлагатай', { variant: 'warning' });
      return;
    }

    try {
      await feedbackApi.respondToFeedback(selectedFeedback._id, responseText.trim(), 'resolved');
      enqueueSnackbar('Хариу амжилттай илгээгдлээ', { variant: 'success' });
      handleCloseResponseDialog();
      loadFeedbacks();
    } catch (error: any) {
      console.error('Respond to feedback error:', error);
      enqueueSnackbar(error?.message || 'Хариу илгээхэд алдаа гарлаа', { variant: 'error' });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateStatus = async (id: string, status: FeedbackStatus) => {
    try {
      await feedbackApi.updateFeedbackStatus(id, status);
      enqueueSnackbar('Төлөв амжилттай шинэчлэгдлээ', { variant: 'success' });
      loadFeedbacks();
    } catch (error: any) {
      console.error('Update status error:', error);
      enqueueSnackbar(error?.message || 'Төлөв шинэчлэхэд алдаа гарлаа', { variant: 'error' });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdatePriority = async (id: string, priority: FeedbackPriority) => {
    try {
      await feedbackApi.updateFeedbackStatus(id, undefined, priority);
      enqueueSnackbar('Анхаарал амжилттай шинэчлэгдлээ', { variant: 'success' });
      loadFeedbacks();
    } catch (error: any) {
      console.error('Update priority error:', error);
      enqueueSnackbar(error?.message || 'Анхаарал шинэчлэхэд алдаа гарлаа', { variant: 'error' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={4}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          spacing={2}
        >
          <Typography variant="h3">Санал хүсэл гомдол удирдлага</Typography>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:arrow-left" />}
            onClick={() => router.push(paths.webtoon.cms.dashboard)}
          >
            Буцах
          </Button>
        </Stack>

        {/* Filters */}
        <Card sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              select
              label="Төлөв"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FeedbackStatus | 'all')}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">Бүгд</MenuItem>
              <MenuItem value="pending">Хүлээгдэж буй</MenuItem>
              <MenuItem value="in_progress">Хийгдэж буй</MenuItem>
              <MenuItem value="resolved">Шийдэгдсэн</MenuItem>
              <MenuItem value="closed">Хаагдсан</MenuItem>
            </TextField>

            <TextField
              select
              label="Төрөл"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as FeedbackType | 'all')}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">Бүгд</MenuItem>
              <MenuItem value="санал">Санал</MenuItem>
              <MenuItem value="хүсэл">Хүсэл</MenuItem>
              <MenuItem value="гомдол">Гомдол</MenuItem>
            </TextField>

            <TextField
              select
              label="Анхаарал"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as FeedbackPriority | 'all')}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">Бүгд</MenuItem>
              <MenuItem value="low">Бага</MenuItem>
              <MenuItem value="medium">Дунд</MenuItem>
              <MenuItem value="high">Өндөр</MenuItem>
              <MenuItem value="urgent">Яаралтай</MenuItem>
            </TextField>
          </Stack>
        </Card>

        {/* Feedback Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Хэрэглэгч</TableCell>
                  <TableCell>Гарчиг</TableCell>
                  <TableCell>Төрөл</TableCell>
                  <TableCell>Төлөв</TableCell>
                  <TableCell>Анхаарал</TableCell>
                  <TableCell>Огноо</TableCell>
                  <TableCell align="right">Үйлдэл</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">Ачааллаж байна...</Typography>
                    </TableCell>
                  </TableRow>
                ) : feedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">Санал хүсэл гомдол олдсонгүй</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  feedbacks.map((feedback) => (
                    <TableRow key={feedback._id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              color: theme.palette.primary.main,
                            }}
                          >
                            {feedback.user_name?.[0]?.toUpperCase() || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{feedback.user_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {feedback.user_email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {feedback.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {feedback.content.substring(0, 50)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={feedback.type}
                          color={TYPE_COLORS[feedback.type] as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(feedback.status)}
                          color={STATUS_COLORS[feedback.status] as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getPriorityLabel(feedback.priority)}
                          color={PRIORITY_COLORS[feedback.priority] as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">{formatDate(feedback.createdAt)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            onClick={() => router.push(paths.webtoon.cms.feedbackDetail(feedback._id))}
                          >
                            <Iconify icon="carbon:view" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenResponseDialog(feedback)}
                            color={feedback.response ? 'success' : 'primary'}
                          >
                            <Iconify icon="carbon:chat" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Мөр:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} / ${count !== -1 ? count : `~${to}`}`
            }
          />
        </Card>
      </Stack>

      {/* Response Dialog */}
      <Dialog
        open={responseDialogOpen}
        onClose={handleCloseResponseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Iconify icon="carbon:chat" width={24} />
            <Typography variant="h6">Хариу өгөх</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Гарчиг
                </Typography>
                <Typography variant="body1">{selectedFeedback.title}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Агуулга
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedFeedback.content}
                </Typography>
              </Box>
              <Divider />
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Хариу"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Хариу бичнэ үү..."
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResponseDialog}>Цуцлах</Button>
          <Button variant="contained" onClick={handleSubmitResponse}>
            Илгээх
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

