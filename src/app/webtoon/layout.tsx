'use client';

import { usePathname } from 'next/navigation';

import MainLayout from 'src/layouts/main';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function WebtoonLayout({ children }: Props) {
  const pathname = usePathname();
  
  // Hide main layout (navbar) for chapter reading pages
  const isChapterReadPage = pathname?.includes('/chapter/');

  if (isChapterReadPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
