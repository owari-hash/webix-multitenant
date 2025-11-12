// ----------------------------------------------------------------------

// Backend API client for Express server
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

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
    const url = `${BACKEND_URL}${endpoint}`;

    // Prepare headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    });

    // Forward subdomain to backend if provided
    // The backend will detect it from the Host header
    if (subdomain) {
      // Set Host header so backend can detect subdomain
      headers.set('Host', subdomain.includes('.') ? subdomain : `${subdomain}.localhost:3001`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Important for CORS with credentials
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'Request failed',
        ...data,
      };
    }

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
  return backendRequest('/api/welcome', {}, subdomain);
}

/**
 * Get health status from backend
 */
export async function getHealth(subdomain?: string) {
  return backendRequest('/api/health', {}, subdomain);
}

/**
 * Test database connection
 */
export async function testDatabase(subdomain?: string) {
  return backendRequest('/api/test-db', {}, subdomain);
}

/**
 * Get root welcome message
 */
export async function getRootWelcome(subdomain?: string) {
  return backendRequest('/', {}, subdomain);
}
