'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { backendRequest } from 'src/utils/backend-api';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function LicenseGuard({ children }: Props) {
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLicense = async () => {
      // Skip check for license-expired, organization-not-registered pages and API routes
      if (
        pathname?.includes('/license-expired') ||
        pathname?.includes('/organization-not-registered') ||
        pathname?.startsWith('/api/')
      ) {
        setChecking(false);
        return;
      }

      try {
        // Check license status
        const response = await backendRequest('/organizations/license');
        
        if (response.success && response.data?.subscription) {
          const { subscription } = response.data;
          const isActive =
            subscription.status === 'active' &&
            (!subscription.endDate || new Date(subscription.endDate) > new Date());

          if (!isActive) {
            // License is expired, redirect to license-expired page
            window.location.href = '/license-expired';
          }
        }
      } catch (error: any) {
        // Check for organization not registered error
        if (
          error?.code === 'ORGANIZATION_NOT_REGISTERED' ||
          error?.error === 'Organization not registered' ||
          (error?.success === false && error?.code === 'ORGANIZATION_NOT_REGISTERED')
        ) {
          window.location.href = '/organization-not-registered';
          return;
        }
        // If we get a LICENSE_EXPIRED error, redirect
        if (error?.code === 'LICENSE_EXPIRED' || error?.error === 'License Expired') {
          window.location.href = '/license-expired';
          return;
        }
        // For other errors, log but don't block (might be network issues)
        console.error('License check error:', error);
      } finally {
        setChecking(false);
      }
    };

    checkLicense();
  }, [pathname]);

  // Show loading state while checking
  if (checking) {
    return null; // Or return a loading spinner
  }

  return <>{children}</>;
}

