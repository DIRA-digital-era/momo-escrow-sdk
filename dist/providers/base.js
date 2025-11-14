import { HttpClient } from "../http.js";
class BaseProvider {
  constructor(config) {
    this.config = config;
    this.http = new HttpClient();
  }
  getAuthHeaders() {
    const authString = btoa(`${this.config.apiUser}:${this.config.apiSecret}`);
    return {
      "Authorization": `Basic ${authString}`,
      "X-API-Key": this.config.apiKey
    };
  }
  handleProviderError(error, context) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${this.getProviderName()} ${context}: ${errorMessage}`);
  }
}
export {
  BaseProvider
};
