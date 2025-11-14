import { MomoConfig, PaymentParams, PaymentResult } from './types.mjs';

declare class EscrowEngine {
    private config;
    private provider;
    private crypto;
    constructor(config: MomoConfig);
    initiatePayment(params: PaymentParams): Promise<PaymentResult>;
    private generateReceipt;
    private createProvider;
    verifyReceipt(receipt: any): Promise<boolean>;
}

export { EscrowEngine };
