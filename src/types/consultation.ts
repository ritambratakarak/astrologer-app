export type ConsultationType = 'chat' | 'call' | 'video';
export type ConsultationStatus =
  | 'pending'
  | 'accepted'
  | 'active'
  | 'completed'
  | 'declined'
  | 'cancelled';

export interface Consultation {
  id: string;
  astrologerId: string;
  customerId: string;
  type: ConsultationType;
  status: ConsultationStatus;
  question?: string;
  startedAt?: string;
  endedAt?: string;
  durationMinutes?: number;
  amountCharged?: number;
  ratePerMinute: number;
  createdAt: string;
}

export interface ConsultationListItem {
  _id: string;
  customerId: string;
  astrologerId: {
    _id: string;
    fullName: string;
  };
  type: ConsultationType;
  status: ConsultationStatus | 'rejected' | (string & {});
  ratePerMinute: number;
  durationMinutes: number;
  totalAmount: number;
  startedAt?: string;
  endedAt?: string;
  customerNote?: string;
  astrologerNote?: string;
  cancellationReason?: string;
  isReviewed: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ConsultationListPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ConsultationListResponse {
  status: number;
  success: boolean;
  data: {
    items: ConsultationListItem[];
    pagination: ConsultationListPagination;
  };
  message: string;
  requestId: string;
}

export interface BookConsultationRequest {
  astrologerId: string;
  type: ConsultationType;
  question?: string;
}

export interface IncomingRequest {
  consultationId: string;
  customerId: string;
  customerName: string;
  customerSessions: number;
  type: ConsultationType;
  ratePerMinute: number;
  question?: string;
}

export interface ChatMessage {
  id: string;
  consultationId: string;
  senderId: string;
  senderRole: 'customer' | 'astrologer';
  content: string;
  createdAt: string;
}
