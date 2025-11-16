'use client';

import AuthCoverLayout from 'src/layouts/auth/cover';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthCoverLayout
      title="Admin Dashboard Access"
      images={[
        '/assets/images/travel/travel_post_01.jpg',
        '/assets/images/career/career_post_01.jpg',
      ]}
    >
      {children}
    </AuthCoverLayout>
  );
}

