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
POST /auth/refresh
Body: { "refreshToken": "..." }
Response: {
  "status": 200,
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "...",
  "requestId": "..."
}
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

### Upload Customer Profile Photo
```
POST /api/v1/customer/profile/photo
Content-Type: multipart/form-data
Fields:
  photo: image file
Response: {
  "success": true,
  "message": "Profile photo uploaded successfully"
}
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

### Upload Astrologer Registration Document
```
POST /astrologer/registration/upload-document
Content-Type: multipart/form-data
Fields:
  file: document file
  documentName: human-readable document name (for example, "Profile Photo")
  documentType: profilePhoto | panPhoto | aadharPhoto | certificate | other
Response: {
  "status": 200,
  "success": true,
  "data": [
    {
      "documentType": "profilePhoto",
      "url": "uploads/kyc/example.jpg"
    }
  ],
  "message": "Documents uploaded successfully."
}
```

Documents are selected in the registration form and uploaded before the user submits.
The returned URLs for the profile photo, PAN card, Aadhaar card, and certificates are
included in the registration request.

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

Get Api
{{api}}/wallet/transactions?page=1&limit=20


response
{
    "status": 200,
    "success": true,
    "data": {
        "items": [
            {
                "_id": "6af3eef489eee9f0c5511294",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 1710,
                "type": "debit",
                "reason": "consultation",
                "referenceId": "6af3eed989eee9f0c551101c",
                "referenceModel": "Consultation",
                "balanceBefore": 2000,
                "balanceAfter": 290,
                "description": "video consultation payment",
                "createdAt": "2026-11-09T05:15:09.212Z",
                "updatedAt": "2026-11-09T05:15:09.212Z",
                "__v": 0
            },
            {
                "_id": "6af3eef389eee9f0c5511291",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 500,
                "type": "credit",
                "reason": "recharge",
                "balanceBefore": 1500,
                "balanceAfter": 2000,
                "description": "Wallet recharge via Razorpay",
                "createdAt": "2026-11-06T04:28:35.964Z",
                "updatedAt": "2026-11-06T04:28:35.964Z",
                "__v": 0
            },
            {
                "_id": "6af3eef489eee9f0c5511296",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 810,
                "type": "debit",
                "reason": "consultation",
                "referenceId": "6af3eed989eee9f0c5511014",
                "referenceModel": "Consultation",
                "balanceBefore": 290,
                "balanceAfter": 0,
                "description": "call consultation payment",
                "createdAt": "2026-11-05T04:48:09.005Z",
                "updatedAt": "2026-11-05T04:48:09.005Z",
                "__v": 0
            },
            {
                "_id": "6af3eef489eee9f0c5511298",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 375,
                "type": "debit",
                "reason": "consultation",
                "referenceId": "6af3eed889eee9f0c551100c",
                "referenceModel": "Consultation",
                "balanceBefore": 0,
                "balanceAfter": 0,
                "description": "chat consultation payment",
                "createdAt": "2026-11-01T04:55:08.809Z",
                "updatedAt": "2026-11-01T04:55:08.809Z",
                "__v": 0
            },
            {
                "_id": "6af3eef489eee9f0c551129a",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 200,
                "type": "debit",
                "reason": "consultation",
                "referenceId": "6af3eed889eee9f0c5511004",
                "referenceModel": "Consultation",
                "balanceBefore": 0,
                "balanceAfter": 0,
                "description": "chat consultation payment",
                "createdAt": "2026-10-27T04:40:08.238Z",
                "updatedAt": "2026-10-27T04:40:08.238Z",
                "__v": 0
            },
            {
                "_id": "6af3eef489eee9f0c551129c",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 750,
                "type": "debit",
                "reason": "consultation",
                "referenceId": "6af3eed889eee9f0c5511000",
                "referenceModel": "Consultation",
                "balanceBefore": 0,
                "balanceAfter": 0,
                "description": "video consultation payment",
                "createdAt": "2026-10-22T05:00:08.128Z",
                "updatedAt": "2026-10-22T05:00:08.128Z",
                "__v": 0
            },
            {
                "_id": "6af3eef389eee9f0c551128f",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 1000,
                "type": "credit",
                "reason": "recharge",
                "balanceBefore": 500,
                "balanceAfter": 1500,
                "description": "Wallet recharge via Razorpay",
                "createdAt": "2026-10-22T04:28:35.895Z",
                "updatedAt": "2026-10-22T04:28:35.895Z",
                "__v": 0
            },
            {
                "_id": "6af3eef489eee9f0c551129e",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 360,
                "type": "debit",
                "reason": "consultation",
                "referenceId": "6af3eed889eee9f0c5510ffc",
                "referenceModel": "Consultation",
                "balanceBefore": 0,
                "balanceAfter": 0,
                "description": "call consultation payment",
                "createdAt": "2026-10-17T04:50:08.005Z",
                "updatedAt": "2026-10-17T04:50:08.005Z",
                "__v": 0
            },
            {
                "_id": "6af3eef489eee9f0c55112a0",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 375,
                "type": "debit",
                "reason": "consultation",
                "referenceId": "6af3eed789eee9f0c5510ff8",
                "referenceModel": "Consultation",
                "balanceBefore": 0,
                "balanceAfter": 0,
                "description": "chat consultation payment",
                "createdAt": "2026-10-12T04:45:07.847Z",
                "updatedAt": "2026-10-12T04:45:07.847Z",
                "__v": 0
            },
            {
                "_id": "6af3eef389eee9f0c551128d",
                "userId": "6aa5649066c3885370eab4cc",
                "amount": 500,
                "type": "credit",
                "reason": "recharge",
                "balanceBefore": 0,
                "balanceAfter": 500,
                "description": "Wallet recharge via Razorpay",
                "createdAt": "2026-10-07T04:28:35.837Z",
                "updatedAt": "2026-10-07T04:28:35.837Z",
                "__v": 0
            }
        ],
        "pagination": {
            "total": 10,
            "page": 1,
            "limit": 20,
            "totalPages": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    },
    "message": "Transactions fetched successfully.",
    "requestId": "eb32fd24-4fa1-4dcc-9ff4-1215e4e23bcb"
}


Get Api
{{api}}/consultations?page=1&limit=10

{
    "status": 200,
    "success": true,
    "data": {
        "items": [
            {
                "_id": "6af3eed989eee9f0c5511024",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa4330a342ad6c62d400c0b",
                    "fullName": "Rajendra Joshi"
                },
                "type": "call",
                "status": "accepted",
                "ratePerMinute": 28,
                "durationMinutes": 0,
                "totalAmount": 0,
                "isReviewed": false,
                "createdAt": "2026-11-11T04:28:09.404Z",
                "updatedAt": "2026-11-11T04:28:09.404Z",
                "__v": 0
            },
            {
                "_id": "6af3eed989eee9f0c5511020",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa4330a342ad6c62d400bfd",
                    "fullName": "Vikram Bhatia"
                },
                "type": "chat",
                "status": "pending",
                "ratePerMinute": 30,
                "durationMinutes": 0,
                "totalAmount": 0,
                "customerNote": "Financial decisions this year",
                "isReviewed": false,
                "createdAt": "2026-11-11T04:28:09.308Z",
                "updatedAt": "2026-11-11T04:28:09.308Z",
                "__v": 0
            },
            {
                "_id": "6af3eed989eee9f0c551101c",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa4330a342ad6c62d400c0b",
                    "fullName": "Rajendra Joshi"
                },
                "type": "video",
                "status": "completed",
                "ratePerMinute": 38,
                "startedAt": "2026-11-09T04:30:09.212Z",
                "endedAt": "2026-11-09T05:15:09.212Z",
                "durationMinutes": 45,
                "totalAmount": 1710,
                "customerNote": "Upcoming travel plans",
                "isReviewed": true,
                "createdAt": "2026-11-09T04:28:09.212Z",
                "updatedAt": "2026-11-09T04:28:09.212Z",
                "__v": 0
            },
            {
                "_id": "6af3eed989eee9f0c5511018",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa4330a342ad6c62d400bef",
                    "fullName": "Suresh Iyer"
                },
                "type": "chat",
                "status": "rejected",
                "ratePerMinute": 25,
                "durationMinutes": 0,
                "totalAmount": 0,
                "customerNote": "Marriage compatibility check",
                "isReviewed": false,
                "createdAt": "2026-11-07T04:28:09.106Z",
                "updatedAt": "2026-11-07T04:28:09.106Z",
                "__v": 0
            },
            {
                "_id": "6af3eed989eee9f0c5511014",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa4330a342ad6c62d400bfd",
                    "fullName": "Vikram Bhatia"
                },
                "type": "call",
                "status": "completed",
                "ratePerMinute": 45,
                "startedAt": "2026-11-05T04:30:09.005Z",
                "endedAt": "2026-11-05T04:48:09.005Z",
                "durationMinutes": 18,
                "totalAmount": 810,
                "astrologerNote": "Saturn transit affecting 7th house. Suggested patience.",
                "isReviewed": false,
                "createdAt": "2026-11-05T04:28:09.005Z",
                "updatedAt": "2026-11-05T04:28:09.005Z",
                "__v": 0
            },
            {
                "_id": "6af3eed889eee9f0c5511010",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa4330a342ad6c62d400bef",
                    "fullName": "Suresh Iyer"
                },
                "type": "video",
                "status": "cancelled",
                "ratePerMinute": 50,
                "durationMinutes": 0,
                "totalAmount": 0,
                "customerNote": "Financial decisions this year",
                "cancellationReason": "Customer not available",
                "isReviewed": false,
                "createdAt": "2026-11-03T04:28:08.906Z",
                "updatedAt": "2026-11-03T04:28:08.906Z",
                "__v": 0
            },
            {
                "_id": "6af3eed889eee9f0c551100c",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa43309342ad6c62d400be8",
                    "fullName": "Kavya Menon"
                },
                "type": "chat",
                "status": "completed",
                "ratePerMinute": 15,
                "startedAt": "2026-11-01T04:30:08.809Z",
                "endedAt": "2026-11-01T04:55:08.809Z",
                "durationMinutes": 25,
                "totalAmount": 375,
                "customerNote": "Health concerns for family",
                "astrologerNote": "Moon in 12th — overseas opportunity likely.",
                "isReviewed": false,
                "createdAt": "2026-11-01T04:28:08.809Z",
                "updatedAt": "2026-11-01T04:28:08.809Z",
                "__v": 0
            },
            {
                "_id": "6af3eed889eee9f0c5511008",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa43309342ad6c62d400be1",
                    "fullName": "Pt. Ramesh Tiwari"
                },
                "type": "call",
                "status": "cancelled",
                "ratePerMinute": 30,
                "durationMinutes": 0,
                "totalAmount": 0,
                "customerNote": "Need guidance on career change",
                "cancellationReason": "Rescheduled for later",
                "isReviewed": false,
                "createdAt": "2026-10-30T04:28:08.374Z",
                "updatedAt": "2026-10-30T04:28:08.374Z",
                "__v": 0
            },
            {
                "_id": "6af3eed889eee9f0c5511004",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa43309342ad6c62d400be1",
                    "fullName": "Pt. Ramesh Tiwari"
                },
                "type": "chat",
                "status": "completed",
                "ratePerMinute": 20,
                "startedAt": "2026-10-27T04:30:08.238Z",
                "endedAt": "2026-10-27T04:40:08.238Z",
                "durationMinutes": 10,
                "totalAmount": 200,
                "customerNote": "Relationship advice needed",
                "astrologerNote": "Lagnesh strong. Career progress expected.",
                "isReviewed": false,
                "createdAt": "2026-10-27T04:28:08.238Z",
                "updatedAt": "2026-10-27T04:28:08.238Z",
                "__v": 0
            },
            {
                "_id": "6af3eed889eee9f0c5511000",
                "customerId": "6aa5649066c3885370eab4cc",
                "astrologerId": {
                    "_id": "6aa4330a342ad6c62d400bf6",
                    "fullName": "Ananya Das"
                },
                "type": "video",
                "status": "completed",
                "ratePerMinute": 25,
                "startedAt": "2026-10-22T04:30:08.128Z",
                "endedAt": "2026-10-22T05:00:08.128Z",
                "durationMinutes": 30,
                "totalAmount": 750,
                "customerNote": "Business venture timing",
                "astrologerNote": "Saturn transit affecting 7th house. Suggested patience.",
                "isReviewed": true,
                "createdAt": "2026-10-22T04:28:08.128Z",
                "updatedAt": "2026-10-22T04:28:08.128Z",
                "__v": 0
            }
        ],
        "pagination": {
            "total": 12,
            "page": 1,
            "limit": 10,
            "totalPages": 2,
            "hasNextPage": true,
            "hasPrevPage": false
        }
    },
    "message": "Consultation fetched successfully.",
    "requestId": "4fcb0028-6272-487c-929e-47ebe8229e55"
}

