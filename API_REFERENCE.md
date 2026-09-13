# Astro Mobile App - API Reference

## Base Configuration

**Base URL:** `http://98.88.19.190:8000`

**CSRF Token Endpoint:** `GET /csrf-token`
```json
Response: {
  "csrfToken": "84a9f9df3df68e3f60db91fafafe7e4158ed185c15c7b54cc7d00896da7dbbefff5a84763598bdb17f18759da1502cd609b56bd676b0191750a737395966b056"
}
```

## Headers

All API requests automatically include:
```
Authorization: Bearer {accessToken}
x-csrf-token: {csrfToken}
Content-Type: application/json
Accept: application/json
```

## Authentication Endpoints

### Send OTP
```
POST /auth/send-otp
Body: {
  "phone": "9876543210",
  "countryCode": "+91",
  "role": "customer" | "astrologer"
}
Response: { "message": "OTP sent successfully" }
```

### Verify OTP
```
POST /auth/verify-otp
Body: {
  "phone": "9876543210",
  "otp": "123456",
  "role": "customer" | "astrologer"
}
Response: {
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  },
  "user": {
    "id": "...",
    "phone": "9876543210",
    "role": "customer" | "astrologer",
    "isProfileComplete": true,
    "isApproved": true
  }
}
```

### Logout
```
POST /auth/logout
Response: (clears local tokens)
```

### Refresh Token
```
POST /auth/refresh-token
Body: { "refreshToken": "..." }
Response: { "accessToken": "..." }
```

## Customer Endpoints

### Get Customer Profile
```
GET /customer/profile
Response: CustomerProfile
```

### Update Customer Profile
```
PUT /customer/profile
Body: {
  "name": "John Doe",
  "email": "john@example.com"
}
Response: CustomerProfile
```

### Get Home Page Data
```
GET /customer/home
Response: {
  "recentAstrologers": [...],
  "recommendedAstrologers": [...],
  "upcomingConsultations": [...]
}
```

## Astrologer Public Endpoints

### List Astrologers
```
GET /astrologers?page=1&search=&type=chat&specialization=Vedic&onlineOnly=true
Response: {
  "astrologers": [Astrologer[]],
  "total": 100,
  "page": 1
}
```

### Get Astrologer Details
```
GET /astrologers/{id}
Response: Astrologer
```

### Get Astrologer Reviews
```
GET /astrologers/{id}/reviews?page=1
Response: AstrologerReview[]
```

## Astrologer Profile Endpoints

### Get Self Profile
```
GET /astrologer/profile
Response: AstrologerProfile
```

### Update Self Profile
```
PUT /astrologer/profile
Body: {
  "name": "Dr. Sharma",
  "bio": "Expert in Vedic astrology",
  "experience": 10,
  "languages": ["Hindi", "English"],
  "specializations": ["Vedic", "Kundali"]
}
Response: AstrologerProfile
```

### Update Availability
```
PUT /astrologer/availability
Body: {
  "isOnline": true,
  "chatEnabled": true,
  "callEnabled": true,
  "videoEnabled": true
}
```

### Update Rates
```
PUT /astrologer/rates
Body: {
  "chatRate": 10,
  "callRate": 15,
  "videoRate": 25
}
```

### Get Dashboard
```
GET /astrologer/dashboard
Response: {
  "todayEarnings": 500,
  "monthEarnings": 15000,
  "rating": 4.8,
  "walletBalance": 5000,
  "todaySessions": 5,
  "monthSessions": 120
}
```

### Get Sessions
```
GET /astrologer/sessions?page=1
Response: Consultation[]
```

### Get Earnings
```
GET /astrologer/earnings
Response: {
  "todayEarnings": 500,
  "weekEarnings": 3000,
  "monthEarnings": 15000,
  "totalEarnings": 150000,
  "chartData": [{ "date": "2026-09-13", "amount": 500 }]
}
```

## Consultation Endpoints

### Book Consultation
```
POST /consultations/book
Body: {
  "astrologerId": "123",
  "type": "chat" | "call" | "video",
  "question": "Will I get married this year?"
}
Response: Consultation
```

### Cancel Consultation
```
POST /consultations/{id}/cancel
```

### Accept Consultation Request
```
POST /consultations/{id}/accept
```

### Decline Consultation Request
```
POST /consultations/{id}/decline
```

### End Consultation
```
POST /consultations/{id}/end
Response: Consultation
```

### Get Active Consultation
```
GET /consultations/active
Response: Consultation | null
```

### Get Consultation History
```
GET /consultations/history?page=1
Response: Consultation[]
```

## Chat Endpoints

