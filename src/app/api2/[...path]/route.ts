import { NextRequest, NextResponse } from 'next/server';

// ----------------------------------------------------------------------

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Proxy API route to forward requests to the Express backend
 * Usage: /api2/your-endpoint -> http://localhost:3001/api/your-endpoint
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
    // Backend will detect subdomain from Host header
    const path = params.path.join('/');
    // Prepend /api to forward to backend API routes
    const backendUrl = `${BACKEND_URL}/api/${path}`;

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

    // Forward request to backend
    // The backend will detect subdomain from the Host header
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Forward the original host so backend can detect subdomain
        Host: request.headers.get('host') || 'localhost:8002',
      },
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
