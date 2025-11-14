interface PaymentParams {
    amount: number;
    sender: string;
    receiver: string;
    currency?: string;
    description?: string;
    metadata?: Record<string, any>;
}
interface PaymentResult {
    transactionId: string;
    reference: string;
    status: TransactionStatus;
    fee: number;
    netAmount: number;
    receipt: Receipt;
    providerResponse?: any;
}
interface Receipt {
    id: string;
    transactionId: string;
    amount: number;
    fee: number;
    netAmount: number;
    sender: string;
    receiver: string;
    currency: string;
    timestamp: Date;
    hmacSignature: string;
    metadata?: Record<string, any>;
}
interface MomoConfig {
    provider: 'mtn' | 'orange';
    providerConfig: ProviderConfig;
    escrowAccount: string;
    feePercent: number;
    hmacSecret?: string;
}
declare enum TransactionStatus {
    PENDING = "pending",
    COLLECTION_INITIATED = "collection_initiated",
    COLLECTED = "collected",
    COLLECTION_FAILED = "collection_failed",
    DISBURSEMENT_INITIATED = "disbursement_initiated",
    DISBURSED = "disbursed",
    DISBURSEMENT_FAILED = "disbursement_failed",
    REFUNDED = "refunded"
}
interface ProviderConfig {
    baseUrl: string;
    apiKey: string;
    apiUser: string;
    apiSecret: string;
    callbackUrl?: string;
}
interface CollectionParams {
    amount: number;
    from: string;
    reference: string;
    description?: string;
}
interface DisbursementParams {
    amount: number;
    to: string;
    reference: string;
    description?: string;
}
interface ProviderResponse {
    success: boolean;
    reference: string;
    rawResponse?: any;
}
interface VerificationResult {
    status: TransactionStatus;
    amount?: number;
    rawResponse?: any;
}
interface PaymentProvider {
    initiateCollection(params: CollectionParams): Promise<ProviderResponse>;
    initiateDisbursement(params: DisbursementParams): Promise<ProviderResponse>;
    verifyTransaction(reference: string): Promise<VerificationResult>;
    getProviderName(): string;
}

export { type CollectionParams, type DisbursementParams, type MomoConfig, type PaymentParams, type PaymentProvider, type PaymentResult, type ProviderConfig, type ProviderResponse, type Receipt, TransactionStatus, type VerificationResult };
