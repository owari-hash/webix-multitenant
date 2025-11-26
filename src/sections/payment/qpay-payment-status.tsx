'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import { qpayApi, InvoiceResponse } from 'src/utils/qpay-api';

// ----------------------------------------------------------------------

type Props = {
  invoice: InvoiceResponse['invoice'];
  urls?: Array<{ name?: string; link?: string; description?: string; logo?: string }>;
  onPaymentComplete?: () => void;
  onCancel?: () => void;
};

export default function QPayPaymentStatus({
  invoice,
  urls = [],
  onPaymentComplete,
  onCancel,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'CANCELLED'>(
    invoice?.status || 'PENDING'
  );
  const [checking, setChecking] = useState(false);
  const [polling, setPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  // Poll payment status every 3 seconds if pending
  useEffect(() => {
    if (!invoice) {
      return;
    }

    if (status === 'PENDING' && !isPollingRef.current) {
      isPollingRef.current = true;
      setPolling(true);

      intervalRef.current = setInterval(async () => {
        try {
          const result = await qpayApi.checkPayment(invoice.invoice_id);
          if (result.status === 'PAID') {
            setStatus('PAID');
            setPolling(false);
            isPollingRef.current = false;
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            enqueueSnackbar('Төлбөр амжилттай төлөгдлөө!', { variant: 'success' });
            if (onPaymentComplete) onPaymentComplete();
          } else if (result.status === 'CANCELLED') {
            setStatus('CANCELLED');
            setPolling(false);
            isPollingRef.current = false;
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        } catch (error) {
          console.error('Payment check error:', error);
        }
      }, 3000);

      // eslint-disable-next-line consistent-return
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        isPollingRef.current = false;
        setPolling(false);
      };
    }
  }, [status, invoice, onPaymentComplete, enqueueSnackbar]);

  const handleCheckPayment = async () => {
    if (!invoice) return;
    try {
      setChecking(true);
      const result = await qpayApi.checkPayment(invoice.invoice_id);
      setStatus(result.status);

      if (result.status === 'PAID') {
        enqueueSnackbar('Төлбөр амжилттай төлөгдлөө!', { variant: 'success' });
        if (onPaymentComplete) onPaymentComplete();
      }
    } catch (error: any) {
      console.error('Check payment error:', error);
      enqueueSnackbar(error?.message || 'Төлбөрийн статус шалгахад алдаа гарлаа', {
        variant: 'error',
      });
    } finally {
      setChecking(false);
    }
  };

  const handleCancelInvoice = async () => {
    if (!invoice) return;
    try {
      await qpayApi.cancelInvoice(invoice.invoice_id);
      setStatus('CANCELLED');
      enqueueSnackbar('Нэхэмжлэх цуцлагдлаа', { variant: 'info' });
      if (onCancel) onCancel();
    } catch (error: any) {
      console.error('Cancel invoice error:', error);
      enqueueSnackbar(error?.message || 'Нэхэмжлэх цуцлахад алдаа гарлаа', { variant: 'error' });
    }
  };

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PAID':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PAID':
        return 'Төлөгдсөн';
      case 'CANCELLED':
        return 'Цуцлагдсан';
      default:
        return 'Хүлээгдэж буй';
    }
  };

  if (!invoice) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Нэхэмжлэх олдсонгүй
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Төлбөрийн Статус</Typography>
          <Label color={getStatusColor(status)}>{getStatusLabel(status)}</Label>
        </Stack>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Нэхэмжлэхийн дугаар
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {invoice.invoice_id}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Дүн
          </Typography>
          <Typography variant="h5" color="primary.main">
            {invoice.amount.toLocaleString()} {invoice.currency}
          </Typography>
        </Box>

        {invoice.description && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Тайлбар
            </Typography>
            <Typography variant="body1">{invoice.description}</Typography>
          </Box>
        )}

        {status === 'PENDING' && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              QR код уншуулах эсвэл төлбөрийн апп сонгох
            </Typography>

            {/* QR Code Image */}
            {invoice.qr_image && (
              <Box
                component="img"
                src={invoice.qr_image}
                alt="QR Code"
                onError={(e) => {
                  console.error('QR Image load error:', e);
                  console.log('QR Image src:', invoice.qr_image?.substring(0, 100));
                }}
                sx={{
                  maxWidth: 280,
                  width: '100%',
                  height: 'auto',
                  border: 2,
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 2,
                  bgcolor: 'background.paper',
                  mx: 'auto',
                  display: 'block',
                  mb: 3,
                }}
              />
            )}
            {!invoice.qr_image && (invoice.qr_code || invoice.qr_text) && (
              <Box
                sx={{
                  p: 2,
                  border: 2,
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  wordBreak: 'break-all',
                  maxWidth: 280,
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem' }}>
                  {invoice.qr_code || invoice.qr_text}
                </Typography>
              </Box>
            )}

            {/* Payment App Options */}
            {urls && urls.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Төлбөрийн апп сонгох:
                </Typography>
                <Stack spacing={1.5} sx={{ maxWidth: 400, mx: 'auto' }}>
                  {urls
                    .filter((url) => url.name && url.link)
                    .map((url, index) => {
                      // Prioritize Social Pay
                      const isSocialPay = url.name?.toLowerCase().includes('social');
                      return (
                        <Button
                          key={index}
                          variant={isSocialPay ? 'contained' : 'outlined'}
                          fullWidth
                          href={url.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={
                            url.logo ? (
                              <Box
                                component="img"
                                src={url.logo}
                                alt={url.name}
                                sx={{ width: 24, height: 24, borderRadius: 0.5 }}
                              />
                            ) : (
                              <Iconify icon="mdi:wallet" width={24} />
                            )
                          }
                          sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            ...(isSocialPay && {
                              bgcolor: 'primary.main',
                              '&:hover': { bgcolor: 'primary.dark' },
                            }),
                          }}
                        >
                          <Box sx={{ textAlign: 'left', flex: 1 }}>
                            <Typography variant="body2" fontWeight={isSocialPay ? 600 : 400}>
                              {url.name}
                            </Typography>
                            {url.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block' }}
                              >
                                {url.description}
                              </Typography>
                            )}
                          </Box>
                        </Button>
                      );
                    })}
                </Stack>
              </Box>
            )}
          </Box>
        )}

        {status === 'PENDING' && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={handleCheckPayment}
              disabled={checking}
              startIcon={
                checking ? <CircularProgress size={16} /> : <Iconify icon="solar:refresh-bold" />
              }
              fullWidth
            >
              Статус Шалгах
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelInvoice}
              startIcon={<Iconify icon="solar:close-circle-bold" />}
            >
              Цуцлах
            </Button>
          </Stack>
        )}

        {status === 'PAID' && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Iconify
              icon="solar:check-circle-bold"
              width={64}
              sx={{ color: 'success.main', mb: 1 }}
            />
            <Typography variant="h6" color="success.main">
              Төлбөр амжилттай төлөгдлөө!
            </Typography>
          </Box>
        )}

        {polling && status === 'PENDING' && (
          <Box
            sx={{
              textAlign: 'center',
              py: 1,
              position: 'relative',
              minHeight: '60px', // Prevent layout shift
            }}
          >
            <CircularProgress
              size={24}
              sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                mt: 4, // Space for spinner
                visibility: 'visible', // Always visible to prevent blinking
                opacity: 1,
              }}
            >
              Төлбөрийн статусыг автоматаар шалгаж байна...
            </Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
