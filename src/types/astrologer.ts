export interface Astrologer {
  id: string;
  name: string;
  avatar?: string;
  specializations: string[];
  languages: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  totalSessions: number;
  satisfactionRate: number;
  isOnline: boolean;
  chatRate: number;
  callRate: number;
  videoRate: number;
  chatEnabled: boolean;
  callEnabled: boolean;
  videoEnabled: boolean;
  bio: string;
}

export interface AstrologerReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AstrologerListResponse {
  astrologers: Astrologer[];
  total: number;
  page: number;
}

export interface AstrologerFilter {
  search?: string;
  type?: 'chat' | 'call' | 'video';
  specialization?: string;
  onlineOnly?: boolean;
}
