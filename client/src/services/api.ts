// Central API client with automatic token handling, refresh rotation, and error parsing

const API_BASE_URL = '/api';

class ApiService {
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  private getHeaders(isFormData = false): HeadersInit {
    const headers: Record<string, string> = {};
    const token = localStorage.getItem('careerpilot_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public async post<T>(endpoint: string, body?: any, isFormData = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      isFormData
    });
  }

  public async patch<T>(endpoint: string, body?: any, isFormData = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: isFormData ? body : JSON.stringify(body),
      isFormData
    });
  }

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  private async request<T>(
    endpoint: string,
    options: { method: string; body?: any; isFormData?: boolean }
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(options.isFormData);

    let res: Response;
    try {
      res = await fetch(url, {
        method: options.method,
        headers,
        body: options.body,
        credentials: 'include'
      });
    } catch (networkError: any) {
      throw new Error(`Network error: Unable to connect to server. (${networkError.message})`);
    }

    // Handle 401 Unauthorized with token refresh (if not already refreshing and not auth endpoints)
    if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/refresh')) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newToken = data?.data?.accessToken || data?.accessToken;
            if (newToken) {
              localStorage.setItem('careerpilot_token', newToken);
              this.isRefreshing = false;
              this.onTokenRefreshed(newToken);

              // Retry original request with new token
              const retryHeaders = this.getHeaders(options.isFormData);
              const retryRes = await fetch(url, {
                method: options.method,
                headers: retryHeaders,
                body: options.body,
                credentials: 'include'
              });
              return this.handleResponse<T>(retryRes);
            }
          }
        } catch (e) {
          console.warn('Auto refresh failed:', e);
        }
        this.isRefreshing = false;
        localStorage.removeItem('careerpilot_token');
      } else {
        // Wait for active refresh
        return new Promise<T>((resolve, reject) => {
          this.addRefreshSubscriber(async () => {
            try {
              const retryHeaders = this.getHeaders(options.isFormData);
              const retryRes = await fetch(url, {
                method: options.method,
                headers: retryHeaders,
                body: options.body,
                credentials: 'include'
              });
              resolve(await this.handleResponse<T>(retryRes));
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    }

    return this.handleResponse<T>(res);
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      (error as any).status = res.status;
      (error as any).data = data;
      throw error;
    }
    return data as T;
  }
}

export const api = new ApiService();
