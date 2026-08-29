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
