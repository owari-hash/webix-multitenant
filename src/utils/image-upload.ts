import { backendRequest, getBackendUrl } from './backend-api';
import { getAuthToken } from './auth';

/**
 * Upload an image file to the server
 * @param file - The image file to upload
 * @returns Promise with the uploaded image URL
 */
export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const token = getAuthToken();
  
  // Use Next.js API route as proxy to avoid CORS and connection issues
  // This works for both localhost and production
  const backendUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:8002';

  // Extract subdomain from current hostname
  let detectedSubdomain: string | undefined;
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      detectedSubdomain = parts[0];
    }
  }

  const headers: HeadersInit = {};
  // Don't set Content-Type for FormData - browser will set it with boundary
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Forward subdomain to backend
  if (detectedSubdomain) {
    let mainDomain = 'anzaidev.fun';
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      mainDomain = 'localhost:8002';
    }
    const hostHeader = detectedSubdomain.includes('.')
      ? detectedSubdomain
      : `${detectedSubdomain}.${mainDomain}`;
    headers['X-Original-Host'] = hostHeader;
  }

  // Use Next.js API route as proxy (avoids CORS and connection issues)
  const response = await fetch(`${backendUrl}/api/upload`, {
    method: 'POST',
    headers: {
      // Don't set Content-Type - browser will set it with boundary for FormData
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.success && result.file?.url) {
    return result.file.url;
  }

  throw new Error(result.message || 'Image upload failed');
}

/**
 * Upload a base64 image to the server
 * @param base64Image - Base64 image string (with or without data URI prefix)
 * @param filename - Optional filename
 * @returns Promise with the uploaded image URL
 */
export async function uploadBase64Image(base64Image: string, filename?: string): Promise<string> {
  const response = await backendRequest<{ file?: { url: string } }>('/upload/base64', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image,
      filename,
    }),
  });

  if (response.success && (response as any).file?.url) {
    return (response as any).file.url;
  }

  // Create error with status code and retry-after info for better handling
  const error: any = new Error(response.message || 'Base64 image upload failed');
  error.status = (response as any).status;
  error.retryAfter = (response as any).retryAfter;
  error.code = (response as any).code;
  throw error;
}

/**
 * Check if a string is a base64 image
 */
export function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/') || (str.length > 100 && /^[A-Za-z0-9+/=]+$/.test(str));
}

/**
 * Convert base64 image to file and upload
 */
export async function uploadBase64AsFile(base64Image: string, filename = 'image.jpg'): Promise<string> {
  // Extract base64 data and mime type
  let base64Data = base64Image;
  let mimeType = 'image/jpeg';
  let ext = '.jpg';

  if (base64Image.startsWith('data:')) {
    const matches = base64Image.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1];
      base64Data = matches[2];
      
      if (mimeType.includes('png')) ext = '.png';
      else if (mimeType.includes('gif')) ext = '.gif';
      else if (mimeType.includes('webp')) ext = '.webp';
    }
  }

  // Use the base64 upload endpoint
  return uploadBase64Image(base64Image, filename || `image${ext}`);
}

