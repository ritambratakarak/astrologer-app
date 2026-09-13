import {Platform} from 'react-native';

export const API_BASE_URL = 'http://98.88.19.190:8000/api/v1';
export const CSRF_TOKEN_URL = 'http://98.88.19.190:8000/csrf-token';

export const TOKEN_KEYS = {
  ACCESS: 'astro_access_token',
  REFRESH: 'astro_refresh_token',
  ROLE: 'astro_role',
  USER_ID: 'astro_user_id',
  CSRF: 'astro_csrf_token',
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
