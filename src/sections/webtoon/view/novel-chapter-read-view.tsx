'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { isAuthenticated } from 'src/utils/auth';
import CommentsSection from '../components/comments-section';
import { trackChapterRead } from 'src/utils/achievements-api';

// ----------------------------------------------------------------------

type Props = {
  novelId: string;
  chapterId: string;
};

export default function NovelChapterReadView({ novelId, chapterId }: Props) {
  const theme = useTheme();
  const [chapter, setChapter] = useState<any>(null);
  const [novel, setNovel] = useState<any>(null);
  const [, setAllChapters] = useState<any[]>([]);
  const [prevChapter, setPrevChapter] = useState<any>(null);
  const [nextChapter, setNextChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [readerTheme, setReaderTheme] = useState<'paper' | 'sepia' | 'night'>('paper');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.9);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setPrevChapter(null);
        setNextChapter(null);

        // Fetch novel data
        const novelResponse = await fetch(`/api2/novel/${novelId}`);
        const novelResult = await novelResponse.json();

        if (novelResult.success && novelResult.novel) {
          setNovel(novelResult.novel);
        }

        // Fetch all chapters for navigation
        const chaptersResponse = await fetch(`/api2/novel/${novelId}/chapters`);
        const chaptersResult = await chaptersResponse.json();

        if (chaptersResult.success && chaptersResult.chapters) {
          const { chapters } = chaptersResult;
          setAllChapters(chapters);

          // Find current chapter index
          const currentIndex = chapters.findIndex((ch: any) => (ch._id || ch.id) === chapterId);

          if (currentIndex !== -1) {
            // Set prev and next chapters
            if (currentIndex > 0) {
              setPrevChapter(chapters[currentIndex - 1]);
            } else {
              setPrevChapter(null);
            }

            if (currentIndex < chapters.length - 1) {
              setNextChapter(chapters[currentIndex + 1]);
            } else {
              setNextChapter(null);
            }
          }
        }

        // Fetch current chapter data
        const chapterResponse = await fetch(`/api2/novel/chapter/${chapterId}`);
        const chapterResult = await chapterResponse.json();

        if (chapterResult.success && chapterResult.chapter) {
          setChapter(chapterResult.chapter);

          // Track chapter read for achievements
          if (isAuthenticated()) {
            trackChapterRead(chapterId, true).catch((err) => {
              console.error('Failed to track chapter read:', err);
            });
          }
        } else {
          setError(chapterResult.message || 'Бүлэг олдсонгүй');
        }
      } catch (err) {
        console.error('Failed to fetch chapter data:', err);
        setError('Сүлжээний алдаа. Дахин оролдоно уу.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Scroll to top when chapter changes
    window.scrollTo(0, 0);
  }, [novelId, chapterId]);

  // Restore reader settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem('novel_reader_settings');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.readerTheme) setReaderTheme(parsed.readerTheme);
      if (parsed?.fontFamily) setFontFamily(parsed.fontFamily);
      if (parsed?.fontSize) setFontSize(parsed.fontSize);
      if (parsed?.lineHeight) setLineHeight(parsed.lineHeight);
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist reader settings
  useEffect(() => {
    try {
      localStorage.setItem(
        'novel_reader_settings',
        JSON.stringify({ readerTheme, fontFamily, fontSize, lineHeight })
      );
    } catch (e) {
      // ignore
    }
  }, [readerTheme, fontFamily, fontSize, lineHeight]);

  // Persist "continue reading" pointer for detail page CTA
  useEffect(() => {
    if (!chapter) return;
    try {
      localStorage.setItem(
        `novel_last_read_${novelId}`,
        JSON.stringify({
          chapterId,
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          at: Date.now(),
        })
      );
    } catch (e) {
      // ignore
    }
  }, [chapter, chapterId, novelId]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Arrow Left or A - Previous chapter
      if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && prevChapter) {
        window.location.href = paths.webtoon.novelChapter(
          novelId,
          prevChapter._id || prevChapter.id
        );
      }
      // Arrow Right or D - Next chapter or back to novel detail
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (nextChapter) {
          window.location.href = paths.webtoon.novelChapter(
            novelId,
            nextChapter._id || nextChapter.id
          );
        } else {
          // If no next chapter, go back to novel detail page
          window.location.href = paths.webtoon.novel(novelId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [novelId, prevChapter, nextChapter]);

  const surface = useMemo(() => {
    if (readerTheme === 'night') {
      return {
        bg: '#0b0f17',
        paper: '#0f1624',
        text: '#e7edf7',
        muted: alpha('#e7edf7', 0.68),
        border: alpha('#e7edf7', 0.12),
        accent: theme.palette.primary.main,
      };
    }
    if (readerTheme === 'sepia') {
      return {
        bg: '#fbf3e6',
        paper: '#fff9f0',
        text: '#2a241d',
        muted: alpha('#2a241d', 0.65),
        border: alpha('#2a241d', 0.12),
        accent: theme.palette.primary.main,
      };
    }
    return {
      bg: theme.palette.background.default,
      paper: theme.palette.background.paper,
      text: theme.palette.text.primary,
      muted: theme.palette.text.secondary,
      border: alpha(theme.palette.divider, 0.8),
      accent: theme.palette.primary.main,
    };
  }, [
    readerTheme,
    theme.palette.background.default,
    theme.palette.background.paper,
    theme.palette.divider,
    theme.palette.primary.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !chapter) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Iconify
            icon="carbon:document-blank"
            sx={{ fontSize: 80, color: 'text.disabled', mb: 3, opacity: 0.5 }}
          />
          <Typography variant="h4" color="text.secondary" gutterBottom>
            {error || 'Бүлэг олдсонгүй'}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            href={paths.webtoon.novel(novelId)}
            startIcon={<Iconify icon="carbon:arrow-left" />}
            sx={{ mt: 3 }}
          >
            Роман руу буцах
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: surface.bg, minHeight: '100vh' }}>
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={readProgress}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          zIndex: 1300,
          bgcolor: alpha(surface.text, 0.08),
          '& .MuiLinearProgress-bar': {
            bgcolor: surface.accent,
          },
        }}
      />

      {/* Reader Header (new look) */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          bgcolor: alpha(surface.paper, 0.86),
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${surface.border}`,
          py: 2,
        }}
      >
        <Container maxWidth="md">
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
              <Tooltip title="Роман руу буцах">
                <IconButton component={RouterLink} href={paths.webtoon.novel(novelId)} size="small">
                  <Iconify icon="carbon:arrow-left" />
                </IconButton>
              </Tooltip>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 950,
                    color: surface.text,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {novel?.title || 'Novel'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: surface.muted,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                >
                  Бүлэг {chapter.chapterNumber} • {chapter.title}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.75} alignItems="center">
              <Chip
                size="small"
                label={`${Math.round(readProgress)}%`}
                sx={{
                  bgcolor: alpha(surface.text, 0.08),
                  color: surface.text,
                  fontWeight: 900,
                }}
              />
              <Tooltip title="Тохиргоо">
                <IconButton size="small" onClick={() => setSettingsOpen(true)}>
                  <Iconify icon="carbon:settings" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Chapter Content */}
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={4}>
          {/* Chapter Header */}
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 950,
                mb: 0.5,
                color: surface.text,
                fontSize: { xs: '1.5rem', md: '2.2rem' },
              }}
            >
              Бүлэг {chapter.chapterNumber}
            </Typography>
            <Typography variant="body1" sx={{ color: surface.muted, fontWeight: 700 }}>
              {chapter.title}
            </Typography>
          </Box>

          {/* Chapter Text Content */}
          <Box
            sx={{
              bgcolor: surface.paper,
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              border: `1px solid ${surface.border}`,
              boxShadow: 'none',
              '& *': {
                maxWidth: '100%',
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                my: 2,
              },
              '& p': {
                mb: 2,
                lineHeight,
                fontSize: `${fontSize}px`,
                color: surface.text,
                fontFamily:
                  fontFamily === 'serif'
                    ? 'Georgia, ui-serif, Times New Roman, serif'
                    : 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                mt: 3,
                mb: 2,
                fontWeight: 700,
                color: surface.text,
                fontFamily:
                  fontFamily === 'serif'
                    ? 'Georgia, ui-serif, Times New Roman, serif'
                    : 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
              },
              '& h1': { fontSize: '2rem' },
              '& h2': { fontSize: '1.75rem' },
              '& h3': { fontSize: '1.5rem' },
              '& blockquote': {
                borderLeft: `4px solid ${surface.accent}`,
                pl: 3,
                py: 2,
                my: 3,
                bgcolor: alpha(surface.accent, 0.08),
                fontStyle: 'italic',
                borderRadius: 1,
                color: surface.muted,
              },
              '& ul, & ol': {
                pl: 4,
                mb: 2,
              },
              '& li': {
                mb: 1,
                lineHeight: 1.8,
              },
            }}
            dangerouslySetInnerHTML={{ __html: chapter.content || '' }}
          />

          {/* Navigation Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            sx={{ pt: 2 }}
          >
            <Button
              variant="outlined"
              size="large"
              component={prevChapter ? RouterLink : 'button'}
              href={
                prevChapter
                  ? paths.webtoon.novelChapter(novelId, prevChapter._id || prevChapter.id)
                  : undefined
              }
              disabled={!prevChapter}
              startIcon={<Iconify icon="carbon:arrow-left" />}
              sx={{ minWidth: { xs: '100%', sm: 200 }, borderWidth: 2, fontWeight: 900 }}
            >
              {prevChapter ? `Өмнөх: Бүлэг ${prevChapter.chapterNumber}` : 'Эхний бүлэг'}
            </Button>

            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              href={paths.webtoon.novel(novelId)}
              startIcon={<Iconify icon="carbon:document" />}
              sx={{ minWidth: { xs: '100%', sm: 200 }, borderWidth: 2, fontWeight: 900 }}
            >
              Роман руу буцах
            </Button>

            <Button
              variant="contained"
              size="large"
              component={nextChapter ? RouterLink : 'button'}
              href={
                nextChapter
                  ? paths.webtoon.novelChapter(novelId, nextChapter._id || nextChapter.id)
                  : undefined
              }
              disabled={!nextChapter}
              endIcon={<Iconify icon="carbon:arrow-right" />}
              sx={{
                minWidth: { xs: '100%', sm: 200 },
                fontWeight: 900,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              {nextChapter ? `Дараах: Бүлэг ${nextChapter.chapterNumber}` : 'Сүүлийн бүлэг'}
            </Button>
          </Stack>

          {/* Reader hint */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: surface.muted }}>
              ← (A) өмнөх • → (D) дараах • ⚙️ тохиргоо
            </Typography>
          </Box>

          {/* Comments Section */}
          <CommentsSection novelChapterId={chapterId} />
        </Stack>
      </Container>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 360 },
            bgcolor: surface.paper,
            color: surface.text,
            borderLeft: `1px solid ${surface.border}`,
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 950 }}>
              Уншигчийн тохиргоо
            </Typography>
            <IconButton onClick={() => setSettingsOpen(false)}>
              <Iconify icon="carbon:close" />
            </IconButton>
          </Stack>
          <Typography variant="caption" sx={{ color: surface.muted }}>
            Тохиргоо нь энэ төхөөрөмж дээр хадгалагдана.
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                Theme
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                <Chip
                  label="Paper"
                  clickable
                  color={readerTheme === 'paper' ? 'primary' : 'default'}
                  onClick={() => setReaderTheme('paper')}
                  sx={{ fontWeight: 900 }}
                />
                <Chip
                  label="Sepia"
                  clickable
                  color={readerTheme === 'sepia' ? 'primary' : 'default'}
                  onClick={() => setReaderTheme('sepia')}
                  sx={{ fontWeight: 900 }}
                />
                <Chip
                  label="Night"
                  clickable
                  color={readerTheme === 'night' ? 'primary' : 'default'}
                  onClick={() => setReaderTheme('night')}
                  sx={{ fontWeight: 900 }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                Font
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                <Chip
                  label="Serif"
                  clickable
                  color={fontFamily === 'serif' ? 'primary' : 'default'}
                  onClick={() => setFontFamily('serif')}
                  sx={{ fontWeight: 900 }}
                />
                <Chip
                  label="Sans"
                  clickable
                  color={fontFamily === 'sans' ? 'primary' : 'default'}
                  onClick={() => setFontFamily('sans')}
                  sx={{ fontWeight: 900 }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                Font size: {fontSize}px
              </Typography>
              <Slider
                value={fontSize}
                onChange={(_, v) => setFontSize(v as number)}
                min={14}
                max={26}
                step={1}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                Line height: {lineHeight.toFixed(1)}
              </Typography>
              <Slider
                value={lineHeight}
                onChange={(_, v) => setLineHeight(v as number)}
                min={1.4}
                max={2.4}
                step={0.1}
              />
            </Box>

            <Button
              variant="outlined"
              onClick={() => {
                setReaderTheme('paper');
                setFontFamily('serif');
                setFontSize(18);
                setLineHeight(1.9);
              }}
              startIcon={<Iconify icon="carbon:reset" />}
              sx={{ borderWidth: 2, fontWeight: 900 }}
            >
              Reset
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
