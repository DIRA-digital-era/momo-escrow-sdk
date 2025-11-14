import { BaseProvider } from './base';
import { CollectionParams, DisbursementParams, VerificationResult, ProviderResponse, TransactionStatus } from '../types';

interface MtnCollectionResponse {
  transactionId: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  amount?: string;
}

interface MtnDisbursementResponse {
  transactionId: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  amount?: string;
}

export class MtnProvider extends BaseProvider {
  constructor(config: any) {
    super(config);
  }

  getProviderName(): string {
    return 'MTN Mobile Money';
  }

  async initiateCollection(params: CollectionParams): Promise<ProviderResponse> {
    try {
      const payload = {
        amount: params.amount,
        currency: 'XOF',
        customerId: params.from,
        externalId: params.reference,
        description: params.description || 'Payment collection',
      };

      const response = await this.http.post<MtnCollectionResponse>(
        `${this.config.baseUrl}/collection/v1/request`,
        payload,
        this.getAuthHeaders()
      );

      return {
        success: response.status === 'PENDING' || response.status === 'SUCCESSFUL',
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
        amount: params.amount,
        currency: 'XOF',
        payeeId: params.to,
        externalId: params.reference,
        description: params.description || 'Payment disbursement',
      };

      const response = await this.http.post<MtnDisbursementResponse>(
        `${this.config.baseUrl}/disbursement/v1/transfer`,
        payload,
        this.getAuthHeaders()
      );

      return {
        success: response.status === 'PENDING' || response.status === 'SUCCESSFUL',
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
        `${this.config.baseUrl}/transaction/v1/status/${reference}`,
        this.getAuthHeaders()
      );

      const statusMap: Record<string, TransactionStatus> = {
        'PENDING': TransactionStatus.PENDING,
        'SUCCESSFUL': TransactionStatus.COLLECTED,
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