### Get Messages
```
GET /chat/{consultationId}/messages
Response: ChatMessage[]
```

### Send Message
```
POST /chat/{consultationId}/send
Body: { "content": "Hello!" }
Response: ChatMessage
```

## Wallet Endpoints

### Get Balance
```
GET /wallet/balance
Response: {
  "balance": 5000,
  "totalSpent": 10000,
  "totalSessions": 25
}
```

### Get Transactions
```
GET /wallet/transactions?page=1
Response: Transaction[]
```

### Initiate Recharge
```
POST /wallet/recharge
Body: {
  "amount": 1000,
  "paymentMethod": "upi" | "card" | "netbanking"
}
Response: {
  "orderId": "123",
  "razorpayOrderId": "pay_123",
  "amount": 1000,
  "currency": "INR",
  "keyId": "key_123"
}
```

### Verify Payment
```
POST /wallet/verify-payment
Body: {
  "razorpayOrderId": "pay_123",
  "razorpayPaymentId": "pay_id_123",
  "razorpaySignature": "signature"
}
Response: {
  "balance": 6000,
  "message": "Payment verified successfully"
}
```

## Notification Endpoints

### Get Notifications
```
GET /notifications?page=1
Response: AppNotification[]
```

### Mark as Read
```
PUT /notifications/{id}/read
```

### Mark All as Read
```
PUT /notifications/mark-all-read
```

## Review Endpoints

### Submit Review
```
POST /reviews
Body: {
  "consultationId": "123",
  "rating": 5,
  "comment": "Great consultation!"
}
```

## Registration Endpoints

### Submit Astrologer Registration
```
POST /astrologer-registration
Body: {
  "fullName": "Dr. Sharma",
  "displayName": "Dr. Sharma",
  "gender": "male",
  "dateOfBirth": "1980-01-01",
  "city": "Delhi",
  "state": "Delhi",
  "experience": 10,
  "specializations": ["Vedic", "Kundali"],
  "languages": ["Hindi", "English"],
  "bio": "Expert astrologer",
  "chatRate": 10,
  "callRate": 15,
  "videoRate": 25,
  "aadhaarNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "bankAccountNumber": "1234567890",
  "ifscCode": "HDFC0000123",
  "accountHolderName": "Dr. Sharma",
  "bankName": "HDFC Bank",
  "certificates": ["url1", "url2"],
  "profilePhoto": "url",
  "termsAccepted": true,
  "agreementAccepted": true
}
Response: RegistrationResponse
```

### Get Registration Status
```
GET /astrologer-registration/status
Response: RegistrationResponse
```

## Usage Examples

### Using Auth Service
```typescript
import {authService} from './services/authService';

// Send OTP
await authService.sendOtp({
  phone: '9876543210',
  countryCode: '+91',
  role: 'customer'
});

// Verify OTP
const response = await authService.verifyOtp({
  phone: '9876543210',
  otp: '123456',
  role: 'customer'
});
// Tokens are automatically saved

// Logout
await authService.logout();
```

### Using Customer Service
```typescript
import {customerService} from './services/customerService';

// Get profile
const profile = await customerService.getProfile();

// Update profile
const updated = await customerService.updateProfile({
  name: 'John Doe',
  email: 'john@example.com'
});

// Get home page data
const homeData = await customerService.getHome();
```

### Using Consultation Service
```typescript
import {consultationService} from './services/consultationService';

// Book consultation
const consultation = await consultationService.book({
  astrologerId: '123',
  type: 'chat',
  question: 'Will I get married?'
});

// Send message
const message = await consultationService.sendMessage(
  consultation.id,
  'Hello Astrologer!'
);

// Get messages
const messages = await consultationService.getMessages(consultation.id);
```

## Error Handling

All service methods use the centralized `apiClient` which handles:
- CSRF token fetching and caching
- Bearer token attachment
- Automatic token refresh on 401
- Request/response error handling

```typescript
try {
  const profile = await customerService.getProfile();
} catch (error) {
  console.error('Failed to fetch profile:', error);
  // Handle error
}
```

## Response Types

All responses are fully typed with TypeScript interfaces:
- `CustomerProfile` - Customer user profile
- `AstrologerProfile` - Astrologer user profile
- `Consultation` - Consultation session
- `ChatMessage` - Chat message
- `Transaction` - Wallet transaction
- `AppNotification` - App notification
- And more...

## Notes

- CSRF token is automatically fetched and cached
- Bearer token is automatically attached to all requests
- Tokens are stored securely in MMKV storage
- Failed requests with 401 status trigger automatic token refresh
- All timestamps are in ISO 8601 format
- Pagination uses `page` parameter (1-indexed)
