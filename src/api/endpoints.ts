export const Endpoints = {
  // Auth
  auth: {
    sendOtp: '/auth/send-otp',
    verifyOtp: '/auth/verify-otp',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
  },

  // Customer
  customer: {
    profile: '/customer/profile',
    updateProfile: '/customer/profile',
    home: '/customer/home',
  },

  // Astrologer public listing
  astrologers: {
    list: '/astrologers',
    detail: (id: string) => `/astrologers/${id}`,
    reviews: (id: string) => `/astrologers/${id}/reviews`,
  },

  // Astrologer profile (self)
  astrologer: {
    profile: '/astrologer/profile',
    updateProfile: '/astrologer/profile',
    updateAvailability: '/astrologer/availability',
    updateRates: '/astrologer/rates',
    dashboard: '/astrologer/dashboard',
    sessions: '/astrologer/sessions',
    earnings: '/astrologer/earnings',
  },

  // Consultations
  consultations: {
    book: '/consultations/book',
    cancel: (id: string) => `/consultations/${id}/cancel`,
    accept: (id: string) => `/consultations/${id}/accept`,
    decline: (id: string) => `/consultations/${id}/decline`,
    end: (id: string) => `/consultations/${id}/end`,
    active: '/consultations/active',
    history: '/consultations/history',
  },

  // Chat
  chat: {
    messages: (consultationId: string) => `/chat/${consultationId}/messages`,
    send: (consultationId: string) => `/chat/${consultationId}/send`,
  },

  // Wallet
  wallet: {
    balance: '/wallet/balance',
    transactions: '/wallet/transactions',
    recharge: '/wallet/recharge',
    verifyPayment: '/wallet/verify-payment',
  },

  // Reviews
  reviews: {
    submit: '/reviews',
  },

  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
  },

  // Registration
  registration: {
    submit: '/astrologer-registration',
    status: '/astrologer-registration/status',
  },
} as const;
