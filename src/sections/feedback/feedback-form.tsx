'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import {
  feedbackApi,
  FeedbackType,
  FeedbackPriority,
  CreateFeedbackData,
} from 'src/utils/feedback-api';

// ----------------------------------------------------------------------

type Props = {
  onSuccess?: () => void;
};

export default function FeedbackForm({ onSuccess }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  type FormValues = {
    type: FeedbackType;
    title: string;
    content: string;
    priority?: FeedbackPriority;
  };

  const FeedbackSchema: Yup.ObjectSchema<FormValues> = Yup.object().shape({
    type: Yup.mixed<FeedbackType>()
      .oneOf(['санал', 'хүсэл', 'гомдол'], 'Төрөл сонгох шаардлагатай')
      .required('Төрөл сонгох шаардлагатай'),
    title: Yup.string()
      .required('Гарчиг шаардлагатай')
      .min(3, 'Гарчиг хамгийн багадаа 3 тэмдэгт байх ёстой')
      .max(200, 'Гарчиг хамгийн ихдээ 200 тэмдэгт байх ёстой'),
    content: Yup.string()
      .required('Агуулга шаардлагатай')
      .min(10, 'Агуулга хамгийн багадаа 10 тэмдэгт байх ёстой')
      .max(5000, 'Агуулга хамгийн ихдээ 5000 тэмдэгт байх ёстой'),
    priority: Yup.mixed<FeedbackPriority>().oneOf(['low', 'medium', 'high', 'urgent']).optional(),
  });

  const defaultValues: FormValues = {
    type: 'санал',
    title: '',
    content: '',
    priority: 'medium',
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(FeedbackSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const feedbackData: CreateFeedbackData = {
        type: data.type,
        title: data.title.trim(),
        content: data.content.trim(),
        priority: data.priority || 'medium',
      };

      await feedbackApi.createFeedback(feedbackData);

      enqueueSnackbar('Санал хүсэл гомдол амжилттай илгээгдлээ', { variant: 'success' });
      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('Create feedback error:', error);
      enqueueSnackbar(error?.message || 'Санал хүсэл гомдол илгээхэд алдаа гарлаа', {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Typography variant="h6">Санал хүсэл гомдол илгээх</Typography>

        <RHFSelect name="type" label="Төрөл *">
          <MenuItem value="санал">Санал</MenuItem>
          <MenuItem value="хүсэл">Хүсэл</MenuItem>
          <MenuItem value="гомдол">Гомдол</MenuItem>
        </RHFSelect>

        <RHFTextField name="title" label="Гарчиг *" placeholder="Санал хүсэл гомдолын гарчиг" />

        <RHFTextField
          name="content"
          label="Агуулга *"
          placeholder="Дэлгэрэнгүй тайлбар..."
          multiline
          rows={6}
        />

        <RHFSelect name="priority" label="Анхаарал">
          <MenuItem value="low">Бага</MenuItem>
          <MenuItem value="medium">Дунд</MenuItem>
          <MenuItem value="high">Өндөр</MenuItem>
          <MenuItem value="urgent">Яаралтай</MenuItem>
        </RHFSelect>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          fullWidth
        >
          Илгээх
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
