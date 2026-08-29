export interface AstrologerRegistrationStep1 {
  fullName: string;
  displayName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  city: string;
  state: string;
}

export interface AstrologerRegistrationStep2 {
  experience: number;
  specializations: string[];
  languages: string[];
  bio: string;
}

export interface AstrologerRegistrationStep3 {
  chatRate: number;
  callRate: number;
  videoRate: number;
}

export interface AstrologerRegistrationStep4 {
  aadhaarNumber: string;
  panNumber: string;
}

export interface AstrologerRegistrationStep5 {
  bankAccountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

export interface AstrologerRegistrationStep6 {
  certificates: string[];
  profilePhoto: string;
}

export interface AstrologerRegistrationData
  extends AstrologerRegistrationStep1,
    AstrologerRegistrationStep2,
    AstrologerRegistrationStep3,
    AstrologerRegistrationStep4,
    AstrologerRegistrationStep5,
    AstrologerRegistrationStep6 {
  termsAccepted: boolean;
  agreementAccepted: boolean;
}

export interface RegistrationResponse {
  applicationId: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  message: string;
}
