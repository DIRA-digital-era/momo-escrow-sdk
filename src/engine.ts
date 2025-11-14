import { MomoConfig, PaymentParams, PaymentResult, TransactionStatus, PaymentProvider, CollectionParams, DisbursementParams } from './types';
import { CryptoService } from './crypto';
import { MtnProvider, OrangeProvider } from './providers/index';

export class EscrowEngine {
  private config: MomoConfig;
  private provider: PaymentProvider;
  private crypto: CryptoService;

  constructor(config: MomoConfig) {
    this.config = config;
    this.crypto = new CryptoService();
    this.provider = this.createProvider(config.provider, config.providerConfig);
  }

  async initiatePayment(params: PaymentParams): Promise<PaymentResult> {
    // Calculate fees
    const fee = params.amount * (this.config.feePercent / 100);
    const netAmount = params.amount - fee;
    
    // Generate transaction IDs
    const transactionId = await this.crypto.generateTransactionId();
    const collectionReference = await this.crypto.generateReference();
    const disbursementReference = await this.crypto.generateReference();

    try {
      // STEP 1: Collect from sender to escrow
      const collectionParams: CollectionParams = {
        amount: params.amount,
        from: params.sender,
        reference: collectionReference,
        description: params.description,
      };

      const collectionResult = await this.provider.initiateCollection(collectionParams);
      
      if (!collectionResult.success) {
        throw new Error(`Collection failed: ${JSON.stringify(collectionResult)}`);
      }

      // STEP 2: Disburse from escrow to receiver (net amount)
      const disbursementParams: DisbursementParams = {
        amount: netAmount,
        to: params.receiver,
        reference: disbursementReference,
        description: params.description,
      };

      const disbursementResult = await this.provider.initiateDisbursement(disbursementParams);
      
      if (!disbursementResult.success) {
        throw new Error(`Disbursement failed: ${JSON.stringify(disbursementResult)}`);
      }

      // Generate receipt
      const receipt = await this.generateReceipt({
        transactionId,
        amount: params.amount,
        fee,
        netAmount,
        sender: params.sender,
        receiver: params.receiver,
        currency: params.currency || 'XOF',
        metadata: params.metadata,
      });

      return {
        transactionId,
        reference: collectionReference,
        status: TransactionStatus.COLLECTION_INITIATED,
        fee,
        netAmount,
        receipt,
        providerResponse: {
          collection: collectionResult.rawResponse,
          disbursement: disbursementResult.rawResponse,
        },
      };

    } catch (error) {
      throw new Error(`Payment initiation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateReceipt(data: {
    transactionId: string;
    amount: number;
    fee: number;
    netAmount: number;
    sender: string;
    receiver: string;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    const receiptData = {
      id: await this.crypto.generateRandomString(),
      transactionId: data.transactionId,
      amount: data.amount,
      fee: data.fee,
      netAmount: data.netAmount,
      sender: data.sender,
      receiver: data.receiver,
      currency: data.currency,
      timestamp: new Date(),
      metadata: data.metadata,
    };

    // Sign the receipt
    const hmacSecret = this.config.hmacSecret || 'default-receipt-secret';
    const signature = await this.crypto.hmacSHA256(
      hmacSecret,
      JSON.stringify(receiptData)
    );

    return {
      ...receiptData,
      hmacSignature: signature,
    };
  }

  private createProvider(provider: string, config: any): PaymentProvider {
    switch (provider) {
      case 'mtn':
        return new MtnProvider(config);
      case 'orange':
        return new OrangeProvider(config);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  async verifyReceipt(receipt: any): Promise<boolean> {
    try {
      const hmacSecret = this.config.hmacSecret || 'default-receipt-secret';
      const { hmacSignature, ...receiptData } = receipt;
      return await this.crypto.verifyHMAC(hmacSecret, JSON.stringify(receiptData), hmacSignature);
    } catch {
      return false;
    }
  }
}