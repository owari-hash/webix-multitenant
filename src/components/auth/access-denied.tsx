'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
};

export default function AccessDenied({
  title = 'Хандах эрх хүрэлцэхгүй байна',
  description = 'Уучлаарай, та энэ хуудсыг үзэх эрхгүй байна. Зөвхөн админ хэрэглэгчид хандах боломжтой.',
}: Props) {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'error.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify icon="carbon:locked" sx={{ fontSize: 64, color: 'error.main' }} />
        </Box>

        <Box>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 480 }}>
            {description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            href={paths.webtoon.root}
            startIcon={<Iconify icon="carbon:home" />}
          >
            Нүүр хуудас руу буцах
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            href="/auth/login"
            startIcon={<Iconify icon="carbon:logout" />}
          >
            Дахин нэвтрэх
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

