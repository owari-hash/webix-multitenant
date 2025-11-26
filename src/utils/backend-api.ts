import { getAuthToken } from 'src/utils/auth';

// ----------------------------------------------------------------------

/**
 * Get backend URL dynamically based on the current subdomain
 * Since zevtabs is a wildcard domain, we use the same hostname for backend
 */
function getBackendUrl(): string {
  // For client-side, use window.location
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    const parts = hostname.split('.');

    // Determine subdomain
    let subdomain = '';
    if (parts.length > 1) {
      // Check if it's a subdomain (e.g., zevtabs.localhost or zevtabs.anzaidev.fun)
      if (parts[0] !== 'www' && parts[0] !== 'localhost') {
        subdomain = parts[0];
      }
    }

    // Always use the production domain
    const mainDomain = 'anzaidev.fun';
    const protocol = 'https';

    // Construct backend URL with subdomain
    let backendUrl;
    if (subdomain) {
      backendUrl = `${protocol}://${subdomain}.${mainDomain}`;
    } else {
      backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `${protocol}://${mainDomain}`;
    }

    // Debug logging
    console.log('🔍 Backend URL Debug:', {
      hostname,
      subdomain,
      backendUrl,
      parts,
    });

    return backendUrl;
  }

  // For server-side, use environment variable or default
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://anzaidev.fun';
}

// ----------------------------------------------------------------------

export interface BackendResponse<T = any> {
  success: boolean;
  message?: string;
  welcome?: string;
  subdomain?: string;
  database?: string;
  databaseSeparation?: string;
  host?: string;
  connectionStatus?: string;
  collections?: string[];
  timestamp?: string;
  error?: string;
  data?: T;
}

/**
 * Make a request to the backend API
 * @param endpoint - API endpoint (e.g., '/api/health')
 * @param options - Fetch options
 * @param subdomain - Optional subdomain to forward to backend
 * @returns Promise with backend response
 */
export async function backendRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  subdomain?: string
): Promise<BackendResponse<T>> {
  try {
    // Get dynamic backend URL based on current hostname
    const backendBaseUrl = getBackendUrl();

    // Ensure endpoint starts with /api2 if it doesn't already
    let apiEndpoint = endpoint;
    if (!apiEndpoint.startsWith('/api2')) {
      apiEndpoint = `/api2${apiEndpoint.startsWith('/') ? apiEndpoint : `/${apiEndpoint}`}`;
    }
    const url = `${backendBaseUrl}${apiEndpoint}`;

    // Get token
    const token = getAuthToken();

    // Extract subdomain from current hostname if not provided
    let detectedSubdomain = subdomain;
    if (!detectedSubdomain && typeof window !== 'undefined') {
      const { hostname } = window.location;
      const parts = hostname.split('.');
      if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
        detectedSubdomain = parts[0];
      }
    }

    // Prepare headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token exists
      ...options.headers,
    });

    // Forward subdomain to backend via X-Original-Host header
    // The backend will detect it from this header
    if (detectedSubdomain) {
      let mainDomain = 'anzaidev.fun';
      if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
        mainDomain = 'localhost:8002';
      }
      const hostHeader = detectedSubdomain.includes('.')
        ? detectedSubdomain
        : `${detectedSubdomain}.${mainDomain}`;
      headers.set('X-Original-Host', hostHeader);
      console.log(`🔍 Forwarding subdomain to backend: ${detectedSubdomain} (${hostHeader})`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Important for CORS with credentials
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle License Expired Error
      if (response.status === 403 && errorData.code === 'LICENSE_EXPIRED') {
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/license-expired')
        ) {
          window.location.href = '/license-expired';
        }
        return { success: false, error: 'License Expired' };
      }

      return {
        success: false,
        error: errorData.message || `HTTP error! status: ${response.status}`,
        ...errorData,
      };
    }

    const data = await response.json();

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Get welcome message from backend
 */
export async function getWelcome(subdomain?: string) {
  return backendRequest('/welcome', {}, subdomain);
}

/**
 * Get health status from backend
 */
export async function getHealth(subdomain?: string) {
  return backendRequest('/health', {}, subdomain);
}

/**
 * Test database connection
 */
export async function testDatabase(subdomain?: string) {
  return backendRequest('/test-db', {}, subdomain);
}

/**
 * Get root welcome message
 */
export async function getRootWelcome(subdomain?: string) {
  return backendRequest('/', {}, subdomain);
}
