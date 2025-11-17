'use client';

import MainLayout from 'src/layouts/main';
import CMSGuard from 'src/components/auth/cms-guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function CMSLayout({ children }: Props) {
  return (
    <MainLayout>
      <CMSGuard>{children}</CMSGuard>
    </MainLayout>
  );
}
