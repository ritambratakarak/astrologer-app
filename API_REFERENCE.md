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

GET Api
/astrologers?page=1&limit=10
Beraer token

{
    "status": 200,
    "success": true,
    "data": {
        "items": [
            {
                "_id": "6aa4330a342ad6c62d400bff",
                "userId": {
                    "_id": "6aa4330a342ad6c62d400bfd",
                    "fullName": "Vikram Bhatia",
                    "phone": "9100000005",
                    "isOnline": false
                },
                "bio": "Prashna astrology expert and muhurta specialist. Answers life questions with pinpoint accuracy.",
                "experience": 20,
                "languages": [
                    "Hindi",
                    "Punjabi",
                    "English"
                ],
                "specializations": [
                    "prashna",
                    "muhurta",
                    "vedic"
                ],
                "chatRate": 30,
                "callRate": 45,
                "videoRate": 60,
                "rating": 4.9,
                "totalReviews": 380,
                "totalConsultations": 920,
                "status": "approved",
                "isAvailableForChat": false,
                "isAvailableForCall": true,
                "isAvailableForVideo": true,
                "documents": [],
                "degree": "Jyotish Visharad",
                "certificates": [],
                "bankDetails": {
                    "accountHolderName": "Vikram Bhatia",
                    "accountNumber": "334455667788",
                    "bankName": "PNB",
                    "ifscCode": "PUNB0005678",
                    "upiId": "vikram@upi"
                },
                "panCard": {
                    "number": "EFGVB7890V"
                },
                "aadharCard": {
                    "number": "567890123456"
                },
                "address": {
                    "city": "Delhi",
                    "state": "Delhi",
                    "pincode": "110001",
                    "country": "India"
                },
                "isKycSubmitted": true,
                "createdAt": "2026-09-11T16:57:46.200Z",
                "updatedAt": "2026-09-11T16:57:46.200Z",
                "__v": 0
            },
            {
                "_id": "6aa43309342ad6c62d400be3",
                "userId": {
                    "_id": "6aa43309342ad6c62d400be1",
                    "fullName": "Pt. Ramesh Tiwari",
                    "phone": "9100000001",
                    "isOnline": false
                },
                "bio": "Expert in Vedic astrology with 15 years of experience. Specializes in kundali matching and career guidance.",
                "experience": 15,
                "languages": [
                    "Hindi",
                    "English"
                ],
                "specializations": [
                    "vedic",
                    "kundali",
                    "muhurta"
                ],
                "chatRate": 20,
                "callRate": 30,
                "videoRate": 40,
                "rating": 4.8,
                "totalReviews": 230,
                "totalConsultations": 580,
                "status": "approved",
                "isAvailableForChat": true,
                "isAvailableForCall": true,
                "isAvailableForVideo": false,
                "documents": [],
                "degree": "Jyotish Acharya",
                "certificates": [],
                "bankDetails": {
                    "accountHolderName": "Ramesh Tiwari",
                    "accountNumber": "123456789012",
                    "bankName": "SBI",
                    "ifscCode": "SBIN0001234",
                    "upiId": "ramesh@upi"
                },
                "panCard": {
                    "number": "ABCPT1234R"
                },
                "aadharCard": {
                    "number": "123456789012"
                },
                "address": {
                    "city": "Varanasi",
                    "state": "Uttar Pradesh",
                    "pincode": "221001",
                    "country": "India"
                },
                "isKycSubmitted": true,
                "createdAt": "2026-09-11T16:57:45.939Z",
                "updatedAt": "2026-09-11T16:57:45.939Z",
                "__v": 0
            },
            {
                "_id": "6aa4330a342ad6c62d400c0d",
                "userId": {
                    "_id": "6aa4330a342ad6c62d400c0b",
                    "fullName": "Rajendra Joshi",
                    "phone": "9100000007",
                    "isOnline": false
                },
                "bio": "Specializes in Kundali analysis for marriage and business compatibility.",
                "experience": 10,
                "languages": [
                    "Hindi",
                    "Gujarati"
                ],
                "specializations": [
                    "kundali",
                    "vedic",
                    "muhurta"
                ],
                "chatRate": 18,
                "callRate": 28,
                "videoRate": 38,
                "rating": 4.7,
                "totalReviews": 160,
                "totalConsultations": 390,
                "status": "approved",
                "isAvailableForChat": true,
                "isAvailableForCall": true,
                "isAvailableForVideo": false,
                "documents": [],
                "degree": "Jyotish Acharya",
                "certificates": [],
                "bankDetails": {
                    "accountHolderName": "Rajendra Joshi",
                    "accountNumber": "556677889900",
                    "bankName": "SBI",
                    "ifscCode": "SBIN0007890",
                    "upiId": "rajendra@upi"
                },
                "panCard": {
                    "number": "GHIRJ6789X"
                },
                "aadharCard": {
                    "number": "789012345678"
                },
                "address": {
                    "city": "Ahmedabad",
                    "state": "Gujarat",
                    "pincode": "380001",
                    "country": "India"
                },
                "isKycSubmitted": true,
                "createdAt": "2026-09-11T16:57:46.330Z",
                "updatedAt": "2026-09-11T16:57:46.330Z",
                "__v": 0
            },
            {
                "_id": "6aa4330a342ad6c62d400bf1",
                "userId": {
                    "_id": "6aa4330a342ad6c62d400bef",
                    "fullName": "Suresh Iyer",
                    "phone": "9100000003",
                    "isOnline": false
                },
                "bio": "Vastu consultant and palmist. Helping families design harmonious living spaces for over 12 years.",
                "experience": 12,
                "languages": [
                    "Tamil",
                    "English",
                    "Telugu"
                ],
                "specializations": [
                    "vastu",
                    "palmistry"
                ],
                "chatRate": 25,
                "callRate": 35,
                "videoRate": 50,
                "rating": 4.6,
                "totalReviews": 187,
                "totalConsultations": 410,
                "status": "approved",
                "isAvailableForChat": true,
                "isAvailableForCall": true,
                "isAvailableForVideo": true,
                "documents": [],
                "degree": "Vastu Shastra Diploma",
                "certificates": [],
                "bankDetails": {
                    "accountHolderName": "Suresh Iyer",
                    "accountNumber": "112233445566",
                    "bankName": "ICICI",
                    "ifscCode": "ICIC0003456"
                },
                "panCard": {
                    "number": "CDEFSI9012T"
                },
                "aadharCard": {
                    "number": "345678901234"
                },
                "address": {
                    "city": "Chennai",
                    "state": "Tamil Nadu",
                    "pincode": "600001",
                    "country": "India"
                },
                "isKycSubmitted": true,
                "createdAt": "2026-09-11T16:57:46.076Z",
                "updatedAt": "2026-09-11T16:57:46.076Z",
                "__v": 0
            },
            {
                "_id": "6aa4330a342ad6c62d400bea",
                "userId": {
                    "_id": "6aa43309342ad6c62d400be8",
                    "fullName": "Kavya Menon",
                    "phone": "9100000002",
                    "isOnline": false
                },
                "bio": "Tarot reader and numerologist with a modern approach to ancient wisdom. 8 years of practice.",
                "experience": 8,
                "languages": [
                    "English",
                    "Malayalam",
                    "Tamil"
                ],
                "specializations": [
                    "tarot",
                    "numerology"
                ],
                "chatRate": 15,
                "callRate": 25,
                "videoRate": 35,
                "rating": 4.5,
                "totalReviews": 145,
                "totalConsultations": 320,
                "status": "approved",
                "isAvailableForChat": true,
                "isAvailableForCall": false,
                "isAvailableForVideo": true,
                "documents": [],
                "degree": "B.A. Psychology",
                "certificates": [],
                "bankDetails": {
                    "accountHolderName": "Kavya Menon",
                    "accountNumber": "987654321098",
                    "bankName": "HDFC",
                    "ifscCode": "HDFC0002345",
                    "upiId": "kavya@upi"
                },
                "panCard": {
                    "number": "BCDKM5678S"
                },
                "aadharCard": {
                    "number": "234567890123"
                },
                "address": {
                    "city": "Kochi",
                    "state": "Kerala",
                    "pincode": "682001",
                    "country": "India"
                },
                "isKycSubmitted": true,
                "createdAt": "2026-09-11T16:57:46.010Z",
                "updatedAt": "2026-09-11T16:57:46.010Z",
                "__v": 0
            },
            {
                "_id": "6aa4330a342ad6c62d400bf8",
                "userId": {
                    "_id": "6aa4330a342ad6c62d400bf6",
                    "fullName": "Ananya Das",
                    "phone": "9100000004",
                    "isOnline": false
                },
                "bio": "Young and insightful astrologer specializing in face reading and lal kitab remedies.",
                "experience": 3,
                "languages": [
                    "Bengali",
                    "Hindi",
                    "English"
                ],
                "specializations": [
                    "face_reading",
                    "lal_kitab"
                ],
                "chatRate": 10,
                "callRate": 18,
                "videoRate": 25,
                "rating": 4.2,
                "totalReviews": 62,
                "totalConsultations": 140,
                "status": "approved",
                "isAvailableForChat": true,
                "isAvailableForCall": false,
                "isAvailableForVideo": false,
                "documents": [],
                "degree": "M.A. Sanskrit",
                "certificates": [],
                "bankDetails": {
                    "accountHolderName": "Ananya Das",
                    "accountNumber": "223344556677",
                    "bankName": "Axis",
                    "ifscCode": "UTIB0004567",
                    "upiId": "ananya@upi"
                },
                "panCard": {
                    "number": "DEFAD3456U"
                },
                "aadharCard": {
                    "number": "456789012345"
                },
                "address": {
                    "city": "Kolkata",
                    "state": "West Bengal",
                    "pincode": "700001",
                    "country": "India"
                },
                "isKycSubmitted": true,
                "createdAt": "2026-09-11T16:57:46.138Z",
                "updatedAt": "2026-09-11T16:57:46.138Z",
                "__v": 0
            }
        ],
        "pagination": {
            "total": 6,
            "page": 1,
            "limit": 10,
            "totalPages": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    },
    "message": "Astrologers fetched successfully.",
    "requestId": "e5ee92ad-7728-44cb-93b2-432929eed71d"
}