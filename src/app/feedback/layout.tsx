'use client';

import MainLayout from 'src/layouts/main';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function FeedbackLayout({ children }: Props) {
  return <MainLayout>{children}</MainLayout>;
}

