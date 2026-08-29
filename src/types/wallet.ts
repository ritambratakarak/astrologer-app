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
  balance: number;
  totalSpent: number;
  totalSessions: number;
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
