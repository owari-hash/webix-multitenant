import { NextRequest, NextResponse } from 'next/server';

// ----------------------------------------------------------------------

/**
 * Get backend URL dynamically based on the current subdomain
 * ALWAYS uses the production domain (anzaidev.fun) with the same subdomain
 * Never uses localhost - always forwards to production backend
 */
function getBackendUrl(host: string): string {
  // Extract subdomain from hostname
  const hostname = host.split(':')[0]; // Remove port if present
  const parts = hostname.split('.');

  // Determine subdomain
  let subdomain = '';
  if (parts.length > 1) {
    // Check if it's a subdomain (e.g., yujoteam.localhost or yujoteam.anzaidev.fun)
    // For localhost, extract subdomain from yujoteam.localhost -> yujoteam
    if (parts[0] !== 'www' && parts[0] !== 'localhost') {
      subdomain = parts[0];
    }
  }

  // ALWAYS use the production domain (anzaidev.fun)
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

    // Log the proxy request for debugging (only for POST/PATCH/PUT to reduce noise)
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      console.log(`🔄 [API2 Proxy] ${method} ${originalHost}${request.nextUrl.pathname} -> ${fullUrl}`);
    }

    // Create AbortController for timeout
    // Longer timeout for POST/PATCH/PUT (batch uploads) vs GET requests
    const timeout = ['POST', 'PATCH', 'PUT'].includes(method) ? 120000 : 30000; // 120s for uploads, 30s for GET
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Forward request to backend
    // The backend will automatically detect subdomain from the Host header
    // (which is set automatically by fetch based on the URL)
    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle timeout specifically
      if (fetchError.name === 'AbortError' || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
        const timeoutSeconds = timeout / 1000;
        console.error(`⏱️ [API2 Proxy] Timeout for ${fullUrl} (${timeoutSeconds}s)`);
        return NextResponse.json(
          {
            success: false,
            error: `Request timeout - backend took too long to respond (${timeoutSeconds}s)`,
            details: {
              backendUrl: fullUrl,
              timeout: `${timeoutSeconds}s`,
            },
          },
          { status: 504 }
        );
      }
      
      console.error(`❌ [API2 Proxy] Fetch failed for ${fullUrl}:`, fetchError.message);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to connect to backend: ${fetchError.message}`,
          details: {
            backendUrl: fullUrl,
            originalHost,
            method,
          },
        },
        { status: 502 }
      );
    }

    // Try to parse JSON response
    let data: any;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error(`❌ [API2 Proxy] Non-JSON response from ${fullUrl}:`, text.substring(0, 200));
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid response from backend',
            status: response.status,
          },
          { status: response.status }
        );
      }
    } catch (parseError) {
      console.error(`❌ [API2 Proxy] Failed to parse response from ${fullUrl}:`, parseError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse backend response',
          status: response.status,
        },
        { status: response.status }
      );
    }

    // Only log success for non-GET requests to reduce console noise
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      console.log(`✅ [API2 Proxy] ${method} ${fullUrl} -> ${response.status}`);
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        // Add cache headers for GET requests to reduce duplicate calls
        ...(method === 'GET' ? {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
        } : {}),
      },
    });
  } catch (error) {
    console.error('❌ [API2 Proxy] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Proxy request failed',
      },
      { status: 500 }
    );
  }
}
