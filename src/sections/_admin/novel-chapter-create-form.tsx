'use client';

import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { RichTextEditor } from 'src/components/editor';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  novelId: string;
  novelTitle?: string;
};

export default function NovelChapterCreateForm({ novelId, novelTitle }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const [nextChapterNumber, setNextChapterNumber] = useState(1);
  const [loadingChapterNumber, setLoadingChapterNumber] = useState(true);
  const [manualChapterNumber, setManualChapterNumber] = useState(false);

  // Fetch existing chapters to determine next chapter number
  useEffect(() => {
    const fetchLastChapter = async () => {
      try {
        const response = await fetch(`/api2/novel/${novelId}/chapters`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const result = await response.json();

          // API returns 'chapters' not 'data'
          const chapters = result.chapters || result.data || [];

          if (result.success && Array.isArray(chapters) && chapters.length > 0) {
            // Find the highest chapter number
            const chapterNumbers = chapters.map((ch: any) => ch.chapterNumber || 0);
            const maxChapterNumber = Math.max(...chapterNumbers);
            setNextChapterNumber(maxChapterNumber + 1);
          } else {
            setNextChapterNumber(1);
          }
        }
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
        setNextChapterNumber(1); // Fallback to 1 on error
      } finally {
        setLoadingChapterNumber(false);
      }
    };

    fetchLastChapter();
  }, [novelId]);

  const ChapterSchema = Yup.object().shape({
    chapterNumber: Yup.number()
      .required('Бүлгийн дугаар оруулна уу')
      .positive('Эерэг тоо оруулна уу')
      .test('is-valid-chapter', 'Буруу формат (жишээ: 1, 1.5, 2.3)', (value) => {
        if (!value) return false;
        // Allow integers and decimals with up to 2 decimal places
        return /^\d+(\.\d{1,2})?$/.test(String(value));
      }),
    title: Yup.string().required('Гарчиг оруулна уу'),
    content: Yup.string()
      .required('Агуулга оруулна уу')
      .test('min-length', 'Агуулга багадаа 100 тэмдэгт байх ёстой', (value) => {
        if (!value) return false;
        // Strip HTML tags for length check
        const textContent = value.replace(/<[^>]*>/g, '').trim();
        return textContent.length >= 100;
      }),
  });

  const defaultValues = {
    chapterNumber: nextChapterNumber,
    title: '',
    content: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChapterSchema),
    defaultValues,
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const content = watch('content') || '';

  // Calculate character count (without HTML tags)
  const characterCount = useMemo(() => content.replace(/<[^>]*>/g, '').trim().length, [content]);

  const isContentValid = characterCount >= 100;

  // Update chapter number when it changes
  useEffect(() => {
    setValue('chapterNumber', nextChapterNumber);
  }, [nextChapterNumber, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Strip HTML and check if content is not empty
      const textContent = data.content.replace(/<[^>]*>/g, '').trim();

      if (textContent.length === 0) {
        alert('Агуулга оруулна уу');
        return;
      }

      if (textContent.length < 100) {
        alert('Агуулга багадаа 100 тэмдэгт байх ёстой');
        return;
      }

      const payload = {
        chapterNumber: data.chapterNumber,
        title: data.title,
        content: data.content, // Store as HTML
      };

      const response = await fetch(`/api2/novel/${novelId}/chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      // Try to parse the response
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert(
          `Серверийн алдаа: ${response.status} - ${response.statusText}\n${text.substring(0, 200)}`
        );
        return;
      }

      if (result.success) {
        alert('Бүлэг амжилттай нэмэгдлээ!');
        setNextChapterNumber((prev) => prev + 1); // Auto-increment for next chapter
        setManualChapterNumber(false); // Reset to auto mode

        // Reset form
        setValue('title', '');
        setValue('content', '');

        const addAnother = window.confirm('Өөр бүлэг нэмэх үү?');
        if (!addAnother) {
          router.push(paths.webtoon.cms.novelChapters(novelId));
        }
      } else {
        alert(`Алдаа: ${result.error || result.message || 'Тодорхойгүй алдаа гарлаа'}`);
      }
    } catch (error) {
      console.error('Create chapter error:', error);
      alert(`Сүлжээний алдаа: ${error instanceof Error ? error.message : 'Дахин оролдоно уу.'}`);
    }
  });

  // Show loading while fetching chapter number
  if (loadingChapterNumber) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Бүлгийн дугаар тооцоолж байна...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Chapter Info Card */}
            <Card
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.background.paper,
                  1
                )} 0%, ${alpha(theme.palette.background.neutral, 0.3)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                boxShadow: theme.customShadows?.z8 || theme.shadows[2],
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon="carbon:document"
                    sx={{ color: theme.palette.primary.main, fontSize: 24 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Бүлгийн мэдээлэл
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Бүлгийн үндсэн мэдээлэл
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <RHFTextField
                        name="chapterNumber"
                        label="Бүлгийн дугаар"
                        type="number"
                        disabled={!manualChapterNumber}
                        helperText={
                          manualChapterNumber
                            ? 'Гараар оруулж байна (жишээ: 1.5, 2.3)'
                            : 'Автоматаар тооцоологдсон'
                        }
                        inputProps={{
                          step: 0.1,
                          min: 0.1,
                        }}
                      />
                    </Box>
                    <Button
                      variant={manualChapterNumber ? 'contained' : 'outlined'}
                      color={manualChapterNumber ? 'primary' : 'inherit'}
                      onClick={() => setManualChapterNumber(!manualChapterNumber)}
                      sx={{ minWidth: 100, mt: '4px' }}
                      startIcon={
                        <Iconify icon={manualChapterNumber ? 'carbon:locked' : 'carbon:unlocked'} />
                      }
                    >
                      {manualChapterNumber ? 'Түгжих' : 'Засах'}
                    </Button>
                  </Stack>
                  {manualChapterNumber && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'warning.main', display: 'block', mt: 1, ml: 1.75 }}
                    >
                      💡 Зөвлөмж: 1.1, 1.5 гэх мэт (side story, special chapter)
                    </Typography>
                  )}
                </Box>

                <RHFTextField
                  name="title"
                  label="Бүлгийн гарчиг"
                  placeholder="Жишээ нь: Эхлэл, Тулаан, гэх мэт"
                />
              </Stack>
            </Card>

            {/* Content Card */}
            <Card
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.background.paper,
                  1
                )} 0%, ${alpha(theme.palette.background.neutral, 0.5)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                boxShadow: theme.customShadows?.z8 || theme.shadows[2],
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon="carbon:document-edit"
                    sx={{ color: theme.palette.primary.main, fontSize: 24 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Бүлгийн агуулга
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Текст редактор ашиглан форматлаж болно
                  </Typography>
                </Box>
              </Stack>

              <Controller
                name="content"
                control={control}
                render={({ field, fieldState }) => (
                  <Box>
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Зохиолы бүлгийн агуулгыг энд бичнэ үү... Гарчиг, догол мөр, жагсаалт зэрэг формат ашиглана уу."
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || 'Багадаа 100 тэмдэгт байх ёстой'}
                      minHeight={600}
                    />
                    {field.value && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2.5,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${alpha(
                            isContentValid
                              ? theme.palette.success.main
                              : theme.palette.warning.main,
                            0.1
                          )} 0%, ${alpha(
                            isContentValid
                              ? theme.palette.success.main
                              : theme.palette.warning.main,
                            0.05
                          )} 100%)`,
                          border: `1px solid ${alpha(
                            isContentValid
                              ? theme.palette.success.main
                              : theme.palette.warning.main,
                            0.3
                          )}`,
                        }}
                      >
                        <Stack spacing={1.5}>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Iconify
                                icon={
                                  isContentValid
                                    ? 'carbon:checkmark-filled'
                                    : 'carbon:warning-filled'
                                }
                                sx={{
                                  color: isContentValid ? 'success.main' : 'warning.main',
                                  fontSize: 20,
                                }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Тэмдэгтийн тоо
                              </Typography>
                            </Stack>
                            <Chip
                              label={`${characterCount} / 100`}
                              color={isContentValid ? 'success' : 'warning'}
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min((characterCount / 100) * 100, 100)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.grey[500], 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: isContentValid
                                  ? theme.palette.success.main
                                  : theme.palette.warning.main,
                                borderRadius: 3,
                              },
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {isContentValid
                              ? '✅ Агуулга хангалттай байна'
                              : `⚠️ ${100 - characterCount} тэмдэгт дутуу байна`}
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                )}
              />
            </Card>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Novel Info */}
            {novelTitle && (
              <Card sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                <Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
                  <Iconify
                    icon="carbon:document"
                    sx={{ color: theme.palette.primary.main, fontSize: 24 }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Зохиол
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {novelTitle}
                </Typography>
              </Card>
            )}

            {/* Tips Card */}
            <Card
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.info.main,
                  0.08
                )} 0%, ${alpha(theme.palette.info.main, 0.04)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                boxShadow: theme.customShadows?.z4 || theme.shadows[1],
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.info.main, 0.16),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon="carbon:idea"
                    sx={{ color: theme.palette.info.main, fontSize: 20 }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Зөвлөмж
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Iconify
                    icon="carbon:checkmark-filled"
                    sx={{ color: 'success.main', fontSize: 18, mt: 0.2, flexShrink: 0 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    <strong>Текст редактор:</strong> Гарчиг, тод, налуу, жагсаалт, зураг, холбоос
                    зэрэг формат ашиглана
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Iconify
                    icon="carbon:checkmark-filled"
                    sx={{ color: 'success.main', fontSize: 18, mt: 0.2, flexShrink: 0 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    <strong>Хэмжээ:</strong> Багадаа 100 тэмдэгт бичих шаардлагатай (HTML таг
                    тооцохгүй)
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Iconify
                    icon="carbon:code"
                    sx={{ color: 'info.main', fontSize: 18, mt: 0.2, flexShrink: 0 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    <strong>Формат:</strong> HTML формат хадгалагдана, уншигчид сайхан харагдана
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Iconify
                    icon="carbon:image"
                    sx={{ color: 'warning.main', fontSize: 18, mt: 0.2, flexShrink: 0 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    <strong>Зураг:</strong> Зургийн холбоос оруулж болно (URL эсвэл base64)
                  </Typography>
                </Stack>
              </Stack>
            </Card>

            {/* Actions Card */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Үйлдлүүд
              </Typography>

              <Stack spacing={2}>
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  startIcon={<Iconify icon="carbon:checkmark" />}
                  sx={{
                    bgcolor: theme.palette.success.main,
                    '&:hover': {
                      bgcolor: theme.palette.success.dark,
                    },
                  }}
                >
                  Хадгалах
                </LoadingButton>

                <Button
                  fullWidth
                  size="large"
                  variant="outlined"
                  color="inherit"
                  onClick={() => router.push(paths.webtoon.cms.novelChapters(novelId))}
                  startIcon={<Iconify icon="carbon:arrow-left" />}
                >
                  Буцах
                </Button>

                <Button
                  fullWidth
                  size="large"
                  variant="soft"
                  color="error"
                  onClick={() => {
                    setValue('title', '');
                    setValue('content', '');
                  }}
                  startIcon={<Iconify icon="carbon:reset" />}
                >
                  Цэвэрлэх
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
