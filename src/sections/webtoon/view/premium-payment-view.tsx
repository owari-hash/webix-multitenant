'use client';

import { useState, useEffect, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/contexts/auth-context';
import { useSnackbar } from 'src/components/snackbar';
import { qpayApi, InvoiceResponse } from 'src/utils/qpay-api';
import QPayPaymentStatus from 'src/sections/payment/qpay-payment-status';
import { backendRequest } from 'src/utils/backend-api';

// ----------------------------------------------------------------------

type PaymentMethod = 'card' | 'qpay' | 'bank';

interface PremiumPlan {
  name: string;
  label: string;
  price: number;
  duration: number;
  period: 'month' | 'year';
  discount?: string;
  isActive: boolean;
  order: number;
}

export default function PremiumPaymentView() {
  const theme = useTheme();
  const router = useRouter();
  const { user, authenticated, checkUser } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qpay');
  const [processing, setProcessing] = useState(false);
  const [qpayInvoice, setQpayInvoice] = useState<InvoiceResponse | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Fetch premium plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        console.log('Fetching premium plans...');
        const response = await backendRequest<{ plans: PremiumPlan[] }>(
          '/organizations/premium-plans'
        );
        console.log('Premium plans response:', response);

        if (response.success && response.data?.plans && Array.isArray(response.data.plans)) {
          const activePlans = response.data.plans
            .filter((p) => p.isActive !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          console.log('Active premium plans:', activePlans);

          if (activePlans.length > 0) {
            setPlans(activePlans);
            setSelectedPlan(activePlans[0].name);
          } else {
            console.warn('No active plans found');
            setPlans([]);
          }
        } else {
          console.warn('Invalid response format or no plans:', response);
          setPlans([]);
        }
      } catch (error) {
        console.error('Failed to fetch premium plans:', error);
        setPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  // Get selected plan details
  const getSelectedPlanDetails = () => plans.find((p) => p.name === selectedPlan) || plans[0];

  const handlePayment = async () => {
    if (!authenticated) {
      enqueueSnackbar('Та эхлээд нэвтэрнэ үү!', { variant: 'warning' });
      return;
    }

    if (!selectedPlan) {
      enqueueSnackbar('Багц сонгоно уу!', { variant: 'warning' });
      return;
    }

    // If QPay, create invoice
    if (paymentMethod === 'qpay') {
      setProcessing(true);
      try {
        const currentPlan = getSelectedPlanDetails();
        if (!currentPlan) {
          enqueueSnackbar('Багц сонгоно уу!', { variant: 'warning' });
          setProcessing(false);
          return;
        }
        const invoiceData = {
          amount: currentPlan.price,
          currency: 'MNT',
          description: `Premium ${currentPlan.label} - ${currentPlan.duration} ${
            currentPlan.period === 'month' ? 'сар' : 'жил'
          } - ${user?.email || ''}`,
          sender_invoice_no: `PREMIUM-${currentPlan.name}-${Date.now()}`,
        };

        const result = await qpayApi.createInvoice(invoiceData);
        // Map response to expected format
        const invoiceDataFromResponse: any = result.data?.invoice || result.invoice || {};

        // Extract QR image - it might be in data.qr_image or invoice.qr_image
        const qrImage =
          result.data?.qr_image || invoiceDataFromResponse?.qr_image || result.qr_image || null;

        // Ensure QR image has data: prefix if it's base64
        let qrImageFormatted: string | null = null;
        if (qrImage) {
          qrImageFormatted = qrImage.startsWith('data:')
            ? qrImage
            : `data:image/png;base64,${qrImage}`;
        }

        // Extract QR code text
        const qrCode =
          result.data?.qr_code || invoiceDataFromResponse?.qr_code || result.qr_code || null;

        const qrText =
          invoiceDataFromResponse?.qr_text ||
          invoiceDataFromResponse?.qr_code ||
          result.data?.qr_code ||
          result.data?.qr_text ||
          result.qr_text ||
          qrCode ||
          null;

        console.log('🔍 QPay Response Debug:', {
          'result.data': result.data,
          'result.data.qr_image': result.data?.qr_image?.substring(0, 50),
          'invoiceDataFromResponse.qr_image': invoiceDataFromResponse?.qr_image?.substring(0, 50),
          qrImageFormatted: qrImageFormatted?.substring(0, 50),
          qrCode: qrCode?.substring(0, 50),
        });

        const mappedInvoice = {
          invoice_id: result.data?.id || result.data?.invoice_id || result.invoice_id,
          qr_code: qrCode,
          qr_image: qrImageFormatted,
          qr_text: qrText,
          urls: result.data?.urls || [],
          invoice: {
            invoice_id:
              invoiceDataFromResponse?.invoice_id ||
              result.data?.id ||
              result.data?.invoice_id ||
              result.invoice_id,
            qpay_invoice_id:
              invoiceDataFromResponse?.qpay_invoice_id ||
              result.data?.id ||
              result.data?.invoice_id ||
              result.invoice_id,
            merchant_id:
              invoiceDataFromResponse?.merchant_id || result.data?.invoice?.merchant_id || '',
            amount: invoiceDataFromResponse?.amount || invoiceData.amount,
            currency: invoiceDataFromResponse?.currency || invoiceData.currency || 'MNT',
            description: invoiceDataFromResponse?.description || invoiceData.description || '',
            status: (invoiceDataFromResponse?.status || 'PENDING') as
              | 'PENDING'
              | 'PAID'
              | 'CANCELLED',
            qr_text: qrText,
            qr_image: qrImageFormatted,
            qr_code: qrCode,
            createdAt: invoiceDataFromResponse?.createdAt || new Date().toISOString(),
            updatedAt: invoiceDataFromResponse?.updatedAt || new Date().toISOString(),
          },
        };
        setQpayInvoice(mappedInvoice as any);
        enqueueSnackbar('Нэхэмжлэх амжилттай үүслээ', { variant: 'success' });
      } catch (error: any) {
        console.error('QPay invoice creation error:', error);
        enqueueSnackbar(error?.message || 'Нэхэмжлэх үүсгэхэд алдаа гарлаа', { variant: 'error' });
      } finally {
        setProcessing(false);
      }
      return;
    }

    // For other payment methods (card, bank)
    setProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const token = localStorage.getItem('token');
      const currentPlan = getSelectedPlanDetails();
      const response = await fetch('/api2/payment/premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: currentPlan.name,
          paymentMethod,
          amount: currentPlan.price,
          ...(paymentMethod === 'card' && {
            cardNumber,
            cardName,
            expiryDate,
            cvv,
          }),
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/webtoon');
        window.location.reload();
      } else {
        enqueueSnackbar(result.message || 'Төлбөр төлөхөд алдаа гарлаа. Дахин оролдоно уу.', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      enqueueSnackbar('Сүлжээний алдаа. Дахин оролдоно уу.', { variant: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const handleQPayPaymentComplete = async () => {
    try {
      // Update premium status on backend
      const token = localStorage.getItem('token');
      const currentPlan = getSelectedPlanDetails();
      const response = await fetch('/api2/payment/premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: currentPlan.name,
          paymentMethod: 'qpay',
          amount: currentPlan.price,
          invoiceId: qpayInvoice?.invoice_id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh user data to update premium status
        await checkUser();
        setTimeout(() => {
          router.push('/webtoon');
        }, 2000);
      } else {
        enqueueSnackbar(result.message || 'Premium эрх шинэчлэхэд алдаа гарлаа', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Premium status update error:', error);
      enqueueSnackbar('Premium эрх шинэчлэхэд алдаа гарлаа', { variant: 'error' });
    }
  };

  const handleQPayCancel = () => {
    setQpayInvoice(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 10 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Iconify icon="mdi:crown" width={48} sx={{ color: 'warning.main' }} />
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            Premium эрх авах
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Бүх бүлгүүдэд хязгааргүй хандаж, онцгой контентыг үзээрэй
        </Typography>
      </Box>

      {/* Benefits */}
      <Card sx={{ p: 4, mb: 5, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Premium эрхийн давуу тал:
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          {[
            { icon: 'mdi:infinity', text: 'Бүх бүлгүүдэд хязгааргүй хандах' },
            { icon: 'mdi:rocket-launch', text: 'Шинэ бүлгүүдийг эрт үзэх' },
            { icon: 'mdi:advertisements-off', text: 'Зар сурталчилгаагүй' },
            { icon: 'mdi:diamond-stone', text: 'Онцгой контентод хандах' },
            { icon: 'mdi:download', text: 'Оффлайн уншихаар татах' },
            { icon: 'mdi:quality-high', text: 'HD зураг' },
          ].map((benefit, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center">
              <Iconify icon={benefit.icon} width={28} sx={{ color: 'primary.main' }} />
              <Typography variant="body1">{benefit.text}</Typography>
            </Stack>
          ))}
        </Box>
      </Card>

      {/* Main Content */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 4,
        }}
      >
        {/* Left Column - Payment Form */}
        <Stack spacing={4}>
          {/* Plan Selection */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Багц сонгох
            </Typography>
            {loadingPlans && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Багцууд ачааллаж байна...
                </Typography>
              </Box>
            )}
            {!loadingPlans && plans.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="error">
                  Багц олдсонгүй
                </Typography>
              </Box>
            )}
            {!loadingPlans && plans.length > 0 && (
              <Stack spacing={2}>
                {plans
                  .filter((plan) => plan.isActive !== false)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((planOption) => {
                    const isSelected = selectedPlan === planOption.name;
                    return (
                      <Box
                        key={planOption.name}
                        onClick={() => setSelectedPlan(planOption.name)}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          cursor: 'pointer',
                          border: `2px solid ${
                            isSelected
                              ? theme.palette.primary.main
                              : alpha(theme.palette.divider, 0.2)
                          }`,
                          bgcolor: isSelected
                            ? alpha(theme.palette.primary.main, 0.08)
                            : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                          },
                        }}
                      >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {planOption.label}
                            </Typography>
                            {planOption.discount && (
                              <Typography
                                variant="caption"
                                color="success.main"
                                sx={{ fontWeight: 600 }}
                              >
                                ✨ {planOption.discount}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              {planOption.duration} {planOption.period === 'month' ? 'сар' : 'жил'}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography
                              variant="h5"
                              sx={{ fontWeight: 700, color: 'primary.main' }}
                            >
                              ₮{planOption.price.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              / {planOption.period === 'month' ? 'сар' : 'жил'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    );
                  })}
              </Stack>
            )}
          </Card>

          {/* Payment Method */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Төлбөрийн хэрэгсэл
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPaymentMethod(e.target.value as PaymentMethod)
              }
            >
              <Stack spacing={2}>
                <FormControlLabel
                  value="qpay"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:qrcode" width={24} />
                      <Typography>QPay</Typography>
                    </Stack>
                  }
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
                    ...(paymentMethod === 'qpay' && {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: theme.palette.primary.main,
                    }),
                  }}
                />
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:credit-card" width={24} />
                      <Typography>Карт</Typography>
                    </Stack>
                  }
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
                    ...(paymentMethod === 'card' && {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: theme.palette.primary.main,
                    }),
                  }}
                />
                <FormControlLabel
                  value="bank"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:bank" width={24} />
                      <Typography>Банкны шилжүүлэг</Typography>
                    </Stack>
                  }
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
                    ...(paymentMethod === 'bank' && {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: theme.palette.primary.main,
                    }),
                  }}
                />
              </Stack>
            </RadioGroup>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <Stack spacing={2} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Картын дугаар"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCardNumber(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <Stack direction="row" spacing={0.5}>
                        <Iconify icon="logos:visa" width={32} />
                        <Iconify icon="logos:mastercard" width={32} />
                      </Stack>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Картын эзэмшигчийн нэр"
                  placeholder="JOHN DOE"
                  value={cardName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCardName(e.target.value.toUpperCase())
                  }
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    label="Дуусах хугацаа"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setExpiryDate(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="CVV"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCvv(e.target.value)}
                    inputProps={{ maxLength: 3 }}
                  />
                </Stack>
              </Stack>
            )}

            {/* QPay Invoice Status */}
            {paymentMethod === 'qpay' && qpayInvoice && (
              <Box sx={{ mt: 3 }}>
                <QPayPaymentStatus
                  invoice={qpayInvoice.invoice}
                  urls={qpayInvoice.urls || []}
                  onPaymentComplete={handleQPayPaymentComplete}
                  onCancel={handleQPayCancel}
                />
              </Box>
            )}

            {/* QPay Info - Show before invoice creation */}
            {paymentMethod === 'qpay' && !qpayInvoice && (
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  bgcolor: 'background.neutral',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Iconify
                  icon="mdi:qrcode-scan"
                  width={120}
                  sx={{ mb: 2, color: 'text.secondary' }}
                />
                <Typography variant="body2" color="text.secondary">
                  &quot;Төлбөр төлөх&quot; товч дарахад QPay QR код үүснэ
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  QR код уншуулаад төлбөрөө төлсний дараа автоматаар Premium эрх идэвхжинэ
                </Typography>
              </Box>
            )}

            {/* Bank Info */}
            {paymentMethod === 'bank' && (
              <Box sx={{ mt: 3, p: 3, bgcolor: 'background.neutral', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Банкны мэдээлэл:
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Банк:</strong> Хаан банк
                  </Typography>
                  <Typography variant="body2">
                    <strong>Дансны дугаар:</strong> 5123456789
                  </Typography>
                  <Typography variant="body2">
                    <strong>Дансны нэр:</strong> Webtoon Platform LLC
                  </Typography>
                  <Typography variant="body2">
                    <strong>Гүйлгээний утга:</strong> Premium-{user?.email || '[Таны имэйл]'}
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 2 }}
                >
                  Шилжүүлэг хийсний дараа 1-2 цагийн дотор Premium эрх идэвхжинэ
                </Typography>
              </Box>
            )}
          </Card>
        </Stack>

        {/* Right Column - Summary */}
        <Card sx={{ p: 3, height: 'fit-content', position: 'sticky', top: 100 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Төлбөрийн дэлгэрэнгүй
          </Typography>

          <Stack spacing={2} divider={<Divider />}>
            {(() => {
              const currentPlan = getSelectedPlanDetails();
              if (!currentPlan) return null;
              return (
                <>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Багц
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {currentPlan.label}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Төлбөрийн хэрэгсэл
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {paymentMethod === 'qpay' && 'QPay'}
                        {paymentMethod === 'card' && 'Карт'}
                        {paymentMethod === 'bank' && 'Банк'}
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Нийт дүн</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ₮{currentPlan.price.toLocaleString()}
                    </Typography>
                  </Stack>
                </>
              );
            })()}
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            loading={processing}
            onClick={handlePayment}
            disabled={qpayInvoice !== null}
            startIcon={<Iconify icon="mdi:lock" />}
            sx={{ mt: 3 }}
          >
            {qpayInvoice ? 'Нэхэмжлэх үүссэн' : 'Төлбөр төлөх'}
          </LoadingButton>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.back()}
            sx={{ mt: 2 }}
            disabled={processing}
          >
            Буцах
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 2, textAlign: 'center' }}
          >
            🔒 Таны төлбөрийн мэдээлэл аюулгүй хадгалагдана
          </Typography>
        </Card>
      </Box>
    </Container>
  );
}
