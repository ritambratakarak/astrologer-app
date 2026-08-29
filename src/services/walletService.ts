import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {
  WalletBalance,
  Transaction,
  RechargeRequest,
  RechargeResponse,
} from '../types/wallet';

export const walletService = {
  async getBalance(): Promise<WalletBalance> {
    const {data} = await apiClient.get<WalletBalance>(Endpoints.wallet.balance);
    return data;
  },

  async getTransactions(page = 1): Promise<Transaction[]> {
    const {data} = await apiClient.get<Transaction[]>(
      Endpoints.wallet.transactions,
      {params: {page}},
    );
    return data;
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
