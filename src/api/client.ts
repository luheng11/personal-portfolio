const API_BASE = '/api'

interface ApiResponse<T> {
  data?: T
  [key: string]: any
}

const getAuthToken = (): string | null => {
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage)
      const token = parsed.token || parsed.state?.token || parsed.data?.token || null
      return token
    } catch {
      return null
    }
  }
  return null
}

const isPublicPath = (url: string): boolean => {
  const publicPaths = ['/auth/login', '/auth/register']
  return publicPaths.includes(url)
}

const getTokenToUse = (token?: string, url?: string): string | null => {
  if (token && token !== '') {
    return token
  }
  if (url && isPublicPath(url)) {
    return null
  }
  return getAuthToken()
}

const handleResponse = async <T>(res: Response): Promise<ApiResponse<T> | T> => {
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.error || 'Request failed')
  }
  
  return data
}

export const apiClient = {
  get: async <T>(url: string, token?: string): Promise<ApiResponse<T> | T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    const authToken = getTokenToUse(token, url)
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    const res = await fetch(`${API_BASE}${url}`, { headers })
    return handleResponse(res)
  },

  post: async <T>(url: string, data: any, token?: string, isFormData = false): Promise<ApiResponse<T> | T> => {
    const headers: Record<string, string> = {}
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }
    const authToken = getTokenToUse(token, url)
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data)
    })
    return handleResponse(res)
  },

  put: async <T>(url: string, data: any, token?: string): Promise<ApiResponse<T> | T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    const authToken = getTokenToUse(token, url)
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(res)
  },

  delete: async <T>(url: string, token?: string): Promise<ApiResponse<T> | T> => {
    const headers: Record<string, string> = {}
    const authToken = getTokenToUse(token, url)
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(res)
  }
}