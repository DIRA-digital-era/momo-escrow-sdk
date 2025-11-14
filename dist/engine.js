import { TransactionStatus } from "./types.js";
import { CryptoService } from "./crypto.js";
import { MtnProvider, OrangeProvider } from "./providers/index.js";
class EscrowEngine {
  constructor(config) {
    this.config = config;
    this.crypto = new CryptoService();
    this.provider = this.createProvider(config.provider, config.providerConfig);
  }
  async initiatePayment(params) {
    const fee = params.amount * (this.config.feePercent / 100);
    const netAmount = params.amount - fee;
    const transactionId = await this.crypto.generateTransactionId();
    const collectionReference = await this.crypto.generateReference();
    const disbursementReference = await this.crypto.generateReference();
    try {
      const collectionParams = {
        amount: params.amount,
        from: params.sender,
        reference: collectionReference,
        description: params.description
      };
      const collectionResult = await this.provider.initiateCollection(collectionParams);
      if (!collectionResult.success) {
        throw new Error(`Collection failed: ${JSON.stringify(collectionResult)}`);
      }
      const disbursementParams = {
        amount: netAmount,
        to: params.receiver,
        reference: disbursementReference,
        description: params.description
      };
      const disbursementResult = await this.provider.initiateDisbursement(disbursementParams);
      if (!disbursementResult.success) {
        throw new Error(`Disbursement failed: ${JSON.stringify(disbursementResult)}`);
      }
      const receipt = await this.generateReceipt({
        transactionId,
        amount: params.amount,
        fee,
        netAmount,
        sender: params.sender,
        receiver: params.receiver,
        currency: params.currency || "XOF",
        metadata: params.metadata
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
          disbursement: disbursementResult.rawResponse
        }
      };
    } catch (error) {
      throw new Error(`Payment initiation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async generateReceipt(data) {
    const receiptData = {
      id: await this.crypto.generateRandomString(),
      transactionId: data.transactionId,
      amount: data.amount,
      fee: data.fee,
      netAmount: data.netAmount,
      sender: data.sender,
      receiver: data.receiver,
      currency: data.currency,
      timestamp: /* @__PURE__ */ new Date(),
      metadata: data.metadata
    };
    const hmacSecret = this.config.hmacSecret || "default-receipt-secret";
    const signature = await this.crypto.hmacSHA256(
      hmacSecret,
      JSON.stringify(receiptData)
    );
    return {
      ...receiptData,
      hmacSignature: signature
    };
  }
  createProvider(provider, config) {
    switch (provider) {
      case "mtn":
        return new MtnProvider(config);
      case "orange":
        return new OrangeProvider(config);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
  async verifyReceipt(receipt) {
    try {
      const hmacSecret = this.config.hmacSecret || "default-receipt-secret";
      const { hmacSignature, ...receiptData } = receipt;
      return await this.crypto.verifyHMAC(hmacSecret, JSON.stringify(receiptData), hmacSignature);
    } catch {
      return false;
    }
  }
}
export {
  EscrowEngine
};
