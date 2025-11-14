import { PaymentProvider, ProviderConfig, CollectionParams, ProviderResponse, DisbursementParams, VerificationResult } from '../types.mjs';
import { HttpClient } from '../http.mjs';

declare abstract class BaseProvider implements PaymentProvider {
    protected http: HttpClient;
    protected config: ProviderConfig;
    constructor(config: ProviderConfig);
    abstract initiateCollection(params: CollectionParams): Promise<ProviderResponse>;
    abstract initiateDisbursement(params: DisbursementParams): Promise<ProviderResponse>;
    abstract verifyTransaction(reference: string): Promise<VerificationResult>;
    abstract getProviderName(): string;
    protected getAuthHeaders(): Record<string, string>;
    protected handleProviderError(error: any, context: string): never;
}

export { BaseProvider };
