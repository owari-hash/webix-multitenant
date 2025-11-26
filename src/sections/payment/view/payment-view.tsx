'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';
import { InvoiceResponse } from 'src/utils/qpay-api';

import PaymentSummary from '../payment-summary';
import QPayInvoiceForm from '../qpay-invoice-form';
import QPayPaymentStatus from '../qpay-payment-status';

// ----------------------------------------------------------------------

export default function PaymentView() {
  const mdUp = useResponsive('up', 'md');
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);

  const handleInvoiceCreated = (createdInvoice: InvoiceResponse) => {
    setInvoice(createdInvoice);
  };

  const handlePaymentComplete = () => {
    // Refresh or redirect after payment
    setTimeout(() => {
      setInvoice(null);
    }, 3000);
  };

  const handleCancel = () => {
    setInvoice(null);
  };

  return (
    <Container
      sx={{
        overflow: 'hidden',
        minHeight: 1,
        pt: { xs: 13, md: 16 },
        pb: { xs: 10, md: 15 },
      }}
    >
      <Typography variant="h3" align="center" paragraph>
        QPay Төлбөр Төлөх
      </Typography>

      <Typography align="center" sx={{ color: 'text.secondary', mb: { xs: 5, md: 8 } }}>
        Нэхэмжлэх үүсгэж QR код ашиглан төлбөрөө төлөөрэй
      </Typography>

      <Grid container spacing={mdUp ? 3 : 5}>
        <Grid xs={12} md={8}>
          <Box
            sx={{
              p: { md: 5 },
              borderRadius: 2,
              border: (theme) => ({
                md: `dashed 1px ${theme.palette.divider}`,
              }),
            }}
          >
            {!invoice ? (
              <QPayInvoiceForm onInvoiceCreated={handleInvoiceCreated} />
            ) : (
              <QPayPaymentStatus
                invoice={invoice.invoice}
                onPaymentComplete={handlePaymentComplete}
                onCancel={handleCancel}
              />
            )}
          </Box>
        </Grid>

        <Grid xs={12} md={4}>
          <PaymentSummary />
        </Grid>
      </Grid>
    </Container>
  );
}
