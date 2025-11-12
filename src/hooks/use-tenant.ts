import { useTenant } from 'src/contexts/tenant-context';

// ----------------------------------------------------------------------

export function useTenantInfo() {
  const { tenant, isLoading, error, switchTenant } = useTenant();

  return {
    tenant,
    isLoading,
    error,
    switchTenant,
    isMainTenant: !tenant?.subdomain,
    subdomain: tenant?.subdomain || '',
    databaseName: tenant?.databaseName || 'webix-main',
  };
}

// ----------------------------------------------------------------------

export function useTenantDatabase() {
  const { tenant } = useTenant();

  if (!tenant) {
    return null;
  }

  return {
    databaseName: tenant.databaseName,
    subdomain: tenant.subdomain,
    isMainTenant: !tenant.subdomain,
  };
}
