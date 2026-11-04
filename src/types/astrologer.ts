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

export interface AstrologerSelfProfile {
  _id: string;
  userId: string;
  displayName: string;
  secondaryContact: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  degree: string;
  experience: number;
  address: {
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  languages: string[];
  specializations: string[];
  bio: string;
  chatRate: number;
  callRate: number;
  videoRate: number;
  rating: number;
  totalReviews: number;
  totalConsultations: number;
  status: string;
  isAvailableForChat: boolean;
  isAvailableForCall: boolean;
  isAvailableForVideo: boolean;
  documents: string[];
  certificates: string[];
  isKycSubmitted: boolean;
  aadharCard: {
    number: string;
    photo: string;
  };
  panCard: {
    number: string;
    photo: string;
  };
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  profilePhoto: string;
  createdAt: string;
  updatedAt: string;
}

export interface AstrologerSelfProfileApiResponse {
  status: number;
  success: boolean;
  data: AstrologerSelfProfile;
  message: string;
  requestId: string;
}
