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
  status: number;
  success: boolean;
  data: {
    items: AstrologerListItem[];
    pagination: AstrologerPagination;
  };
  message: string;
  requestId: string;
}

export interface AstrologerListItem {
  _id: string;
  userId: string;
  user: {
    _id: string;
    fullName: string;
    isOnline: boolean;
  };
  experience: number;
  languages: string[];
  specializations: string[];
  chatRate: number;
  callRate: number;
  videoRate: number;
  rating: number;
  totalReviews: number;
  isAvailableForChat: boolean;
  isAvailableForCall: boolean;
  isAvailableForVideo: boolean;
  profilePhoto: string;
}

export interface AstrologerDetail {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    isOnline: boolean;
  };
  bio: string;
  experience: number;
  languages: string[];
  specializations: string[];
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
}

export interface AstrologerDetailApiResponse {
  status: number;
  success: boolean;
  data: AstrologerDetail;
  message: string;
  requestId: string;
}

export interface AstrologerPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AstrologerFilter {
  search?: string;
  availability?: 'chat' | 'call' | 'video';
  specialization?: string;
  online?: boolean;
  language?: string;
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
