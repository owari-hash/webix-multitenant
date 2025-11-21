'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSuccess?: VoidFunction;
};

type PlanType = 'monthly' | 'yearly';
type PaymentMethod = 'card' | 'qpay' | 'bank';

export default function PremiumPaymentDialog({ open, onClose, onSuccess }: Props) {
  const theme = useTheme();
  const [plan, setPlan] = useState<PlanType>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qpay');
  const [processing, setProcessing] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const planDetails = {
    monthly: { price: 9900, label: 'Сарын багц', period: 'сар' },
    yearly: { price: 99000, label: 'Жилийн багц', period: 'жил', discount: '2 сар үнэгүй' },
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would:
      // 1. Validate payment details
      // 2. Call your payment API endpoint
      // 3. Handle payment gateway response
      // 4. Update user's premium status

      const token = localStorage.getItem('token');
      const response = await fetch('/api2/payment/premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
          paymentMethod,
          amount: planDetails[plan].price,
          // Include payment details based on method
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
        alert('Төлбөр амжилттай төлөгдлөө! Premium эрх идэвхжлээ.');
        if (onSuccess) onSuccess();
        onClose();
        // Reload to update auth state
        window.location.reload();
      } else {
        alert(result.message || 'Төлбөр төлөхөд алдаа гарлаа. Дахин оролдоно уу.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Сүлжээний алдаа. Дахин оролдоно уу.');
    } finally {
      setProcessing(false);
    }
  };

  const renderPlanSelection = (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Багц сонгох
      </Typography>
      <Tabs value={plan} onChange={(_, value) => setPlan(value)} sx={{ mb: 3 }}>
        <Tab label="Сарын" value="monthly" />
        <Tab label="Жилийн" value="yearly" />
      </Tabs>

      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          border: `2px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {planDetails[plan].label}
            </Typography>
            {plan === 'yearly' && (
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                ✨ {planDetails[plan].discount}
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ₮{planDetails[plan].price.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              / {planDetails[plan].period}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  const renderPaymentMethod = (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Төлбөрийн хэрэгсэл
      </Typography>
      <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
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
    </Box>
  );

  const renderCardForm = paymentMethod === 'card' && (
    <Stack spacing={2} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        label="Картын дугаар"
        placeholder="1234 5678 9012 3456"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
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
        onChange={(e) => setCardName(e.target.value.toUpperCase())}
      />
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Дуусах хугацаа"
          placeholder="MM/YY"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <TextField
          fullWidth
          label="CVV"
          placeholder="123"
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          inputProps={{ maxLength: 3 }}
        />
      </Stack>
    </Stack>
  );

  const renderQPayInfo = paymentMethod === 'qpay' && (
    <Box sx={{ mt: 3, p: 3, bgcolor: 'background.neutral', borderRadius: 2, textAlign: 'center' }}>
      <Iconify icon="mdi:qrcode-scan" width={120} sx={{ mb: 2, color: 'text.secondary' }} />
      <Typography variant="body2" color="text.secondary">
        QPay QR код энд харагдана
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Төлбөр баталгаажсаны дараа автоматаар Premium эрх идэвхжинэ
      </Typography>
    </Box>
  );

  const renderBankInfo = paymentMethod === 'bank' && (
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
          <strong>Гүйлгээний утга:</strong> Premium-[Таны имэйл]
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Шилжүүлэг хийсний дараа 1-2 цагийн дотор Premium эрх идэвхжинэ
      </Typography>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:crown" width={28} sx={{ color: 'warning.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Premium эрх авах
          </Typography>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {renderPlanSelection}
        {renderPaymentMethod}
        {renderCardForm}
        {renderQPayInfo}
        {renderBankInfo}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={processing}>
          Цуцлах
        </Button>
        <LoadingButton
          variant="contained"
          size="large"
          loading={processing}
          onClick={handlePayment}
          startIcon={<Iconify icon="mdi:lock" />}
        >
          ₮{planDetails[plan].price.toLocaleString()} төлөх
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
