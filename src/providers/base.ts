import { PaymentProvider, ProviderConfig, CollectionParams, DisbursementParams, VerificationResult, ProviderResponse, TransactionStatus } from '../types';
import { HttpClient } from '../http';

export abstract class BaseProvider implements PaymentProvider {
  protected http: HttpClient;
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.http = new HttpClient();
  }

  abstract initiateCollection(params: CollectionParams): Promise<ProviderResponse>;
  abstract initiateDisbursement(params: DisbursementParams): Promise<ProviderResponse>;
  abstract verifyTransaction(reference: string): Promise<VerificationResult>;
  abstract getProviderName(): string;

  protected getAuthHeaders(): Record<string, string> {
    const authString = btoa(`${this.config.apiUser}:${this.config.apiSecret}`);
    return {
      'Authorization': `Basic ${authString}`,
      'X-API-Key': this.config.apiKey,
    };
  }

  protected handleProviderError(error: any, context: string): never {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`${this.getProviderName()} ${context}: ${errorMessage}`);
  }
}