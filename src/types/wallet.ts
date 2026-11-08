export type TransactionType = 'credit' | 'debit';
export type TransactionCategory =
  | 'recharge'
  | 'chat'
  | 'call'
  | 'video'
  | 'refund'
  | 'withdrawal'
  | 'earning';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface WalletBalance {
  _id: string;
  userId: string;
  balance: number;
  currency: string;
  totalEarned: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WalletBalanceApiResponse {
  status: number;
  success: boolean;
  data: WalletBalance;
  message: string;
  requestId: string;
}

export interface RechargeRequest {
  amount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking';
}

export interface RechargeResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}
