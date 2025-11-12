'use client';

import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';
import { TenantInfo, extractSubdomain } from 'src/utils/subdomain';

// ----------------------------------------------------------------------

interface TenantContextType {
  tenant: TenantInfo | null;
  isLoading: boolean;
  error: string | null;
  switchTenant: (subdomain: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// ----------------------------------------------------------------------

interface TenantProviderProps {
  children: React.ReactNode;
  initialTenant?: TenantInfo;
}

export function TenantProvider({ children, initialTenant }: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantInfo | null>(initialTenant || null);
  const [isLoading, setIsLoading] = useState(!initialTenant);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialTenant) {
      // Extract tenant from current URL
      const currentTenant = extractTenantFromWindow();
      setTenant(currentTenant);
      setIsLoading(false);
    }
  }, [initialTenant]);

  const switchTenant = useCallback((subdomain: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const newTenant = {
        subdomain,
        databaseName: subdomain ? `webix-${subdomain}` : 'webix-main',
        isValid: true,
      };

      setTenant(newTenant);

      // Optionally redirect to the new subdomain
      if (typeof window !== 'undefined') {
        const currentHost = window.location.host;
        const parts = currentHost.split('.');

        if (subdomain) {
          // Replace first part with new subdomain
          parts[0] = subdomain;
        } else {
          // Remove first part for main domain
          parts.shift();
        }

        const newHost = parts.join('.');
        const newUrl = `${window.location.protocol}//${newHost}${
          window.location.port ? `:${window.location.port}` : ''
        }${window.location.pathname}`;

        window.location.href = newUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch tenant');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: TenantContextType = useMemo(
    () => ({
      tenant,
      isLoading,
      error,
      switchTenant,
    }),
    [tenant, isLoading, error, switchTenant]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

// ----------------------------------------------------------------------

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// ----------------------------------------------------------------------

function extractTenantFromWindow(): TenantInfo {
  if (typeof window === 'undefined') {
    return {
      subdomain: '',
      databaseName: 'webix-main',
      isValid: false,
    };
  }

  const { hostname } = window.location;
  return extractSubdomain(hostname);
}
