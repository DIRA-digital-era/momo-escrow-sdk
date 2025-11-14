class HttpClient {
  async request(url, options = {}) {
    const { method = "GET", headers = {}, body } = options;
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };
    if (body) {
      config.body = JSON.stringify(body);
    }
    const response = await fetch(url, config);
    const text = await response.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }
    if (!response.ok) {
      const errorMessage = json.message || text || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }
    return json;
  }
  async get(url, headers) {
    return this.request(url, { method: "GET", headers });
  }
  async post(url, body, headers) {
    return this.request(url, { method: "POST", body, headers });
  }
}
export {
  HttpClient
};
