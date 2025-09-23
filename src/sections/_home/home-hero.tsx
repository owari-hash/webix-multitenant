import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import { FormControl } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { _mock } from 'src/_mock';
import Image from 'src/components/image';
import { bgGradient } from 'src/theme/css';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { HEADER } from 'src/layouts/config-layout';
import { useResponsive } from 'src/hooks/use-responsive';
import { useBoundingClientRect } from 'src/hooks/use-bounding-client-rect';


// ----------------------------------------------------------------------

export default function HomeHero() {
  const theme = useTheme();

  const _carouselsExample = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.postTitle(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.description(index),
}));
  const containerRef = useRef<HTMLDivElement>(null);

  const mdUp = useResponsive('up', 'md');

  const container = useBoundingClientRect(containerRef);

  const offsetLeft = container?.left;

  const [open, setOpen] = useState(false);

  const modalNeeye = () => setOpen(true);
  const modalKhaaya = () => setOpen(false);

  // Form state
  const [form, setForm] = useState({ name: '', phoneNumber : '',email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSnackbarOpen(true); // Show toast
      handleDialogClose();   // Close dialog
    }, 1000);
  };

  const handleDialogClose = () => {
    setForm({ name: '', email: '', phoneNumber: '', message: '' });
    modalKhaaya();
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_1.jpg',
        }),
        overflow: 'hidden',
        position: 'relative',
        height: { md: `calc(100vh - ${HEADER.H_DESKTOP}px)` },
      }}
    >
      <Container sx={{ height: 1 }}>
        <Grid container columnSpacing={3} alignItems="center" sx={{ height: 1 }}>
          <Grid xs={12} md={5}>
            <Stack
              spacing={5}
              justifyContent="center"
              alignItems={{ xs: 'center', md: 'flex-start' }}
              sx={{
                py: 15,
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Typography variant="h1">
                Зурагт ном <br /> Түрээсийн
                <Box component="span" sx={{ color: 'primary.main' }}>
                  {` Систем`}
                </Box>
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                Энэхүү системийн гол давуу тал нь Монголын нөхцөлд анх удаа multitenant архитектурт тулгуурласан зурагт номын цахим платформ
              </Typography>

              <Button
                color="inherit"
                size="large"
                variant="contained"
                endIcon={<Iconify icon="carbon:launch" />}
                onClick={modalNeeye}
              >
                Бидэнтэй холбогдох
              </Button>

              <Stack spacing={3}>
                <Typography variant="overline">AVAILABLE FOR</Typography>
                <Stack direction="row" spacing={2.5}>
                  {['js', 'ts', 'figma', 'cra', 'nextjs'].map((icon) => (
                    <SvgColor
                      key={icon}
                      src={`/assets/icons/platforms/ic_${icon}.svg`}
                      sx={{ width: 24, height: 24 }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Stack>

          </Grid>

          <Grid xs={12} md={7}>
            <Box ref={containerRef} />
          </Grid>
        </Grid>
      </Container>

      <Dialog className='box' open={open} onClose={handleDialogClose}>
        <DialogTitle>Холбогдох</DialogTitle>
        <DialogContent>
          <FormControl required fullWidth sx={{ mt: 3 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Нэр"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Утасны дугаар"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                label="Имэйл"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Зурвас"
                name="message"
                value={form.message}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                minRows={3}
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={submitting}
              >
                {submitting ? 'Илгээж байна...' : 'Илгээх'}
              </Button>
            </form>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Хаах</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Амжилттай илгээгдлээ!
        </MuiAlert>
      </Snackbar>

      {mdUp && (
        <Box
          sx={{
            maxWidth: 1280,
            position: 'absolute',
            bottom: { md: '20%', lg: 40 },
            right: { md: -110, xl: 0 },
            width: { md: `calc(100% - ${offsetLeft}px)` },
          }}
        >
          <Image
            visibleByDefault
            disabledEffect
            alt="home hero"
            src="/assets/images/home/home_hero.png"
          />
        </Box>
      )}
    </Box>
  );
}
