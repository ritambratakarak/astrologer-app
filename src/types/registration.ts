export interface AstrologerKycRegistrationData {
  fullName: string;
  displayName: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  experience: number;
  address: {
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  specializations: string[];
  languages: string[];
  bio: string;
  chatRate: number;
  voiceCallRate: number;
  videoCallRate: number;
  panCard: {
    number: string;
    photoUrl: string;
  };
  aadharCard: {
    number: string;
    photoUrl: string;
  };
  profilePhotoUrl: string;
  certificateUrls: string[];
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
}

export type RegistrationDocumentKind =
  | 'profilePhoto'
  | 'panPhoto'
  | 'aadharPhoto'
  | 'certificate'
  | 'other';

export interface RegistrationDocumentFile {
  uri: string;
  name: string;
  type: string;
  uploadedUrl?: string;
}

export interface RegistrationResponse {
  applicationId: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  message: string;
}
