import { NextRequest, NextResponse } from 'next/server';

// ----------------------------------------------------------------------

// Route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Get backend URL dynamically based on the current subdomain
 * Same logic as api2/[...path]/route.ts - always uses production domain
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

  // Always use the main production domain (same as api2 proxy)
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
 * Next.js API route to proxy file uploads to the backend
 * This avoids CORS and connection issues
 */
export async function POST(request: NextRequest) {
  try {
    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Get backend URL using same logic as other API routes
    const originalHost = request.headers.get('host') || '';
    const backendBaseUrl = getBackendUrl(originalHost);
    const backendUrl = `${backendBaseUrl}/api2/upload/single`;

    // Get subdomain from request headers
    const hostname = originalHost.split(':')[0];
    const parts = hostname.split('.');
    const subdomain =
      parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost' ? parts[0] : undefined;

    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('image', file);

    // Prepare headers for backend request
    const headers: HeadersInit = {};
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    // Forward subdomain to backend via X-Original-Host header
    if (subdomain) {
      const mainDomain = hostname.includes('localhost') ? 'localhost:8002' : 'anzaidev.fun';
      headers['X-Original-Host'] = `${subdomain}.${mainDomain}`;
    } else {
      // Still forward the original host for context
      headers['X-Original-Host'] = originalHost;
    }

    console.log('📤 Upload proxy - forwarding to backend:', {
      backendUrl,
      subdomain,
      originalHost,
      hasAuth: !!authHeader,
      fileSize: file.size,
      fileName: file.name,
    });

    // Forward the request to backend
    let response: Response;
    try {
      response = await fetch(backendUrl, {
        method: 'POST',
        headers,
        body: backendFormData,
      });
    } catch (fetchError: any) {
      console.error('❌ Fetch error details:', {
        message: fetchError.message,
        backendUrl,
        error: fetchError,
        code: (fetchError as any).code,
        cause: (fetchError as any).cause,
      });

      // Provide helpful error message
      let errorMessage = 'Failed to connect to backend';
      if (
        fetchError.message?.includes('ECONNREFUSED') ||
        fetchError.message?.includes('fetch failed')
      ) {
        errorMessage = `Backend server is not running or not accessible at ${backendUrl}. Please ensure the backend is running on port 3001.`;
      } else {
        errorMessage = `Failed to connect to backend: ${fetchError.message}`;
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          details: {
            backendUrl,
            error: fetchError.message,
            suggestion: 'Make sure the backend server is running on port 3001',
          },
        },
        { status: 500 }
      );
    }

    let result: any;
    try {
      result = await response.json();
    } catch (jsonError: any) {
      console.error('❌ JSON parse error:', jsonError);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid response from backend',
          status: response.status,
        },
        { status: response.status || 500 }
      );
    }

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || 'Upload failed' },
      { status: response.status }
    );
  } catch (error: any) {
    console.error('Upload proxy error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ success: true, message: 'Upload API is available' });
}
