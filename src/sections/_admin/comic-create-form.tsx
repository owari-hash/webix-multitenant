'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { UploadImage } from 'src/components/upload';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const GENRES = [
  { value: 'action', label: 'Акшн' },
  { value: 'romance', label: 'Романтик' },
  { value: 'comedy', label: 'Инээдмийн' },
  { value: 'drama', label: 'Драм' },
  { value: 'fantasy', label: 'Уран зөгнөлт' },
  { value: 'horror', label: 'Аймшигт' },
  { value: 'mystery', label: 'Нууцлаг' },
  { value: 'thriller', label: 'Сүжигтэй' },
  { value: 'adventure', label: 'Адал явдалт' },
  { value: 'slice-of-life', label: 'Амьдралын' },
  { value: 'supernatural', label: 'Ер бусын' },
  { value: 'historical', label: 'Түүхэн' },
];

const STATUS_OPTIONS = [
  { value: 'ongoing', label: 'Үргэлжилж байгаа' },
  { value: 'completed', label: 'Дууссан' },
  { value: 'hiatus', label: 'Түр зогссон' },
];

export default function ComicCreateForm() {
  const theme = useTheme();
  const router = useRouter();

  const ComicSchema = Yup.object().shape({
    title: Yup.string().required('Гарчиг оруулна уу'),
    description: Yup.string()
      .required('Тайлбар оруулна уу')
      .min(20, 'Тайлбар багадаа 20 тэмдэгт байх ёстой'),
    genre: Yup.array().min(1, 'Багадаа 1 төрөл сонгоно уу').required('Төрөл сонгоно уу'),
    status: Yup.string().required('Төлөв сонгоно уу'),
    coverImage: Yup.string()
      .required('Хавтасны зураг оруулна уу')
      .test('valid-url-or-data-uri', 'Буруу URL хаяг эсвэл зураг', (value) => {
        if (!value) return false;
        // Check if it's a data URI (base64)
        if (value.startsWith('data:image/')) return true;
        // Check if it's a valid URL
        try {
          const url = new URL(value);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      }),
  });

  const defaultValues = {
    title: '',
    description: '',
    genre: [],
    status: 'ongoing',
    coverImage: '',
  };

  const methods = useForm({
    resolver: yupResolver(ComicSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const coverImage = watch('coverImage');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        genre: data.genre,
        status: data.status,
      };

      console.log('Sending comic payload:', payload);

      const response = await fetch('/api2/webtoon/comic', {
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
        const comicId = result.comic?.id || result.comic?._id;

        // Ask if they want to add chapters
        const addChapters = window.confirm('Комик амжилттай нэмэгдлээ! Одоо бүлэг нэмэх үү?');

        reset();

        if (addChapters && comicId) {
          router.push(paths.webtoon.cms.createChapter(comicId));
        } else {
          router.push(paths.webtoon.cms.comics);
        }
      } else {
        alert(`Алдаа: ${result.error || result.message || 'Тодорхойгүй алдаа гарлаа'}`);
      }
    } catch (error) {
      console.error('Create comic error:', error);
      alert(`Сүлжээний алдаа: ${error instanceof Error ? error.message : 'Дахин оролдоно уу.'}`);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Basic Info Card */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Үндсэн мэдээлэл
              </Typography>

              <Stack spacing={3}>
                <RHFTextField
                  name="title"
                  label="Комикийн гарчиг"
                  placeholder="Жишээ нь: Solo Leveling"
                />

                <RHFTextField
                  name="description"
                  label="Тайлбар"
                  placeholder="Комикийн товч агуулга..."
                  multiline
                  rows={4}
                />
              </Stack>
            </Card>

            {/* Category & Status Card */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Ангилал ба төлөв
              </Typography>

              <Stack spacing={3}>
                <RHFAutocomplete
                  name="genre"
                  label="Төрөл (олон сонгох боломжтой)"
                  multiple
                  freeSolo={false}
                  options={GENRES.map((g) => g.value)}
                  getOptionLabel={(option: string) => {
                    const found = GENRES.find((g) => g.value === option);
                    return found ? found.label : option;
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option: string, index) => {
                      const found = GENRES.find((g) => g.value === option);
                      return (
                        <Box
                          component="span"
                          {...getTagProps({ index })}
                          key={option}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: 'primary.main',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          {found ? found.label : option}
                        </Box>
                      );
                    })
                  }
                />

                <RHFSelect name="status" label="Төлөв">
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>

            {/* Cover Image Card */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Хавтасны зураг
              </Typography>

              <UploadImage
                value={coverImage}
                onChange={(url) => {
                  methods.setValue('coverImage', url, { shouldValidate: true });
                }}
                helperText="PNG, JPG, GIF (max 5MB)"
                ratio="3/4"
              />

              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', mt: 2, display: 'block', textAlign: 'center' }}
              >
                Эсвэл URL хаяг эсвэл Base64 оруулах:
              </Typography>

              <RHFTextField
                name="coverImage"
                placeholder="https://example.com/image.jpg эсвэл data:image/jpeg;base64,..."
                size="small"
                sx={{ mt: 1 }}
                helperText="HTTP URL эсвэл data:image/... base64 хаяг оруулна уу"
              />
            </Card>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
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
                  onClick={() => router.push(paths.webtoon.cms.comics)}
                  startIcon={<Iconify icon="carbon:arrow-left" />}
                >
                  Буцах
                </Button>

                <Button
                  fullWidth
                  size="large"
                  variant="soft"
                  color="error"
                  onClick={() => reset()}
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
                  • Гарчиг товч бөгөөд сонирхолтой байх
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  • Тайлбар нь 100-300 үгийн хооронд байхыг зөвлөж байна
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  • Хавтасны зураг 3:4 харьцаатай байх (жишээ нь: 600x800px)
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  • Шошгыг зөв сонгосноор хэрэглэгчид илүү амархан олох боломжтой
                </Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
