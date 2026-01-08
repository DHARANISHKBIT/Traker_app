# Tracker App API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. User Registration
**POST** `/users/register`

Register a new user account.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (Success - 201)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "message": "User already exists with this email",
  "error": "REGISTRATION_FAILED"
}
```

#### Validation Rules
- `name`: Required, string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

---

### 2. User Login
**POST** `/users/login`

Authenticate user and return JWT token.

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response (Error - 401)
```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "LOGIN_FAILED"
}
```

---

### 3. Get User Profile
**GET** `/users/profile`

Get authenticated user's profile information.

#### Headers
```
Authorization: Bearer <your_jwt_token>
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Response (Error - 401)
```json
{
  "success": false,
  "message": "Access token required",
  "error": "NO_TOKEN"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `MISSING_FIELDS` | Required fields are missing |
| `MISSING_CREDENTIALS` | Email or password is missing |
| `REGISTRATION_FAILED` | User registration failed |
| `LOGIN_FAILED` | Login authentication failed |
| `NO_TOKEN` | Authorization token is missing |
| `INVALID_TOKEN` | Authorization token is invalid |
| `TOKEN_ERROR` | Token verification failed |
| `PROFILE_ERROR` | Failed to retrieve profile |

## Testing the API

You can test the API using the provided test script:

```bash
node test-api.js
```

Or use tools like Postman, curl, or any HTTP client:

### Example curl commands:

#### Register
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

#### Get Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

Make sure your `.env` file contains:

```env
MONGO_URI=mongodb://localhost:27017/tracker_app
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed)
}
```
