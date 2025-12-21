'use client';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function NovelChapterReadLayout({ children }: Props) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {children}
    </Box>
  );
}


