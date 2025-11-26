'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { qpayApi, CreateInvoiceData } from 'src/utils/qpay-api';

// ----------------------------------------------------------------------

type Props = {
  onInvoiceCreated: (invoice: any) => void;
};

export default function QPayInvoiceForm({ onInvoiceCreated }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const InvoiceSchema = Yup.object().shape({
    amount: Yup.string()
      .required('Дүн шаардлагатай')
      .test('is-number', 'Дүн тоо байх ёстой', (value) => {
        if (!value) return false;
        const num = Number(value);
        return !Number.isNaN(num) && Number.isFinite(num);
      })
      .test('min-value', 'Дүн хамгийн багадаа 1 байх ёстой', (value) => {
        if (!value) return false;
        const num = Number(value);
        return num >= 1;
      }),
    currency: Yup.string().default('MNT'),
    description: Yup.string(),
  });

  type FormValues = {
    amount: string;
    currency: string;
    description: string | undefined;
  };

  const defaultValues: FormValues = {
    amount: '',
    currency: 'MNT',
    description: undefined,
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(InvoiceSchema) as any,
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const invoiceData: CreateInvoiceData = {
        amount: Number(data.amount),
        currency: data.currency || 'MNT',
        description: data.description || 'Төлбөрийн нэхэмжлэх',
      };

      const result = await qpayApi.createInvoice(invoiceData);

      enqueueSnackbar('Нэхэмжлэх амжилттай үүслээ', { variant: 'success' });
      reset();
      onInvoiceCreated(result);
    } catch (error: any) {
      console.error('Create invoice error:', error);
      enqueueSnackbar(error?.message || 'Нэхэмжлэх үүсгэхэд алдаа гарлаа', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Typography variant="h6">QPay Нэхэмжлэх Үүсгэх</Typography>

        <RHFTextField name="amount" label="Дүн (MNT) *" type="number" placeholder="10000" />

        <RHFTextField
          name="description"
          label="Тайлбар"
          placeholder="Төлбөрийн нэхэмжлэх"
          multiline
          rows={3}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          fullWidth
        >
          Нэхэмжлэх Үүсгэх
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
