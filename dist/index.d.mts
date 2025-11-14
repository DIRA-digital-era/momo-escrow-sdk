import { MomoConfig, PaymentParams, PaymentResult } from './types.mjs';
export { CollectionParams, DisbursementParams, PaymentProvider, ProviderConfig, ProviderResponse, Receipt, TransactionStatus, VerificationResult } from './types.mjs';
export { EscrowEngine } from './engine.mjs';

declare class MomoSDK {
    private engine;
    constructor(config: MomoConfig);
    initiatePayment(params: PaymentParams): Promise<PaymentResult>;
    verifyReceipt(receipt: any): Promise<boolean>;
}

export { MomoConfig, MomoSDK, PaymentParams, PaymentResult };
