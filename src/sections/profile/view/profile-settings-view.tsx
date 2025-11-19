'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Switch from '@mui/material/Switch';
import UploadImage from 'src/components/upload/upload-image';
import { setUser, getUser, getCurrentUser, getAuthHeaders, isAuthenticated } from 'src/utils/auth';

// ----------------------------------------------------------------------

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  subdomain?: string;
  createdAt?: string;
}

interface ProfileFormValues {
  name: string;
  email: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newChapterAlerts: boolean;
  favoriteUpdates: boolean;
}

export default function ProfileSettingsView() {
  const passwordShow = useBoolean();
  const newPasswordShow = useBoolean();
  const confirmPasswordShow = useBoolean();
  const deleteDialogOpen = useBoolean();

  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    newChapterAlerts: true,
    favoriteUpdates: true,
  });

  // Profile form schema
  const ProfileSchema = Yup.object().shape({
    name: Yup.string()
      .required('Нэр заавал оруулах')
      .min(2, 'Хамгийн багадаа 2 тэмдэгт')
      .max(50, 'Хамгийн ихдээ 50 тэмдэгт'),
    email: Yup.string().required('Имэйл заавал оруулах').email('Имэйл буруу байна'),
  });

  // Password form schema
  const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Одоогийн нууц үг заавал оруулах'),
    newPassword: Yup.string()
      .required('Шинэ нууц үг заавал оруулах')
      .min(6, 'Хамгийн багадаа 6 тэмдэгт'),
    confirmPassword: Yup.string()
      .required('Нууц үг баталгаажуулах заавал оруулах')
      .oneOf([Yup.ref('newPassword')], 'Нууц үг таарахгүй байна'),
  });

  const profileMethods = useForm<ProfileFormValues>({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const [avatar, setAvatar] = useState<string>('');

  const passwordMethods = useForm<PasswordFormValues>({
    resolver: yupResolver(PasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isAuthenticated()) {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          return;
        }

        try {
          const currentUser = await getCurrentUser();
          setUserState(currentUser);
          setAvatar(currentUser.avatar || '');
          profileMethods.reset({
            name: currentUser.name || '',
            email: currentUser.email || '',
          });
        } catch (apiError) {
          const storedUser = getUser();
          if (storedUser) {
            setUserState(storedUser);
            setAvatar(storedUser.avatar || '');
            profileMethods.reset({
              name: storedUser.name || '',
              email: storedUser.email || '',
            });
          } else {
            throw new Error('Хэрэглэгчийн мэдээлэл олдсонгүй');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Мэдээлэл ачаалахад алдаа гарлаа');
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [profileMethods]);

  // Handle profile update
  const onUpdateProfile = profileMethods.handleSubmit(async (data) => {
    try {
      setError(null);
      setSuccess(null);

      const response = await fetch('/api2/auth/profile', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...data, avatar }),
      });

      const result = await response.json();

      if (result.success) {
        const updatedUser = { ...user, ...data, avatar } as User;
        setUserState(updatedUser);
        setUser(updatedUser);
        setSuccess('Профайл амжилттай шинэчлэгдлээ');
      } else {
        setError(result.error || result.message || 'Профайл шинэчлэхэд алдаа гарлаа');
      }
    } catch (err) {
      setError('Профайл шинэчлэхэд алдаа гарлаа');
      console.error('Error updating profile:', err);
    }
  });

  // Handle password change
  const onUpdatePassword = passwordMethods.handleSubmit(async (data) => {
    try {
      setError(null);
      setSuccess(null);

      const response = await fetch('/api2/auth/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        passwordMethods.reset();
        setSuccess('Нууц үг амжилттай солигдлоо');
      } else {
        setError(result.error || result.message || 'Нууц үг солихөд алдаа гарлаа');
      }
    } catch (err) {
      setError('Нууц үг солихөд алдаа гарлаа');
      console.error('Error changing password:', err);
    }
  });

  // Handle notification settings update
  const handleNotificationChange = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);

    try {
      await fetch('/api2/user/notifications', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSettings),
      });
    } catch (err) {
      console.error('Error updating notification settings:', err);
      // Revert on error
      setNotificationSettings(notificationSettings);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api2/auth/delete-account', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else {
        setError(result.error || result.message || 'Бүртгэл устгахад алдаа гарлаа');
      }
    } catch (err) {
      setError('Бүртгэл устгахад алдаа гарлаа');
      console.error('Error deleting account:', err);
    } finally {
      deleteDialogOpen.onFalse();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Alert severity="error">Хэрэглэгчийн мэдээлэл олдсонгүй</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={5}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton component={RouterLink} href={paths.profile.root}>
            <Iconify icon="carbon:arrow-left" />
          </IconButton>
          <Typography variant="h4">Профайлын тохиргоо</Typography>
        </Stack>

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Profile Information */}
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Хувийн мэдээлэл
          </Typography>

          <FormProvider methods={profileMethods} onSubmit={onUpdateProfile}>
            <Stack spacing={3}>
              {/* Avatar Upload */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Профайл зураг
                </Typography>
                <Stack direction="row" spacing={3} alignItems="flex-start">
                  <Avatar
                    src={avatar || user.avatar}
                    alt={user.name}
                    sx={{ width: 100, height: 100 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <UploadImage
                      value={avatar}
                      onChange={(url: string) => setAvatar(url)}
                      helperText="JPG, PNG эсвэл GIF. Хамгийн ихдээ 5MB"
                      ratio="1/1"
                      maxSize={5242880}
                    />
                  </Box>
                </Stack>
              </Box>

              <RHFTextField name="name" label="Нэр" />
              <RHFTextField name="email" label="Имэйл хаяг" type="email" />

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" component={RouterLink} href={paths.profile.root}>
                  Цуцлах
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={profileMethods.formState.isSubmitting}
                >
                  Хадгалах
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>

        {/* Password Change */}
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Нууц үг солих
          </Typography>

          <FormProvider methods={passwordMethods} onSubmit={onUpdatePassword}>
            <Stack spacing={3}>
              <RHFTextField
                name="currentPassword"
                label="Одоогийн нууц үг"
                type={passwordShow.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={passwordShow.onToggle} edge="end">
                        <Iconify icon={passwordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="newPassword"
                label="Шинэ нууц үг"
                type={newPasswordShow.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={newPasswordShow.onToggle} edge="end">
                        <Iconify icon={newPasswordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="confirmPassword"
                label="Нууц үг баталгаажуулах"
                type={confirmPasswordShow.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={confirmPasswordShow.onToggle} edge="end">
                        <Iconify
                          icon={confirmPasswordShow.value ? 'carbon:view' : 'carbon:view-off'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" justifyContent="flex-end">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={passwordMethods.formState.isSubmitting}
                >
                  Нууц үг солих
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>

        {/* Notification Settings */}
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Мэдэгдлийн тохиргоо
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2">Имэйл мэдэгдэл</Typography>
                <Typography variant="body2" color="text.secondary">
                  Имэйлээр мэдэгдэл хүлээн авах
                </Typography>
              </Box>
              <Switch
                checked={notificationSettings.emailNotifications}
                onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
              />
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2">Push мэдэгдэл</Typography>
                <Typography variant="body2" color="text.secondary">
                  Браузерын push мэдэгдэл хүлээн авах
                </Typography>
              </Box>
              <Switch
                checked={notificationSettings.pushNotifications}
                onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
              />
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2">Шинэ бүлэг мэдэгдэл</Typography>
                <Typography variant="body2" color="text.secondary">
                  Дуртай комикийн шинэ бүлэг гарвал мэдэгдэл хүлээн авах
                </Typography>
              </Box>
              <Switch
                checked={notificationSettings.newChapterAlerts}
                onChange={(e) => handleNotificationChange('newChapterAlerts', e.target.checked)}
              />
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2">Дуртай комик шинэчлэлт</Typography>
                <Typography variant="body2" color="text.secondary">
                  Дуртай комикийн шинэчлэлтийн мэдэгдэл хүлээн авах
                </Typography>
              </Box>
              <Switch
                checked={notificationSettings.favoriteUpdates}
                onChange={(e) => handleNotificationChange('favoriteUpdates', e.target.checked)}
              />
            </Box>
          </Stack>
        </Card>

        {/* Privacy Settings */}
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Хувийн нууцлал
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Профайл харагдах байдал
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Таны профайл хэн харж болохыг тохируулах
              </Typography>
              <Button variant="outlined" size="small">
                Тохиргоо
              </Button>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Уншсан түүх
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Уншсан комикуудын түүхээ нуух эсвэл харуулах
              </Typography>
              <Button variant="outlined" size="small">
                Тохиргоо
              </Button>
            </Box>
          </Stack>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ p: 4, border: '2px solid', borderColor: 'error.main' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
            Аюултай бүс
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Бүртгэл устгах
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Таны бүртгэл болон бүх мэдээлэл бүрмөсөн устгагдана. Энэ үйлдлийг буцаах боломжгүй.
              </Typography>
              <Button variant="outlined" color="error" onClick={deleteDialogOpen.onTrue}>
                Бүртгэл устгах
              </Button>
            </Box>
          </Stack>
        </Card>
      </Stack>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen.value} onClose={deleteDialogOpen.onFalse}>
        <DialogTitle>Бүртгэл устгах</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Та бүртгэлээ устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй бөгөөд таны бүх
            мэдээлэл бүрмөсөн устгагдана.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteDialogOpen.onFalse}>Цуцлах</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Устгах
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
