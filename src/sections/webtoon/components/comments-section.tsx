'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import Iconify from 'src/components/iconify';
import { getUser, getAuthHeaders, isAuthenticated } from 'src/utils/auth';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

interface Comment {
  _id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  likes: number;
  unLikes?: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  replyCount?: number;
  parentId?: string | null;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface CommentsSectionProps {
  comicId?: string;
  chapterId?: string;
}

export default function CommentsSection({ comicId, chapterId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<string>>(new Set());
  const [likingComment, setLikingComment] = useState<string | null>(null);
  const [dislikingComment, setDislikingComment] = useState<string | null>(null);
  const deleteDialogOpen = useBoolean();

  const currentUser = getUser();
  const authenticated = isAuthenticated();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = chapterId
        ? `/api2/comments/chapter/${chapterId}`
        : `/api2/comments/comic/${comicId}`;

      const response = await fetch(`${endpoint}?page=${page}&limit=20`, {
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (result.success) {
        const fetchedComments = result.comments || [];
        setComments(fetchedComments);
        setTotalPages(result.pages || 1);
        setTotal(result.total || 0);

        // Initialize liked and disliked comments sets
        const liked = new Set<string>();
        const disliked = new Set<string>();
        fetchedComments.forEach((comment: Comment) => {
          if (comment.isLiked) {
            liked.add(comment._id);
          }
          if (comment.isDisliked) {
            disliked.add(comment._id);
          }
          if (comment.replies) {
            comment.replies.forEach((reply: Comment) => {
              if (reply.isLiked) {
                liked.add(reply._id);
              }
              if (reply.isDisliked) {
                disliked.add(reply._id);
              }
            });
          }
        });
        setLikedComments(liked);
        setDislikedComments(disliked);
      } else {
        setError(result.message || 'Сэтгэгдэл ачаалахад алдаа гарлаа');
      }
    } catch (err) {
      setError('Сэтгэгдэл ачаалахад алдаа гарлаа');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [comicId, chapterId, page]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async () => {
    if (!authenticated) {
      setError('Сэтгэгдэл бичихийн тулд нэвтрэх шаардлагатай');
      return;
    }

    if (!commentText.trim()) {
      setError('Сэтгэгдэл хоосон байж болохгүй');
      return;
    }

    if (commentText.length > 5000) {
      setError('Сэтгэгдэл 5000 тэмдэгтээс хэтрэхгүй байх ёстой');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const endpoint = chapterId
        ? `/api2/comments/chapter/${chapterId}`
        : `/api2/comments/comic/${comicId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: commentText.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setCommentText('');
        fetchComments();
      } else {
        setError(result.message || 'Сэтгэгдэл илгээхэд алдаа гарлаа');
      }
    } catch (err) {
      setError('Сэтгэгдэл илгээхэд алдаа гарлаа');
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async () => {
    if (!editingComment || !editText.trim()) return;

    if (editText.length > 5000) {
      setError('Сэтгэгдэл 5000 тэмдэгтээс хэтрэхгүй байх ёстой');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api2/comments/${editingComment}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: editText.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setEditingComment(null);
        setEditText('');
        fetchComments();
      } else {
        setError(result.message || 'Сэтгэгдэл засах үед алдаа гарлаа');
      }
    } catch (err) {
      setError('Сэтгэгдэл засах үед алдаа гарлаа');
      console.error('Error editing comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api2/comments/${selectedComment}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        deleteDialogOpen.onFalse();
        setSelectedComment(null);
        fetchComments();
      } else {
        setError(result.message || 'Сэтгэгдэл устгахад алдаа гарлаа');
      }
    } catch (err) {
      setError('Сэтгэгдэл устгахад алдаа гарлаа');
      console.error('Error deleting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (
    commentId: string,
    currentLikes: number,
    isCurrentlyLiked: boolean
  ) => {
    if (!authenticated) {
      setError('Лайк хийхийн тулд нэвтрэх шаардлагатай');
      return;
    }

    try {
      setLikingComment(commentId);
      setError(null);

      const endpoint = isCurrentlyLiked
        ? `/api2/comments/${commentId}/unlike`
        : `/api2/comments/${commentId}/like`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        const newLikedComments = new Set(likedComments);
        if (isCurrentlyLiked) {
          newLikedComments.delete(commentId);
        } else {
          newLikedComments.add(commentId);
        }
        setLikedComments(newLikedComments);

        // Update comment likes count and remove dislike if exists
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id === commentId) {
              const wasDisliked = dislikedComments.has(commentId) || comment.isDisliked;
              return {
                ...comment,
                likes: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1,
                isLiked: !isCurrentlyLiked,
                // Remove dislike if user was disliking
                isDisliked: wasDisliked && !isCurrentlyLiked ? false : comment.isDisliked,
                unLikes:
                  wasDisliked && !isCurrentlyLiked
                    ? Math.max(0, (comment.unLikes || 0) - 1)
                    : comment.unLikes,
              };
            }
            // Also update in replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) => {
                  if (reply._id === commentId) {
                    const wasDisliked = dislikedComments.has(reply._id) || reply.isDisliked;
                    return {
                      ...reply,
                      likes: isCurrentlyLiked ? reply.likes - 1 : reply.likes + 1,
                      isLiked: !isCurrentlyLiked,
                      isDisliked: wasDisliked && !isCurrentlyLiked ? false : reply.isDisliked,
                      unLikes:
                        wasDisliked && !isCurrentlyLiked
                          ? Math.max(0, (reply.unLikes || 0) - 1)
                          : reply.unLikes,
                    };
                  }
                  return reply;
                }),
              };
            }
            return comment;
          })
        );

        // Remove from disliked set if it was disliked
        if (dislikedComments.has(commentId)) {
          const newDislikedComments = new Set(dislikedComments);
          newDislikedComments.delete(commentId);
          setDislikedComments(newDislikedComments);
        }
      } else {
        setError(result.message || 'Лайк хийхэд алдаа гарлаа');
      }
    } catch (err) {
      setError('Лайк хийхэд алдаа гарлаа');
      console.error('Error liking comment:', err);
    } finally {
      setLikingComment(null);
    }
  };

  const handleDislikeComment = async (
    commentId: string,
    currentUnLikes: number,
    isCurrentlyDisliked: boolean
  ) => {
    if (!authenticated) {
      setError('Дургүй хийхийн тулд нэвтрэх шаардлагатай');
      return;
    }

    try {
      setDislikingComment(commentId);
      setError(null);

      const endpoint = isCurrentlyDisliked
        ? `/api2/comments/${commentId}/undislike`
        : `/api2/comments/${commentId}/dislike`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        const newDislikedComments = new Set(dislikedComments);
        if (isCurrentlyDisliked) {
          newDislikedComments.delete(commentId);
        } else {
          newDislikedComments.add(commentId);
          // Remove from liked set if it was liked (mutual exclusivity)
          if (likedComments.has(commentId)) {
            const newLikedComments = new Set(likedComments);
            newLikedComments.delete(commentId);
            setLikedComments(newLikedComments);
          }
        }
        setDislikedComments(newDislikedComments);

        // Update comment unLikes count and remove like if exists
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id === commentId) {
              const wasLiked = likedComments.has(commentId) || comment.isLiked;
              return {
                ...comment,
                unLikes: isCurrentlyDisliked
                  ? Math.max(0, (currentUnLikes || 0) - 1)
                  : (currentUnLikes || 0) + 1,
                isDisliked: !isCurrentlyDisliked,
                // Remove like if user was liking
                isLiked: wasLiked && !isCurrentlyDisliked ? false : comment.isLiked,
                likes:
                  wasLiked && !isCurrentlyDisliked
                    ? Math.max(0, (comment.likes || 0) - 1)
                    : comment.likes,
              };
            }
            // Also update in replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) => {
                  if (reply._id === commentId) {
                    const wasLiked = likedComments.has(reply._id) || reply.isLiked;
                    return {
                      ...reply,
                      unLikes: isCurrentlyDisliked
                        ? Math.max(0, (reply.unLikes || 0) - 1)
                        : (reply.unLikes || 0) + 1,
                      isDisliked: !isCurrentlyDisliked,
                      isLiked: wasLiked && !isCurrentlyDisliked ? false : reply.isLiked,
                      likes:
                        wasLiked && !isCurrentlyDisliked
                          ? Math.max(0, (reply.likes || 0) - 1)
                          : reply.likes,
                    };
                  }
                  return reply;
                }),
              };
            }
            return comment;
          })
        );
      } else {
        setError(result.message || 'Дургүй хийхэд алдаа гарлаа');
      }
    } catch (err) {
      setError('Дургүй хийхэд алдаа гарлаа');
      console.error('Error disliking comment:', err);
    } finally {
      setDislikingComment(null);
    }
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!authenticated) {
      setError('Хариу бичихийн тулд нэвтрэх шаардлагатай');
      return;
    }

    const text = replyText[parentCommentId] || '';
    if (!text.trim()) {
      setError('Хариу хоосон байж болохгүй');
      return;
    }

    if (text.length > 5000) {
      setError('Хариу 5000 тэмдэгтээс хэтрэхгүй байх ёстой');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api2/comments/${parentCommentId}/reply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: text.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setReplyText({ ...replyText, [parentCommentId]: '' });
        setReplyingTo(null);
        // Automatically show replies after posting
        setShowReplies({ ...showReplies, [parentCommentId]: true });
        fetchComments();
      } else {
        setError(result.message || 'Хариу илгээхэд алдаа гарлаа');
      }
    } catch (err) {
      setError('Хариу илгээхэд алдаа гарлаа');
      console.error('Error submitting reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, commentId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment._id);
    setEditText(comment.content);
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Сая';
    if (minutes < 60) return `${minutes} минут`;
    if (hours < 24) return `${hours} цаг`;
    if (days < 7) return `${days} өдөр`;
    return date.toLocaleDateString('mn-MN');
  };

  const isCommentOwner = (comment: Comment) =>
    currentUser && comment.author && currentUser.id === comment.author.id;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Сэтгэгдлүүд ({total})
      </Typography>

      {/* Comment Input */}
      {authenticated ? (
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Сэтгэгдэлээ бичнэ үү..."
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                setError(null);
              }}
              error={!!error && !editingComment}
              helperText={error && !editingComment ? error : `${commentText.length}/5000 тэмдэгт`}
              inputProps={{ maxLength: 5000 }}
            />
            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton
                variant="contained"
                onClick={handleSubmitComment}
                loading={submitting}
                disabled={!commentText.trim()}
              >
                Илгээх
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      ) : (
        <Card sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Сэтгэгдэл бичихийн тулд нэвтрэх шаардлагатай
          </Typography>
        </Card>
      )}

      {/* Error Alert */}
      {error && (editingComment || replyingTo) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Comments List */}
      {(() => {
        if (loading) {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          );
        }

        if (comments.length === 0) {
          return (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Iconify icon="carbon:chat" sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary">
                Сэтгэгдэл байхгүй байна
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Анхны сэтгэгдэл үлдээгээрэй
              </Typography>
            </Card>
          );
        }

        return (
          <Stack spacing={2}>
            {comments.map((comment) => (
              <Card key={comment._id} sx={{ p: 3 }}>
                {editingComment === comment._id ? (
                  <Stack spacing={2}>
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      value={editText}
                      onChange={(e) => {
                        setEditText(e.target.value);
                        setError(null);
                      }}
                      error={!!error}
                      helperText={error || `${editText.length}/5000 тэмдэгт`}
                      inputProps={{ maxLength: 5000 }}
                    />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditingComment(null);
                          setEditText('');
                          setError(null);
                        }}
                      >
                        Цуцлах
                      </Button>
                      <LoadingButton
                        variant="contained"
                        onClick={handleEditComment}
                        loading={submitting}
                        disabled={!editText.trim()}
                      >
                        Хадгалах
                      </LoadingButton>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Avatar
                      src={comment.author?.avatar}
                      alt={comment.author?.name}
                      sx={{ width: 40, height: 40 }}
                    >
                      {comment.author?.name?.charAt(0).toUpperCase() || '?'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">
                          {comment.author?.name || 'Нэргүй хэрэглэгч'}
                        </Typography>
                        {comment.isEdited && (
                          <Typography variant="caption" color="text.secondary">
                            (Зассан)
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.createdAt)}
                        </Typography>
                        {isCommentOwner(comment) && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, comment._id)}
                            sx={{ ml: 'auto' }}
                          >
                            <Iconify icon="carbon:overflow-menu-vertical" />
                          </IconButton>
                        )}
                      </Stack>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <IconButton
                            size="small"
                            disabled={!authenticated || likingComment === comment._id}
                            onClick={() =>
                              handleLikeComment(
                                comment._id,
                                comment.likes,
                                likedComments.has(comment._id) || comment.isLiked || false
                              )
                            }
                            color={
                              likedComments.has(comment._id) || comment.isLiked
                                ? 'primary'
                                : 'default'
                            }
                            sx={{
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                            }}
                          >
                            <Iconify
                              icon={
                                likedComments.has(comment._id) || comment.isLiked
                                  ? 'carbon:thumbs-up-filled'
                                  : 'carbon:thumbs-up'
                              }
                            />
                          </IconButton>
                          <Typography variant="caption" color="text.secondary">
                            {comment.likes || 0}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <IconButton
                            size="small"
                            disabled={!authenticated || dislikingComment === comment._id}
                            onClick={() =>
                              handleDislikeComment(
                                comment._id,
                                comment.unLikes || 0,
                                dislikedComments.has(comment._id) || comment.isDisliked || false
                              )
                            }
                            color={
                              dislikedComments.has(comment._id) || comment.isDisliked
                                ? 'error'
                                : 'default'
                            }
                            sx={{
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                            }}
                          >
                            <Iconify
                              icon={
                                dislikedComments.has(comment._id) || comment.isDisliked
                                  ? 'carbon:thumbs-down-filled'
                                  : 'carbon:thumbs-down'
                              }
                            />
                          </IconButton>
                          <Typography variant="caption" color="text.secondary">
                            {comment.unLikes || 0}
                          </Typography>
                        </Stack>
                        {authenticated && (
                          <Button
                            size="small"
                            startIcon={<Iconify icon="carbon:reply" />}
                            onClick={() => {
                              setReplyingTo(replyingTo === comment._id ? null : comment._id);
                              if (!replyText[comment._id]) {
                                setReplyText({ ...replyText, [comment._id]: '' });
                              }
                            }}
                            sx={{ ml: 1 }}
                          >
                            Хариулах
                          </Button>
                        )}
                        {comment.replyCount && comment.replyCount > 0 && (
                          <Button
                            size="small"
                            onClick={() => {
                              setShowReplies({
                                ...showReplies,
                                [comment._id]: !showReplies[comment._id],
                              });
                            }}
                            sx={{ ml: 1 }}
                          >
                            {showReplies[comment._id]
                              ? 'Хариуг нуух'
                              : `${comment.replyCount} хариу`}
                          </Button>
                        )}
                      </Stack>

                      {/* Reply Input */}
                      {replyingTo === comment._id && authenticated && (
                        <Box sx={{ mt: 2, pl: 3, borderLeft: '2px solid', borderColor: 'divider' }}>
                          <Stack spacing={2}>
                            <TextField
                              multiline
                              rows={3}
                              fullWidth
                              placeholder="Хариу бичнэ үү..."
                              value={replyText[comment._id] || ''}
                              onChange={(e) => {
                                setReplyText({ ...replyText, [comment._id]: e.target.value });
                                setError(null);
                              }}
                              error={!!error && replyingTo === comment._id}
                              helperText={
                                error && replyingTo === comment._id
                                  ? error
                                  : `${(replyText[comment._id] || '').length}/5000 тэмдэгт`
                              }
                              inputProps={{ maxLength: 5000 }}
                              size="small"
                            />
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText({ ...replyText, [comment._id]: '' });
                                  setError(null);
                                }}
                              >
                                Цуцлах
                              </Button>
                              <LoadingButton
                                size="small"
                                variant="contained"
                                onClick={() => handleSubmitReply(comment._id)}
                                loading={submitting}
                                disabled={!replyText[comment._id]?.trim()}
                              >
                                Илгээх
                              </LoadingButton>
                            </Stack>
                          </Stack>
                        </Box>
                      )}

                      {/* Replies */}
                      {showReplies[comment._id] &&
                        comment.replies &&
                        comment.replies.length > 0 && (
                          <Box
                            sx={{ mt: 2, pl: 3, borderLeft: '2px solid', borderColor: 'divider' }}
                          >
                            <Stack spacing={2}>
                              {comment.replies.map((reply) => (
                                <Card key={reply._id} sx={{ p: 2, bgcolor: 'background.neutral' }}>
                                  <Stack direction="row" spacing={2}>
                                    <Avatar
                                      src={reply.author?.avatar}
                                      alt={reply.author?.name}
                                      sx={{ width: 32, height: 32 }}
                                    >
                                      {reply.author?.name?.charAt(0).toUpperCase() || '?'}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{ mb: 0.5 }}
                                      >
                                        <Typography variant="caption" fontWeight={600}>
                                          {reply.author?.name || 'Нэргүй хэрэглэгч'}
                                        </Typography>
                                        {reply.isEdited && (
                                          <Typography variant="caption" color="text.secondary">
                                            (Зассан)
                                          </Typography>
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                          {formatDate(reply.createdAt)}
                                        </Typography>
                                        {isCommentOwner(reply) && (
                                          <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, reply._id)}
                                            sx={{ ml: 'auto', p: 0.5 }}
                                          >
                                            <Iconify
                                              icon="carbon:overflow-menu-vertical"
                                              width={16}
                                            />
                                          </IconButton>
                                        )}
                                      </Stack>
                                      <Typography
                                        variant="body2"
                                        sx={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}
                                      >
                                        {reply.content}
                                      </Typography>
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{ mt: 1 }}
                                      >
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                          <IconButton
                                            size="small"
                                            disabled={!authenticated || likingComment === reply._id}
                                            onClick={() =>
                                              handleLikeComment(
                                                reply._id,
                                                reply.likes,
                                                likedComments.has(reply._id) ||
                                                  reply.isLiked ||
                                                  false
                                              )
                                            }
                                            color={
                                              likedComments.has(reply._id) || reply.isLiked
                                                ? 'primary'
                                                : 'default'
                                            }
                                            sx={{
                                              p: 0.5,
                                              '&:hover': {
                                                bgcolor: 'action.hover',
                                              },
                                            }}
                                          >
                                            <Iconify
                                              icon={
                                                likedComments.has(reply._id) || reply.isLiked
                                                  ? 'carbon:thumbs-up-filled'
                                                  : 'carbon:thumbs-up'
                                              }
                                              width={16}
                                            />
                                          </IconButton>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ fontSize: '0.75rem' }}
                                          >
                                            {reply.likes || 0}
                                          </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                          <IconButton
                                            size="small"
                                            disabled={
                                              !authenticated || dislikingComment === reply._id
                                            }
                                            onClick={() =>
                                              handleDislikeComment(
                                                reply._id,
                                                reply.unLikes || 0,
                                                dislikedComments.has(reply._id) ||
                                                  reply.isDisliked ||
                                                  false
                                              )
                                            }
                                            color={
                                              dislikedComments.has(reply._id) || reply.isDisliked
                                                ? 'error'
                                                : 'default'
                                            }
                                            sx={{
                                              p: 0.5,
                                              '&:hover': {
                                                bgcolor: 'action.hover',
                                              },
                                            }}
                                          >
                                            <Iconify
                                              icon={
                                                dislikedComments.has(reply._id) || reply.isDisliked
                                                  ? 'carbon:thumbs-down-filled'
                                                  : 'carbon:thumbs-down'
                                              }
                                              width={16}
                                            />
                                          </IconButton>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ fontSize: '0.75rem' }}
                                          >
                                            {reply.unLikes || 0}
                                          </Typography>
                                        </Stack>
                                      </Stack>
                                    </Box>
                                  </Stack>
                                </Card>
                              ))}
                            </Stack>
                          </Box>
                        )}
                    </Box>
                  </Stack>
                )}
              </Card>
            ))}
          </Stack>
        );
      })()}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            const comment = comments.find((c) => c._id === selectedComment);
            if (comment) startEditing(comment);
          }}
        >
          <Iconify icon="carbon:edit" sx={{ mr: 1 }} />
          Засах
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteDialogOpen.onTrue();
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="carbon:trash-can" sx={{ mr: 1 }} />
          Устгах
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen.value} onClose={deleteDialogOpen.onFalse}>
        <DialogTitle>Сэтгэгдэл устгах</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Та энэ сэтгэгдлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteDialogOpen.onFalse}>Цуцлах</Button>
          <LoadingButton
            onClick={handleDeleteComment}
            color="error"
            variant="contained"
            loading={submitting}
          >
            Устгах
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
