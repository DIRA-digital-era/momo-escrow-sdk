import { BaseProvider } from './base';
import { CollectionParams, DisbursementParams, VerificationResult, ProviderResponse, TransactionStatus } from '../types';

interface OrangeCollectionResponse {
  transId: string;
  status: 'INITIATED' | 'SUCCESS' | 'FAILED';
  amount?: string;
}

interface OrangeDisbursementResponse {
  transId: string;
  status: 'INITIATED' | 'SUCCESS' | 'FAILED';
  amount?: string;
}

export class OrangeProvider extends BaseProvider {
  constructor(config: any) {
    super(config);
  }

  getProviderName(): string {
    return 'Orange Money';
  }

  async initiateCollection(params: CollectionParams): Promise<ProviderResponse> {
    try {
      const payload = {
        amount: params.amount.toString(),
        currency: 'XOF',
        customerId: params.from,
        orderId: params.reference,
        description: params.description || 'Payment collection',
      };

      const response = await this.http.post<OrangeCollectionResponse>(
        `${this.config.baseUrl}/api/eWallet/v1/payments`,
        payload,
        this.getAuthHeaders()
      );

      return {
        success: response.status === 'INITIATED' || response.status === 'SUCCESS',
        reference: params.reference,
        rawResponse: response,
      };
    } catch (error) {
      return this.handleProviderError(error, 'collection initiation');
    }
  }

  async initiateDisbursement(params: DisbursementParams): Promise<ProviderResponse> {
    try {
      const payload = {
        amount: params.amount.toString(),
        currency: 'XOF',
        recipientId: params.to,
        orderId: params.reference,
        description: params.description || 'Payment disbursement',
      };

      const response = await this.http.post<OrangeDisbursementResponse>(
        `${this.config.baseUrl}/api/eWallet/v1/payouts`,
        payload,
        this.getAuthHeaders()
      );

      return {
        success: response.status === 'INITIATED' || response.status === 'SUCCESS',
        reference: params.reference,
        rawResponse: response,
      };
    } catch (error) {
      return this.handleProviderError(error, 'disbursement initiation');
    }
  }

  async verifyTransaction(reference: string): Promise<VerificationResult> {
    try {
      const response = await this.http.get<any>(
        `${this.config.baseUrl}/api/eWallet/v1/transactions/${reference}`,
        this.getAuthHeaders()
      );

      const statusMap: Record<string, TransactionStatus> = {
        'INITIATED': TransactionStatus.PENDING,
        'SUCCESS': TransactionStatus.COLLECTED,
        'FAILED': TransactionStatus.COLLECTION_FAILED,
      };

      return {
        status: statusMap[response.status] || TransactionStatus.PENDING,
        amount: response.amount ? parseFloat(response.amount) : undefined,
        rawResponse: response,
      };
    } catch (error) {
      return this.handleProviderError(error, 'transaction verification');
    }
  }
}