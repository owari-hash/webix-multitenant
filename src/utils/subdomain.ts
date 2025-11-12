// ----------------------------------------------------------------------

export interface TenantInfo {
  subdomain: string;
  databaseName: string;
  isValid: boolean;
}

/**
 * Subdomain to database name mapping (matches backend configuration)
 */
const SUBDOMAIN_TO_DB: Record<string, string> = {
  test: 'webix-test', // test.anzaidev.fun -> webix-test database
  udirdlaga: 'webix-udirdlaga',
  goytest: 'webix_goytest',
};

/**
 * Extract subdomain from hostname
 * @param hostname - The hostname to extract subdomain from
 * @returns TenantInfo object with subdomain, database name, and validity
 */
export function extractSubdomain(hostname: string): TenantInfo {
  // Remove port if present
  const cleanHostname = hostname.split(':')[0];

  // Split by dots
  const parts = cleanHostname.split('.');

  // If we have at least 3 parts (subdomain.domain.tld) or 2 parts for localhost
  if (parts.length >= 2) {
    const subdomain = parts[0];

    // Skip 'www' subdomain
    if (subdomain === 'www') {
      return {
        subdomain: '',
        databaseName: 'webix-main',
        isValid: true,
      };
    }

    // Check if subdomain has specific database mapping
    if (SUBDOMAIN_TO_DB[subdomain]) {
      return {
        subdomain,
        databaseName: SUBDOMAIN_TO_DB[subdomain],
        isValid: true,
      };
    }

    // For localhost development, treat first part as subdomain
    if (cleanHostname.includes('localhost')) {
      return {
        subdomain,
        databaseName: `webix-${subdomain}`,
        isValid: true,
      };
    }

    // For production domains
    if (parts.length >= 3) {
      return {
        subdomain,
        databaseName: `webix-${subdomain}`,
        isValid: true,
      };
    }
  }

  // Default case - no subdomain
  return {
    subdomain: '',
    databaseName: 'webix-main',
    isValid: true,
  };
}

/**
 * Get tenant info from request headers
 * @param headers - Request headers
 * @returns TenantInfo object
 */
export function getTenantFromHeaders(headers: Headers): TenantInfo {
  const host = headers.get('host') || '';
  return extractSubdomain(host);
}

/**
 * Get tenant info from URL
 * @param url - The URL to extract tenant from
 * @returns TenantInfo object
 */
export function getTenantFromUrl(url: string): TenantInfo {
  try {
    const urlObj = new URL(url);
    return extractSubdomain(urlObj.hostname);
  } catch {
    return {
      subdomain: '',
      databaseName: 'main',
      isValid: false,
    };
  }
}

/**
 * Validate if a subdomain is allowed
 * @param subdomain - The subdomain to validate
 * @param allowedSubdomains - Array of allowed subdomains
 * @returns boolean
 */
export function isSubdomainAllowed(subdomain: string, allowedSubdomains: string[] = []): boolean {
  if (!subdomain) return true; // Main domain is always allowed
  return allowedSubdomains.includes(subdomain);
}
