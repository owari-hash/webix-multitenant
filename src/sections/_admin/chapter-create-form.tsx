'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
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

  const ChapterSchema = Yup.object().shape({
    chapterNumber: Yup.number()
      .required('Бүлгийн дугаар оруулна уу')
      .positive('Эерэг тоо оруулна уу')
      .integer('Бүхэл тоо оруулна уу'),
    title: Yup.string().required('Гарчиг оруулна уу'),
    description: Yup.string(),
  });

  const defaultValues = {
    chapterNumber: 1,
    title: '',
    description: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChapterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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

      console.log('Sending payload:', payload);

      const response = await fetch(`/api2/webtoon/comic/${comicId}/chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

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

      console.log('Response result:', result);

      if (result.success) {
        alert('Бүлэг амжилттай нэмэгдлээ!');
        reset();
        setImageUrls(['']);
        // Option to add another chapter or go back
        const addAnother = window.confirm('Өөр бүлэг нэмэх үү?');
        if (!addAnother) {
          router.push(paths.webtoon.cms.chapters(comicId));
        }
      } else {
        alert(`Алдаа: ${result.error || result.message || 'Тодорхойгүй алдаа гарлаа'}`);
      }
    } catch (error) {
      console.error('Create chapter error:', error);
      alert(`Сүлжээний алдаа: ${error instanceof Error ? error.message : 'Дахин оролдоно уу.'}`);
    }
  });

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
                <RHFTextField
                  name="chapterNumber"
                  label="Бүлгийн дугаар"
                  type="number"
                  placeholder="1"
                  helperText="Жишээ нь: 1, 2, 3..."
                />

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
                helperText="PNG, JPG, GIF файл тус бүр max 5MB"
              />

              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', mt: 3, mb: 1, display: 'block' }}
              >
                Эсвэл зургийн URL хаягууд эсвэл Base64 оруулах (шугам тус бүрт нэг):
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="https://example.com/page1.jpg&#10;data:image/jpeg;base64,/9j/4AAQ...&#10;https://example.com/page3.jpg"
                value={imageUrls.join('\n')}
                onChange={(e) => {
                  const urls = e.target.value.split('\n').filter((url) => url.trim() !== '');
                  setImageUrls(urls.length > 0 ? urls : ['']);
                }}
                helperText="HTTP URL эсвэл data:image/... base64 хаяг оруулна уу"
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
                    reset();
                    setImageUrls(['']);
                  }}
                  startIcon={<Iconify icon="carbon:reset" />}
                >
                  Цэвэрлэх
                </Button>
              </Stack>
            </Card>

            {/* Tips Card */}
            <Card sx={{ p: 3, bgcolor: alpha(theme.palette.info.main, 0.08) }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                <Iconify
                  icon="carbon:information"
                  sx={{ color: theme.palette.info.main, fontSize: 24 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Зөвлөмж
                </Typography>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  • Зургуудыг дарааллын дагуу оруулна уу
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  • Зургийн өргөн 800-1000px байхыг зөвлөж байна
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  • Багадаа 5-10 зураг оруулах хэрэгтэй
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  • JPG эсвэл PNG форматтай байх
                </Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
