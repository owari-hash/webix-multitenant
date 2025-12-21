'use client';

import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { UploadMultiImage } from 'src/components/upload';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  comicId: string;
  comicTitle?: string;
};

export default function ChapterCreateForm({ comicId, comicTitle }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [uploadingBatch, setUploadingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [currentBatchInfo, setCurrentBatchInfo] = useState('');
  const [nextChapterNumber, setNextChapterNumber] = useState(1);
  const [loadingChapterNumber, setLoadingChapterNumber] = useState(true);
  const [manualChapterNumber, setManualChapterNumber] = useState(false);

  // Fetch existing chapters to determine next chapter number
  useEffect(() => {
    const fetchLastChapter = async () => {
      try {
        const response = await fetch(`/api2/webtoon/comic/${comicId}/chapters`, {
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
  }, [comicId]);

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
    description: Yup.string(),
  });

  const defaultValues = {
    chapterNumber: nextChapterNumber,
    title: '',
    description: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChapterSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Update chapter number when it changes
  useEffect(() => {
    setValue('chapterNumber', nextChapterNumber);
  }, [nextChapterNumber, setValue]);

  // Batch upload for large payloads
  const uploadInBatches = async (data: any, images: string[], batchSize: number = 5) => {
    setUploadingBatch(true);
    const batches = [];

    // Split images into batches
    for (let i = 0; i < images.length; i += batchSize) {
      batches.push(images.slice(i, i + batchSize));
    }

    setBatchProgress({ current: 0, total: batches.length });

    try {
      // Upload first batch with chapter creation
      const firstBatch = batches[0];
      const firstPayload = {
        chapterNumber: data.chapterNumber,
        title: data.title,
        images: firstBatch,
      };

      setCurrentBatchInfo(`Batch 1/${batches.length}: Бүлэг үүсгэж байна...`);

      // Helper function to retry fetch with exponential backoff
      const fetchWithRetry = async (
        url: string,
        options: RequestInit,
        maxRetries = 3
      ): Promise<Response> => {
        let lastError: any;

        for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // Reduced to 30s to prevent hangs

            // eslint-disable-next-line no-await-in-loop
            const response = await fetch(url, {
              ...options,
              signal: controller.signal,
            });

            clearTimeout(timeoutId);
            return response;
          } catch (error: any) {
            lastError = error;

            // Don't retry on abort (timeout)
            if (error?.name === 'AbortError') {
              throw new Error('Request timeout - server took too long to respond (120s)');
            }

            // Check if it's a connection error that we should retry
            const isRetryable =
              error?.message?.includes('Failed to fetch') ||
              error?.message?.includes('ERR_CONNECTION_RESET') ||
              error?.message?.includes('network') ||
              error?.code === 'UND_ERR_CONNECT_TIMEOUT';

            if (isRetryable && attempt < maxRetries) {
              const delay = Math.min(1000 * 2 ** (attempt - 1), 10000); // Exponential backoff: 1s, 2s, 4s (max 10s)
              console.log(
                `🔄 [Batch Upload] Retry attempt ${attempt}/${maxRetries} after ${delay}ms...`
              );
              // eslint-disable-next-line no-await-in-loop
              await new Promise((resolve) => setTimeout(resolve, delay));
              // eslint-disable-next-line no-continue
              continue;
            }

            // If not retryable or last attempt, throw
            throw error;
          }
        }

        throw lastError;
      };

      // Add timeout for batch upload
      let firstResponse: Response;
      try {
        firstResponse = await fetchWithRetry(`/api2/webtoon/comic/${comicId}/chapter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(firstPayload),
        });
      } catch (fetchError: any) {
        if (fetchError?.name === 'AbortError') {
          throw new Error('Request timeout - server took too long to respond (120s)');
        }
        console.error('❌ [Batch Upload] Fetch error after retries:', fetchError);
        throw new Error(`Network error: ${fetchError?.message || 'Failed to connect to server'}`);
      }

      if (!firstResponse.ok) {
        const errorText = await firstResponse.text().catch(() => 'Unknown error');
        console.error(`❌ [Batch Upload] Response error: ${firstResponse.status}`, errorText);
        throw new Error(`Batch 1 failed: ${firstResponse.status} ${firstResponse.statusText}`);
      }

      let firstResult: any;
      try {
        firstResult = await firstResponse.json();
      } catch (jsonError) {
        console.error('❌ [Batch Upload] JSON parse error:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!firstResult.success) {
        throw new Error(firstResult.error || 'First batch failed');
      }

      // Extract chapter ID from various possible response structures
      let chapterId =
        firstResult.data?._id ||
        firstResult.data?.id ||
        firstResult.chapter?._id ||
        firstResult.chapter?.id ||
        firstResult._id ||
        firstResult.id;

      // Try to convert ObjectId to string if needed
      if (chapterId && typeof chapterId === 'object' && chapterId.$oid) {
        chapterId = chapterId.$oid;
      }
      if (chapterId && typeof chapterId === 'object') {
        chapterId = String(chapterId);
      }

      if (!chapterId || chapterId === 'undefined') {
        throw new Error('Chapter ID not found in response');
      }
      setBatchProgress({ current: 1, total: batches.length });

      // Upload remaining batches if any (append to chapter)
      let successfulBatches = 1;
      let failedBatches = 0;

      for (let i = 1; i < batches.length; i += 1) {
        const batch = batches[i];
        setCurrentBatchInfo(
          `Batch ${i + 1}/${batches.length}: ${batch.length} зураг нэмж байна...`
        );

        try {
          const batchPayload = {
            images: batch,
            append: true, // Flag to append instead of replace
          };

          // eslint-disable-next-line no-await-in-loop
          // Helper function to retry fetch with exponential backoff
          const fetchBatchWithRetry = async (
            url: string,
            options: RequestInit,
            maxRetries = 2
          ): Promise<Response> => {
            let lastError: any;

            for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout - fail fast

                // eslint-disable-next-line no-await-in-loop
                const response = await fetch(url, {
                  ...options,
                  signal: controller.signal,
                });

                clearTimeout(timeoutId);
                return response;
              } catch (error: any) {
                lastError = error;

                if (error?.name === 'AbortError') {
                  throw new Error(`Batch ${i + 1} timeout (15s)`);
                }

                const isRetryable =
                  error?.message?.includes('Failed to fetch') ||
                  error?.message?.includes('ERR_CONNECTION_RESET') ||
                  error?.message?.includes('network');

                if (isRetryable && attempt < maxRetries) {
                  const delay = Math.min(1000 * 2 ** (attempt - 1), 5000); // 1s, 2s (max 5s)
                  console.log(
                    `🔄 [Chapter Update] Batch ${
                      i + 1
                    } retry ${attempt}/${maxRetries} after ${delay}ms...`
                  );
                  // eslint-disable-next-line no-await-in-loop
                  await new Promise((resolve) => setTimeout(resolve, delay));
                  // eslint-disable-next-line no-continue
                  continue;
                }

                throw error;
              }
            }

            throw lastError;
          };

          let batchResponse: Response;
          try {
            // eslint-disable-next-line no-await-in-loop
            batchResponse = await fetchBatchWithRetry(`/api2/webtoon/chapter/${chapterId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(batchPayload),
            });
          } catch (fetchError: any) {
            if (fetchError?.name === 'AbortError') {
              throw new Error(`Batch ${i + 1} timeout (15s)`);
            }
            console.error(
              `❌ [Chapter Update] Batch ${i + 1} fetch error after retries:`,
              fetchError
            );
            throw new Error(`Network error: ${fetchError?.message || 'Failed to connect'}`);
          }

          // eslint-disable-next-line no-await-in-loop
          let batchResult: any;
          try {
            // eslint-disable-next-line no-await-in-loop
            batchResult = await batchResponse.json();
          } catch (jsonError) {
            // eslint-disable-next-line no-await-in-loop
            const errorText = await batchResponse.text().catch(() => 'Unknown error');
            console.error(`❌ [Chapter Update] Batch ${i + 1} JSON parse error:`, errorText);
            throw new Error(`Invalid response: ${batchResponse.status}`);
          }

          if (!batchResponse.ok || !batchResult.success) {
            console.error(`❌ [Chapter Update] Batch ${i + 1} failed:`, batchResult);
            failedBatches += 1;
          } else {
            successfulBatches += 1;
          }
        } catch (error: any) {
          if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
            console.error(`⏱️ [Chapter Update] Batch ${i + 1} timeout - skipping`);
          } else {
            console.error(
              `❌ [Chapter Update] Batch ${i + 1} error - skipping:`,
              error?.message || error
            );
          }
          failedBatches += 1;
          // Continue with next batch instead of stopping
        }

        setBatchProgress({ current: i + 1, total: batches.length });

        // Small delay to prevent overwhelming server
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Show success message with stats
      const totalUploaded =
        successfulBatches * batchSize +
        (batches[batches.length - 1]?.length || 0) -
        failedBatches * batchSize;

      if (failedBatches === 0) {
        alert(
          `✅ Амжилттай!\n\nНийт ${images.length} зураг ${batches.length} batch-аар илгээгдлээ.`
        );
      } else {
        alert(
          `⚠️ Хэсэгчлэн амжилттай!\n\n` +
            `• Амжилттай: ${successfulBatches}/${batches.length} batches\n` +
            `• Алдаатай: ${failedBatches} batches\n` +
            `• Таамаглах дүн: ~${totalUploaded} зураг илгээгдсэн\n\n` +
            `Console-г шалгаж алдааг үзнэ үү.`
        );
      }

      setImageUrls(['']);
      setNextChapterNumber((prev) => prev + 1); // Auto-increment for next chapter
      setManualChapterNumber(false); // Reset to auto mode

      // Reset only title and description, keep the new chapter number
      setValue('title', '');
      setValue('description', '');

      const addAnother = window.confirm('Өөр бүлэг нэмэх үү?');
      if (!addAnother) {
        router.push(paths.webtoon.cms.chapters(comicId));
      }
    } catch (error: any) {
      console.error('❌ [Batch Upload] Error:', error);
      console.error('❌ [Batch Upload] Error name:', error?.name);
      console.error('❌ [Batch Upload] Error message:', error?.message);
      console.error('❌ [Batch Upload] Error stack:', error?.stack);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
          errorMessage =
            'Сүлжээний алдаа - серверт холбогдох боломжгүй байна. Интернет холболтоо шалгана уу.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Хугацаа хэтэрсэн - сервер хариу өгөхгүй байна. Дахин оролдоно уу.';
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      alert(`Batch upload алдаа: ${errorMessage}`);
    } finally {
      setUploadingBatch(false);
      setBatchProgress({ current: 0, total: 0 });
      setCurrentBatchInfo('');
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Filter out empty image URLs
      const validImages = imageUrls.filter((url) => url.trim() !== '');

      if (validImages.length === 0) {
        alert('Багадаа 1 зураг оруулна уу');
        return;
      }

      const payload = {
        chapterNumber: data.chapterNumber,
        title: data.title,
        images: validImages,
      };

      // Check payload size (rough estimate)
      const payloadSize = JSON.stringify(payload).length;
      const payloadMB = (payloadSize / (1024 * 1024)).toFixed(2);
      console.log(`Sending payload: ${validImages.length} images, ~${payloadMB}MB`);

      // Force batch upload for many images or large payloads (lower threshold to prevent connection resets)
      if (validImages.length >= 10 || payloadSize > 2 * 1024 * 1024) {
        // 10+ images or >2MB
        // For large payloads (20+ images or >5MB), force batch upload automatically
        if (validImages.length >= 20 || payloadSize > 5 * 1024 * 1024) {
          console.log(
            `📦 [Auto] Using batch upload for ${validImages.length} images (~${payloadMB}MB)`
          );
          await uploadInBatches(data, validImages, 5); // Very small batch size to prevent hangs: 10 instead of 15
          return;
        }

        // For medium payloads, ask but strongly recommend batch
        const useBatch = window.confirm(
          `📦 Batch Upload санал болгож байна:\n\n` +
            `Payload: ${payloadMB}MB (${validImages.length} зураг)\n\n` +
            `Batch upload ашиглах уу?\n` +
            `• ТИЙМ (Зөвлөмж): Зургуудыг 10 зургийн batch-аар хуваан илгээнэ\n` +
            `  → Илүү найдвартай, алдаагүй\n` +
            `  → 50+ зураг ч асуудалгүй\n\n` +
            `• ҮГҮЙ: Бүгдийг зэрэг илгээх\n` +
            `  → Том payload-д алдаа гарч болзошгүй ⚠️`
        );

        if (useBatch) {
          await uploadInBatches(data, validImages, 5); // Very small batch size to prevent hangs
          return;
        }
      }

      // Warn if still trying single upload with large payload
      if (payloadSize > 50 * 1024 * 1024) {
        const proceed = window.confirm(
          `⚠️ АНХААР: Payload хэмжээ ${payloadMB}MB байна!\n\n` +
            `Энэ нь маш их магадлалтайгаар алдаа гаргана.\n\n` +
            `Batch upload ашиглахыг ЗӨВЛӨЖ байна.\n\n` +
            `Үргэлжлүүлэх үү?`
        );
        if (!proceed) return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Reduced to 30s to prevent hangs // 2 minute timeout

      const response = await fetch(`/api2/webtoon/comic/${comicId}/chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
        setImageUrls(['']);
        setNextChapterNumber((prev) => prev + 1); // Auto-increment for next chapter

        // Reset only title and description, keep the new chapter number
        setValue('title', '');
        setValue('description', '');

        const addAnother = window.confirm('Өөр бүлэг нэмэх үү?');
        if (!addAnother) {
          router.push(paths.webtoon.cms.chapters(comicId));
        }
      } else {
        alert(`Алдаа: ${result.error || result.message || 'Тодорхойгүй алдаа гарлаа'}`);
      }
    } catch (error) {
      console.error('Create chapter error:', error);

      // Provide specific error messages
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          alert(
            `Хугацаа хэтэрсэн!\n\n` +
              `Payload хэтэрхий том байна. Дараах арга хэмжээ авна уу:\n\n` +
              `1. Зургийн тоог багасгах (одоо ${
                imageUrls.filter((u) => u.trim()).length
              } зураг)\n` +
              `2. Хэд хэдэн бүлэгт хуваах\n` +
              `3. Зургийн чанарыг бага зэрэг бууруулах`
          );
        } else if (error.message === 'Failed to fetch') {
          alert(
            `Сүлжээний алдаа!\n\n` +
              `Боломжит шалтгаан:\n` +
              `• Payload хэтэрхий том (${imageUrls.filter((u) => u.trim()).length} зураг)\n` +
              `• Серверийн request size limit хэтэрсэн\n` +
              `• Интернет холболт тасарсан\n\n` +
              `Зөвлөмж:\n` +
              `1. Зургийн тоог багасгах (< 20 зураг)\n` +
              `2. Хэд хэдэн бүлэгт хуваах\n` +
              `3. Интернет холболтоо шалгах`
          );
        } else {
          alert(`Алдаа: ${error.message}`);
        }
      } else {
        alert('Тодорхойгүй алдаа гарлаа. Дахин оролдоно уу.');
      }
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
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Бүлгийн мэдээлэл
              </Typography>

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

                <RHFTextField
                  name="description"
                  label="Тайлбар (заавал биш)"
                  placeholder="Бүлгийн товч тайлбар..."
                  multiline
                  rows={3}
                />
              </Stack>
            </Card>

            {/* Images Card */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Бүлгийн зургууд
              </Typography>

              <UploadMultiImage
                value={imageUrls.filter((url) => url.trim() !== '')}
                onChange={(urls) => setImageUrls(urls.length > 0 ? urls : [''])}
                helperText="PNG, JPG, GIF файл тус бүр max 20MB. Зургууд автоматаар багасгагдана."
                maxFiles={50}
                maxSize={20971520}
              />
            </Card>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Comic Info */}
            {comicTitle && (
              <Card sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                <Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
                  <Iconify
                    icon="carbon:book"
                    sx={{ color: theme.palette.primary.main, fontSize: 24 }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Комик
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {comicTitle}
                </Typography>
              </Card>
            )}

            {/* Tips Card */}
            <Card sx={{ p: 3, bgcolor: alpha(theme.palette.info.main, 0.04) }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                <Iconify icon="carbon:idea" sx={{ color: theme.palette.info.main, fontSize: 24 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Зөвлөмж
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1}>
                  <Iconify
                    icon="carbon:checkmark-filled"
                    sx={{ color: 'success.main', fontSize: 18, mt: 0.2 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Зургууд автоматаар багасгагдаж, чанар хадгалагдана
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Iconify
                    icon="carbon:checkmark-filled"
                    sx={{ color: 'success.main', fontSize: 18, mt: 0.2 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Олон зураг зэрэг оруулж болно (max 50)
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Iconify
                    icon="carbon:rocket"
                    sx={{ color: 'info.main', fontSize: 18, mt: 0.2 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    40MB+ payload: Автомат batch upload санал болгоно
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Iconify
                    icon="carbon:warning-filled"
                    sx={{ color: 'warning.main', fontSize: 18, mt: 0.2 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Batch upload: 50+ зургийг найдвартай илгээнэ
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Iconify
                    icon="carbon:checkmark-filled"
                    sx={{ color: 'success.main', fontSize: 18, mt: 0.2 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Дарааллыг солих товчоор эмх цэгцтэй болгоно
                  </Typography>
                </Stack>
              </Stack>
            </Card>

            {/* Batch Upload Progress */}
            {uploadingBatch && (
              <Card
                sx={{
                  p: 3,
                  bgcolor: alpha(theme.palette.info.main, 0.08),
                  border: `2px solid ${theme.palette.info.main}`,
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Iconify icon="carbon:cloud-upload" sx={{ color: 'info.main', fontSize: 28 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'info.main' }}>
                        Batch Upload явагдаж байна...
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        {currentBatchInfo ||
                          `Batch ${batchProgress.current} / {batchProgress.total}`}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {Math.round((batchProgress.current / batchProgress.total) * 100)}% дууссан
                      </Typography>
                    </Box>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(batchProgress.current / batchProgress.total) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.info.main, 0.12),
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontStyle: 'italic' }}
                  >
                    Upload дуустал хүлээнэ үү
                  </Typography>
                </Stack>
              </Card>
            )}

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
                  loading={isSubmitting || uploadingBatch}
                  startIcon={<Iconify icon="carbon:checkmark" />}
                  sx={{
                    bgcolor: theme.palette.success.main,
                    '&:hover': {
                      bgcolor: theme.palette.success.dark,
                    },
                  }}
                >
                  {uploadingBatch ? 'Уншиж байна...' : 'Хадгалах'}
                </LoadingButton>

                <Button
                  fullWidth
                  size="large"
                  variant="outlined"
                  color="inherit"
                  onClick={() => router.push(paths.webtoon.cms.chapters(comicId))}
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
                    setValue('description', '');
                    setImageUrls(['']);
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
