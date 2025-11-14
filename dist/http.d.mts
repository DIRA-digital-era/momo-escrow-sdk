declare class HttpClient {
    request<T>(url: string, options?: {
        method?: string;
        headers?: Record<string, string>;
        body?: any;
    }): Promise<T>;
    get<T>(url: string, headers?: Record<string, string>): Promise<T>;
    post<T>(url: string, body?: any, headers?: Record<string, string>): Promise<T>;
}

export { HttpClient };
