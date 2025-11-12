// ----------------------------------------------------------------------

/**
 * Get database name for a specific tenant
 * @param tenantName - The tenant name (subdomain)
 * @returns Database name string
 */
export function getTenantDatabaseName(tenantName: string): string {
  // For main tenant (no subdomain)
  if (!tenantName || tenantName === 'main') {
    return 'webix-main';
  }

  // For tenant-specific databases
  return `webix-${tenantName}`;
}

/**
 * Validate database name format
 * @param databaseName - Database name to validate
 * @returns boolean indicating if name is valid
 */
export function validateDatabaseName(databaseName: string): boolean {
  return !!databaseName && databaseName.length > 0;
}
