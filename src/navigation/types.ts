import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {ConsultationType} from '../types/consultation';
import type {UserRole} from '../types/auth';

// ─── Auth Stack ───────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Splash: undefined;
  Role: undefined;
  Phone: {role: UserRole};
  Otp: {phone: string; role: UserRole};
  ProfileSetup: undefined;
  AstrologerRegister: undefined;
  Submitted: {applicationId: string};
};

// ─── Customer Tab ─────────────────────────────────────────────────────────────
export type CustomerTabParamList = {
  HomeTab: undefined;
  BrowseTab: undefined;
  ConsultTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

// ─── Customer Stack (wraps tabs + detail screens) ─────────────────────────────
export type CustomerStackParamList = {
  CustomerTabs: undefined;
  AstrologerDetail: {astrologerId: string};
  Book: {
    astrologerId: string;
    astrologerName: string;
    chatRate: number;
    callRate: number;
    videoRate: number;
    chatEnabled: boolean;
    callEnabled: boolean;
    videoEnabled: boolean;
    isOnline: boolean;
  };
  Pending: {
    consultationId: string;
    astrologerName: string;
    type: ConsultationType;
    ratePerMinute: number;
  };
  Chat: {
    consultationId: string;
    astrologerName: string;
    type: ConsultationType;
    ratePerMinute: number;
  };
  SessionEnded: {
    durationMinutes: number;
    amountCharged: number;
    astrologerName: string;
    balanceLeft: number;
    consultationId: string;
  };
  Review: {consultationId: string; astrologerName: string};
  Rejected: {astrologerName: string};
  Transactions: undefined;
  Notifications: undefined;
};

// ─── Astrologer Tab ───────────────────────────────────────────────────────────
export type AstrologerTabParamList = {
  DashboardTab: undefined;
  RequestsTab: undefined;
  SessionsTab: undefined;
  EarningsTab: undefined;
  ProfileTab: undefined;
};

// ─── Astrologer Stack ─────────────────────────────────────────────────────────
export type AstrologerStackParamList = {
  AstrologerTabs: undefined;
  Incoming: {
    consultationId: string;
    customerName: string;
    customerSessions: number;
    type: ConsultationType;
    ratePerMinute: number;
    question?: string;
  };
  AstrologerChat: {
    consultationId: string;
    customerName: string;
    type: ConsultationType;
    ratePerMinute: number;
  };
  AstrologerNotifications: undefined;
};

// ─── Screen prop helpers ──────────────────────────────────────────────────────
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type CustomerScreenProps<T extends keyof CustomerStackParamList> =
  NativeStackScreenProps<CustomerStackParamList, T>;

export type AstrologerScreenProps<T extends keyof AstrologerStackParamList> =
  NativeStackScreenProps<AstrologerStackParamList, T>;

export type CustomerTabProps<T extends keyof CustomerTabParamList> =
  BottomTabScreenProps<CustomerTabParamList, T>;

export type AstrologerTabProps<T extends keyof AstrologerTabParamList> =
  BottomTabScreenProps<AstrologerTabParamList, T>;
