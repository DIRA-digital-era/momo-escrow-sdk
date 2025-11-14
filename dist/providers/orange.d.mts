import { BaseProvider } from './base.mjs';
import { CollectionParams, ProviderResponse, DisbursementParams, VerificationResult } from '../types.mjs';
import '../http.mjs';

declare class OrangeProvider extends BaseProvider {
    constructor(config: any);
    getProviderName(): string;
    initiateCollection(params: CollectionParams): Promise<ProviderResponse>;
    initiateDisbursement(params: DisbursementParams): Promise<ProviderResponse>;
    verifyTransaction(reference: string): Promise<VerificationResult>;
}

export { OrangeProvider };
