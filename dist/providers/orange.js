import { BaseProvider } from "./base.js";
import { TransactionStatus } from "../types.js";
class OrangeProvider extends BaseProvider {
  constructor(config) {
    super(config);
  }
  getProviderName() {
    return "Orange Money";
  }
  async initiateCollection(params) {
    try {
      const payload = {
        amount: params.amount.toString(),
        currency: "XOF",
        customerId: params.from,
        orderId: params.reference,
        description: params.description || "Payment collection"
      };
      const response = await this.http.post(
        `${this.config.baseUrl}/api/eWallet/v1/payments`,
        payload,
        this.getAuthHeaders()
      );
      return {
        success: response.status === "INITIATED" || response.status === "SUCCESS",
        reference: params.reference,
        rawResponse: response
      };
    } catch (error) {
      return this.handleProviderError(error, "collection initiation");
    }
  }
  async initiateDisbursement(params) {
    try {
      const payload = {
        amount: params.amount.toString(),
        currency: "XOF",
        recipientId: params.to,
        orderId: params.reference,
        description: params.description || "Payment disbursement"
      };
      const response = await this.http.post(
        `${this.config.baseUrl}/api/eWallet/v1/payouts`,
        payload,
        this.getAuthHeaders()
      );
      return {
        success: response.status === "INITIATED" || response.status === "SUCCESS",
        reference: params.reference,
        rawResponse: response
      };
    } catch (error) {
      return this.handleProviderError(error, "disbursement initiation");
    }
  }
  async verifyTransaction(reference) {
    try {
      const response = await this.http.get(
        `${this.config.baseUrl}/api/eWallet/v1/transactions/${reference}`,
        this.getAuthHeaders()
      );
      const statusMap = {
        "INITIATED": TransactionStatus.PENDING,
        "SUCCESS": TransactionStatus.COLLECTED,
        "FAILED": TransactionStatus.COLLECTION_FAILED
      };
      return {
        status: statusMap[response.status] || TransactionStatus.PENDING,
        amount: response.amount ? parseFloat(response.amount) : void 0,
        rawResponse: response
      };
    } catch (error) {
      return this.handleProviderError(error, "transaction verification");
    }
  }
}
export {
  OrangeProvider
};
