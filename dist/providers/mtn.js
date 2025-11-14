import { BaseProvider } from "./base.js";
import { TransactionStatus } from "../types.js";
class MtnProvider extends BaseProvider {
  constructor(config) {
    super(config);
  }
  getProviderName() {
    return "MTN Mobile Money";
  }
  async initiateCollection(params) {
    try {
      const payload = {
        amount: params.amount,
        currency: "XOF",
        customerId: params.from,
        externalId: params.reference,
        description: params.description || "Payment collection"
      };
      const response = await this.http.post(
        `${this.config.baseUrl}/collection/v1/request`,
        payload,
        this.getAuthHeaders()
      );
      return {
        success: response.status === "PENDING" || response.status === "SUCCESSFUL",
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
        amount: params.amount,
        currency: "XOF",
        payeeId: params.to,
        externalId: params.reference,
        description: params.description || "Payment disbursement"
      };
      const response = await this.http.post(
        `${this.config.baseUrl}/disbursement/v1/transfer`,
        payload,
        this.getAuthHeaders()
      );
      return {
        success: response.status === "PENDING" || response.status === "SUCCESSFUL",
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
        `${this.config.baseUrl}/transaction/v1/status/${reference}`,
        this.getAuthHeaders()
      );
      const statusMap = {
        "PENDING": TransactionStatus.PENDING,
        "SUCCESSFUL": TransactionStatus.COLLECTED,
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
  MtnProvider
};
