import { m } from 'framer-motion';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { bgGradient } from 'src/theme/css';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeWebtoonNewsletter() {
  const theme = useTheme();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <Box
      component={MotionViewport}
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: theme.palette.primary.main,
          endColor: theme.palette.secondary.main,
        }),
        py: { xs: 10, md: 15 },
        color: 'common.white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container>
        <m.div variants={varFade().inUp}>
          <Typography variant="h2" sx={{ mb: 3, color: 'common.white' }}>
            Stay Updated
          </Typography>
        </m.div>

        <m.div variants={varFade().inUp}>
          <Typography
            variant="h5"
            sx={{
              mb: 5,
              color: 'grey.300',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Get notified about new webtoons, updates, and exclusive content
          </Typography>
        </m.div>

        <m.div variants={varFade().inUp}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 500,
              mx: 'auto',
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              fullWidth
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'common.white',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'common.white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              endIcon={<Iconify icon="carbon:send" />}
              sx={{
                bgcolor: 'common.white',
                color: 'primary.main',
                px: 4,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </m.div>

        <m.div variants={varFade().inUp}>
          <Stack direction="row" spacing={4} justifyContent="center" sx={{ mt: 8 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="carbon:checkmark" sx={{ color: 'success.main' }} />
              <Typography variant="body2" sx={{ color: 'grey.300' }}>
                No spam, ever
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="carbon:checkmark" sx={{ color: 'success.main' }} />
              <Typography variant="body2" sx={{ color: 'grey.300' }}>
                Unsubscribe anytime
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="carbon:checkmark" sx={{ color: 'success.main' }} />
              <Typography variant="body2" sx={{ color: 'grey.300' }}>
                Weekly updates
              </Typography>
            </Stack>
          </Stack>
        </m.div>
      </Container>

      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          opacity: 0.1,
          background: 'url(/assets/background/overlay_1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Box>
  );
}
