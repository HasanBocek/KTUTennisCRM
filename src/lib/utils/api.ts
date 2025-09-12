import { env } from "$env/dynamic/public";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export async function apiRequest<T = any>(
  endpoint: string, 
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
  try {
    // Determine access token
    const accessToken = 
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

    // Prepare headers
    const headers: Record<string, string> = {
      ...options.headers,
      ...(accessToken ? { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json' 
      } : {})
    };

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      ...(options.body ? { 
        body: JSON.stringify(options.body) 
      } : {}),
      credentials: 'include'
    };

    // Perform fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    fetchOptions.signal = controller.signal;

    // Make the request
    const response = await fetch(`${env.PUBLIC_BACKEND_URL}${endpoint}`, fetchOptions).catch((error) => {
      console.error('API Request Error:', error);
      return {
        success: false,
        errors: ['Network Error: Unable to connect to the server']
      };
    });
    clearTimeout(timeoutId);

    // Handle network/response errors
    if (!response.ok) {
      return {
        success: false,
        errors: [`HTTP Error: ${response.status} ${response.statusText}`]
      };
    }

    // Parse response
    const data = await response.json();

    // Check API-level success
    if (data.code !== 200) {
      return {
        success: false,
        message: data.message,
        errors: data.errors || [`API Error: ${data.message || 'Unknown error'}`]
      };
    }

    // Successful response
    return {
      success: true,
      data: data.data,
      message: data.message
    };

  } catch (error) {
    // Handle various error types
    console.error('API Request Error:', error);

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

// Convenience methods for different HTTP methods
export const apiGet = <T = any>(endpoint: string, options: Omit<Parameters<typeof apiRequest>[1], 'method'> = {}) => 
  apiRequest<T>(endpoint, { ...options, method: 'GET' });

export const apiPost = <T = any>(endpoint: string, body: any, options: Omit<Parameters<typeof apiRequest>[1], 'method' | 'body'> = {}) => 
  apiRequest<T>(endpoint, { ...options, method: 'POST', body });

export const apiPatch = <T = any>(endpoint: string, body: any, options: Omit<Parameters<typeof apiRequest>[1], 'method' | 'body'> = {}) => 
  apiRequest<T>(endpoint, { ...options, method: 'PATCH', body });

export const apiDelete = <T = any>(endpoint: string, options: Omit<Parameters<typeof apiRequest>[1], 'method'> = {}) => 
  apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
