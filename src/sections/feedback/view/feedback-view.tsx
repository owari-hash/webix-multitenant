'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import FeedbackForm from '../feedback-form';
import FeedbackList from '../feedback-list';

// ----------------------------------------------------------------------

type Props = {
  mode?: 'list' | 'create';
};

export default function FeedbackView({ mode = 'list' }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(mode === 'create');

  const handleFormSuccess = () => {
    setShowForm(false);
    router.push(paths.feedback.root);
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
      {showForm ? (
        <Card sx={{ p: { xs: 3, md: 5 }, maxWidth: 800, mx: 'auto' }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h4">Санал хүсэл гомдол илгээх</Typography>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="mdi:arrow-left" />}
                onClick={() => {
                  if (mode === 'create') {
                    router.push(paths.feedback.root);
                  } else {
                    setShowForm(false);
                  }
                }}
              >
                Буцах
              </Button>
            </Box>
            <Divider />
            <FeedbackForm onSuccess={handleFormSuccess} />
          </Stack>
        </Card>
      ) : (
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h3">Санал хүсэл гомдол</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setShowForm(true)}
            >
              Шинэ санал хүсэл гомдол
            </Button>
          </Box>

          <Card sx={{ p: { xs: 3, md: 4 } }}>
            <FeedbackList showCreateButton={false} />
          </Card>
        </Stack>
      )}
    </Container>
  );
}

