import { EscrowEngine } from "./engine.js";
class MomoSDK {
  constructor(config) {
    this.engine = new EscrowEngine(config);
  }
  async initiatePayment(params) {
    return this.engine.initiatePayment(params);
  }
  async verifyReceipt(receipt) {
    return this.engine.verifyReceipt(receipt);
  }
}
export * from "./types.js";
import { EscrowEngine as EscrowEngine2 } from "./engine.js";
export {
  EscrowEngine2 as EscrowEngine,
  MomoSDK
};
