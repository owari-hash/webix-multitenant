import { NextRequest, NextResponse } from 'next/server';

// ----------------------------------------------------------------------

/**
 * Get backend URL dynamically based on the current subdomain
 * Always uses the main production domain (anzaidev.fun) with the same subdomain
 */
function getBackendUrl(host: string): string {
  // Extract subdomain from hostname
  const hostname = host.split(':')[0]; // Remove port if present
  const parts = hostname.split('.');

  // Determine subdomain
  let subdomain = '';
  if (parts.length > 1) {
    // Check if it's a subdomain (e.g., zevtabs.localhost or zevtabs.anzaidev.fun)
    if (parts[0] !== 'www' && parts[0] !== 'localhost') {
      subdomain = parts[0];
    }
  }

  // Always use the main production domain
  const mainDomain = 'anzaidev.fun';
  const protocol = 'https';

  // Construct backend URL with subdomain
  if (subdomain) {
    return `${protocol}://${subdomain}.${mainDomain}`;
  }

  // No subdomain, use main domain (or default from env)
  return process.env.NEXT_PUBLIC_BACKEND_URL || `${protocol}://${mainDomain}`;
}

/**
 * Proxy API route to forward requests to the Express backend
 * Usage: /api2/your-endpoint -> https://{subdomain}.anzaidev.fun/api2/your-endpoint
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  return proxyRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  return proxyRequest(request, params, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  return proxyRequest(request, params, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  return proxyRequest(request, params, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  return proxyRequest(request, params, 'PATCH');
}

// ----------------------------------------------------------------------

async function proxyRequest(request: NextRequest, params: { path: string[] }, method: string) {
  try {
    // Get the current hostname from the request
    const originalHost = request.headers.get('host') || '';

    // Dynamically construct backend URL based on current subdomain
    // Always uses anzaidev.fun domain
    const backendBaseUrl = getBackendUrl(originalHost);

    // Backend will detect subdomain from Host header
    const path = params.path.join('/');
    // Forward to backend API routes (backend already has /api2 prefix)
    const backendUrl = `${backendBaseUrl}/api2/${path}`;

    // Get query parameters
    const { searchParams } = request.nextUrl;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${backendUrl}?${queryString}` : backendUrl;

    // Get request body for POST/PUT/PATCH
    let body: any;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        body = await request.json();
      } catch {
        // No body or invalid JSON
      }
    }

    // Prepare headers for backend request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      // Forward the original host in a custom header for additional context
      'X-Original-Host': originalHost,
    };

    // Forward Authorization header if present (for protected routes)
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    // Forward request to backend
    // The backend will automatically detect subdomain from the Host header
    // (which is set automatically by fetch based on the URL)
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Proxy request failed',
      },
      { status: 500 }
    );
  }
}
