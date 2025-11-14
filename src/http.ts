export class HttpClient {
  async request<T>(
    url: string, 
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body } = options;
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    
    if (body) {
      config.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, config);
    const text = await response.text();
    
    let json: T;
    try {
      json = text ? JSON.parse(text) : {} as T;
    } catch {
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }
    
    if (!response.ok) {
      const errorMessage = (json as any).message || text || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }
    
    return json;
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: 'GET', headers });
  }

  async post<T>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: 'POST', body, headers });
  }
}