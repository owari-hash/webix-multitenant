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
import { backendRequest } from 'src/utils/backend-api';

// ----------------------------------------------------------------------

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

type Props = {
  children: React.ReactNode;
};

export default function ChapterGuard({ children }: Props) {
  const router = useRouter();
  const { user, loading, authenticated } = useAuthContext();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [premiumPlans, setPremiumPlans] = useState<PremiumPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Fetch premium plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await backendRequest<{ plans: PremiumPlan[] }>(
          '/organizations/premium-plans'
        );
        if (response.success && response.data?.plans) {
          setPremiumPlans(response.data.plans);
        } else {
          // Fallback to default plan
          const defaultPlan: PremiumPlan = {
            name: 'monthly',
            label: 'Сарын багц',
            price: 9900,
            duration: 1,
            period: 'month',
            isActive: true,
            order: 0,
          };
          setPremiumPlans([defaultPlan]);
        }
      } catch (error) {
        console.error('Failed to fetch premium plans:', error);
        // Fallback to default plan
        const defaultPlan: PremiumPlan = {
          name: 'monthly',
          label: 'Сарын багц',
          price: 9900,
          duration: 1,
          period: 'month',
          isActive: true,
          order: 0,
        };
        setPremiumPlans([defaultPlan]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (!loading && !loadingPlans) {
      if (authenticated && !user?.isPremium) {
        setShowPremiumModal(true);
      }
    }
  }, [loading, loadingPlans, authenticated, user]);

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
              {loadingPlans ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : premiumPlans.length > 0 ? (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'primary.lighter',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  {premiumPlans
                    .filter((p) => p.isActive !== false)
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .slice(0, 2)
                    .map((plan, index) => (
                      <Box key={plan.name} sx={{ mb: index === 0 ? 1 : 0 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                          ₮{plan.price.toLocaleString()} / {plan.period === 'month' ? 'сар' : 'жил'}
                        </Typography>
                        {plan.discount && (
                          <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 0.5 }}>
                            {plan.discount}
                          </Typography>
                        )}
                        {index === 0 && premiumPlans.length > 1 && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Эсвэл
                          </Typography>
                        )}
                      </Box>
                    ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'primary.lighter',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    Багц ачааллаж байна...
                  </Typography>
                </Box>
              )}
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
