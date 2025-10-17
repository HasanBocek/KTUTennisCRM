import { env } from "$env/dynamic/public";

// Enum for HTTP methods to provide type safety
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

// Enhanced error types
export class ApiError extends Error {
  public readonly statusCode?: number;
  public readonly errors?: string[];

  constructor(message: string, statusCode?: number, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Improved API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Configuration interface for API requests
interface ApiRequestConfig {
  timeout?: number;
  includeCredentials?: boolean;
  headers?: Record<string, string>;
  accessToken?: string | null;
}

// Central API request function with improved error handling
export async function apiRequest<T = any>(
  endpoint: string, 
  options: {
    method?: HttpMethod;
    body?: any;
    config?: ApiRequestConfig;
  } = {}
): Promise<ApiResponse<T>> {
  const {
    method = HttpMethod.GET, 
    body,
    config = {}
  } = options;

  const {
    timeout = 10000,
    includeCredentials = true,
    headers: customHeaders = {},
    accessToken = null
  } = config;

  try {
    // Prepare headers with dynamic token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      ...customHeaders
    };

    // Prepare fetch options
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(includeCredentials ? { credentials: 'include' } : {})
    };

    // Perform fetch with enhanced error handling
    const response = await fetch(`${env.PUBLIC_BACKEND_URL}${endpoint}`, fetchOptions);

    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        `HTTP Error: ${response.status} ${response.statusText}`, 
        response.status, 
        errorData.errors || [`HTTP Error: ${response.status}`]
      );
    }

    // Parse response
    const data = await response.json();

    // Check API-level success
    if (data.code !== 200) {
      throw new ApiError(
        data.message || 'API Error', 
        data.code, 
        data.errors || [`API Error: ${data.message || 'Unknown error'}`]
      );
    }

    // Successful response
    return {
      success: true,
      data: data.data,
      message: data.message
    };

  } catch (error) {
    // Comprehensive error handling
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.errors
      };
    }

    if (error instanceof TypeError) {
      return {
        success: false,
        errors: ['Network Error: Unable to connect to the server']
      };
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        errors: ['Request Timeout: The server took too long to respond']
      };
    }

    // Fallback error handling
    return {
      success: false,
      errors: [
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred'
      ]
    };
  }
}

// Convenience methods for different HTTP methods with improved typing
export const apiGet = <T = any>(
  endpoint: string, 
  config: Omit<ApiRequestConfig, 'method'> = {}
) => apiRequest<T>(endpoint, { method: HttpMethod.GET, config });

export const apiPost = <T = any>(
  endpoint: string, 
  body: any, 
  config: Omit<ApiRequestConfig, 'method' | 'body'> = {}
) => apiRequest<T>(endpoint, { method: HttpMethod.POST, body, config });

export const apiPatch = <T = any>(
  endpoint: string, 
  body: any, 
  config: Omit<ApiRequestConfig, 'method' | 'body'> = {}
) => apiRequest<T>(endpoint, { method: HttpMethod.PATCH, body, config });

export const apiDelete = <T = any>(
  endpoint: string, 
  config: Omit<ApiRequestConfig, 'method'> = {}
) => apiRequest<T>(endpoint, { method: HttpMethod.DELETE, config });
