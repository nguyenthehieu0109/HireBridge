const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Named export for standardized POST requests
export async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Yêu cầu thất bại');
  return data;
}

interface RequestConfig extends RequestInit {
    headers?: Record<string, string>;
}

const api = {
  get: async (path: string, config: RequestConfig = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
        ...config,
        method: 'GET',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Yêu cầu thất bại');
    return { data };
  },
  post: async (path: string, body?: Record<string, unknown> | FormData, config: RequestConfig = {}) => {
    const isFormData = body instanceof FormData;
    const headers = { ...config.headers };
    
    // If it's not FormData, default to JSON
    if (!isFormData && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }
    
    // Note: for FormData, we MUST NOT set Content-Type so fetch sets the boundary
    if (isFormData) {
        delete headers['Content-Type'];
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...config,
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Yêu cầu thất bại');
    return { data };
  },
  patch: async (path: string, body?: Record<string, unknown>, config: RequestConfig = {}) => {
    // If body is skipped and only config is provided (axios-like)
    if (typeof body === 'object' && body !== null && !Array.isArray(body) && !(body instanceof FormData) && Object.keys(body).length === 0 && config === undefined) {
        // handle case where patch is called with 1 arg
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...config,
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...config.headers 
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Yêu cầu thất bại');
    return { data };
  },
  delete: async (path: string, config: RequestConfig = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
      ...config,
      method: 'DELETE',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Yêu cầu thất bại');
    return { data };
  }
};

export default api;
