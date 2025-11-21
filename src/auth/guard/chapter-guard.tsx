'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/contexts/auth-context';
import PremiumPaymentDialog from 'src/components/premium-payment-dialog';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ChapterGuard({ children }: Props) {
  const router = useRouter();
  const { user, loading, authenticated } = useAuthContext();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (authenticated && !user?.isPremium) {
        setShowPremiumModal(true);
      }
    }
  }, [loading, authenticated, user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Та нэвтэрч орно уу !
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Энэ хуудсыг үзэхийн тулд та системд нэвтэрсэн байх шаардлагатай.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={paths.loginBackground}
          onClick={(e) => {
            e.preventDefault();
            router.push(paths.loginBackground);
          }}
        >
          Нэвтрэх
        </Button>
      </Box>
    );
  }

  // Allow admin users to access all content
  if (user?.role === 'admin') {
    return <>{children}</>;
  }

  if (!user?.isPremium) {
    return (
      <>
        <Dialog open={showPremiumModal} maxWidth="md" fullWidth>
          <DialogTitle sx={{ pb: 2, fontSize: '1.5rem', fontWeight: 700 }}>
            Таны эрх нээгдээгүй байна
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Энэ бүлгийг уншихын тулд та Premium эрхтэй байх шаардлагатай.
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Premium эрхийн давуу тал:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ✨ Бүх бүлгүүдэд хязгааргүй хандах
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  🚀 Шинэ бүлгүүдийг эрт үзэх
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  📱 Зар сурталчилгаагүй
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  💎 Онцгой контентод хандах
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'primary.lighter',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                  ₮9,900 / сар
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Эсвэл ₮99,000 / жил (2 сар үнэгүй)
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button variant="outlined" onClick={() => setShowPremiumModal(false)} size="large">
              Буцах
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                setShowPaymentDialog(true);
              }}
            >
              Premium авах
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <PremiumPaymentDialog
          open={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          onSuccess={() => {
            setShowPremiumModal(false);
            setShowPaymentDialog(false);
          }}
        />
        {/* Optionally hide content behind the modal or show a blurred version */}
        <Box sx={{ filter: 'blur(10px)', pointerEvents: 'none', height: '100vh', overflow: 'hidden' }}>
          {/* We don't render children here to be safe, or we can render a placeholder */}
        </Box>
      </>
    );
  }

  return <>{children}</>;
}
