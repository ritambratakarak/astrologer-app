import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {
  WalletBalance,
  WalletBalanceApiResponse,
  TransactionsResponse,
  RechargeRequest,
  RechargeResponse,
} from '../types/wallet';

export const walletService = {
  async getBalance(): Promise<WalletBalance> {
    const {data: response} = await apiClient.get<WalletBalanceApiResponse>(
      Endpoints.wallet.balance,
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Could not load wallet balance.');
    }
    return response.data;
  },

  async getTransactions(page = 1, limit = 20): Promise<TransactionsResponse> {
    const {data: response} = await apiClient.get<TransactionsResponse>(
      Endpoints.wallet.transactions,
      {params: {page, limit}},
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Could not load wallet transactions.');
    }
    return response;
  },

  async initiateRecharge(
    payload: RechargeRequest,
  ): Promise<RechargeResponse> {
    const {data} = await apiClient.post<RechargeResponse>(
      Endpoints.wallet.recharge,
      payload,
    );
    return data;
  },

  async verifyPayment(payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{balance: number; message: string}> {
    const {data} = await apiClient.post<{balance: number; message: string}>(
      Endpoints.wallet.verifyPayment,
      payload,
    );
    return data;
  },
};
