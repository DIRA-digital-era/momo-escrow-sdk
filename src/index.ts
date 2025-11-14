import { EscrowEngine } from './engine';
import { MomoConfig, PaymentParams, PaymentResult } from './types';

export class MomoSDK {
  private engine: EscrowEngine;

  constructor(config: MomoConfig) {
    this.engine = new EscrowEngine(config);
  }

  async initiatePayment(params: PaymentParams): Promise<PaymentResult> {
    return this.engine.initiatePayment(params);
  }

  async verifyReceipt(receipt: any): Promise<boolean> {
    return this.engine.verifyReceipt(receipt);
  }
}

// Export all types for consumers
export * from './types';
export { EscrowEngine } from './engine';