export const API_BASE_URL = 'http://localhost:4000/api/v1';

export const TOKEN_KEYS = {
  ACCESS: 'astro_access_token',
  REFRESH: 'astro_refresh_token',
  ROLE: 'astro_role',
  USER_ID: 'astro_user_id',
} as const;

export const CONSULTATION_TYPES = {
  CHAT: 'chat',
  CALL: 'call',
  VIDEO: 'video',
} as const;

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ASTROLOGER: 'astrologer',
} as const;

export const RECHARGE_AMOUNTS = [100, 200, 500, 1000, 2000, 5000] as const;

export const SPECIALIZATIONS = [
  'Vedic', 'Kundali', 'Lal Kitab', 'Muhurta',
  'Tarot', 'Numerology', 'Vastu', 'Palmistry',
  'Prashna', 'Face Reading',
] as const;

export const LANGUAGES = ['Hindi', 'English', 'Sanskrit', 'Tamil', 'Telugu', 'Bengali'] as const;
