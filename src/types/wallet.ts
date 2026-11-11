export type TransactionType = 'credit' | 'debit';
export type TransactionCategory =
  | 'recharge'
  | 'consultation'
  | 'refund'
  | 'withdrawal'
  | 'earning'
  | (string & {});

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  reason: TransactionCategory;
  amount: number;
  description: string;
  referenceId?: string;
  referenceModel?: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TransactionsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TransactionsResponse {
  status: number;
  success: boolean;
  data: {
    items: Transaction[];
    pagination: TransactionsPagination;
  };
  message: string;
  requestId: string;
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
