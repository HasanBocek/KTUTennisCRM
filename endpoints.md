# API Documentation

## Table of Contents

- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Authentication Endpoints](#authentication-endpoints)
  - [Register](#register)
  - [Login](#login)
  - [Logout](#logout)
  - [Refresh Tokens](#refresh-tokens)
  - [Forgot Password](#forgot-password)
  - [Reset Password](#reset-password)
  - [Send Verification Email](#send-verification-email)
  - [Verify Email](#verify-email)
- [Users](#users)
  - [Create User](#create-user)
  - [Get All Users](#get-all-users)
  - [Get User](#get-user)
  - [Update User](#update-user)
  - [Delete User](#delete-user)

---

## Response Format

All API responses follow a consistent format:

```json
{
    "code": 200,
    "message": "Success message",
    "errors": [],
    "data": {
        // Response data (if applicable)
    }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `code` | Number | HTTP status code |
| `message` | String | Human-readable message |
| `errors` | Array | Array of error messages (empty on success) |
| `data` | Object | Response data (present only on successful operations) |

---

## Error Handling

When an error occurs, the response will include error details:

```json
{
    "code": 400,
    "message": "Validation failed",
    "errors": [
        "Field 'email' is required",
        "Field 'password' must be at least 8 characters"
    ]
}
```

---

## Authentication

Most endpoints require authentication using Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Access tokens are obtained through the login or register endpoints and should be refreshed using the refresh token endpoint when they expire.

---

## Authentication Endpoints

### Register

Allows students to create their account by themselves.

**Endpoint:** `POST /auth/register`

**Description:**
When a student registers:
- Their account is created in the system
- An access token and a refresh token are returned in the response
- The email address is automatically set to `studentNumber@ogr.ktu.edu.tr`
- A verification link is sent to the student's email to confirm both their student status and account validity

**Note:** Either `firstName` or `lastName` must be provided. Both are not mandatory simultaneously, but at least one is required.

#### Request Body

| Field | Type | Description | Required | Allowed Values | Constraints |
|-------|------|-------------|----------|----------------|-------------|
| `firstName` | String | Student's first name | ✅ | - | Min: 2, Max: 30 chars, letters only |
| `lastName` | String | Student's last name | ✅ | - | Min: 2, Max: 30 chars, letters only |
| `isMale` | String | Indicates if the student is male | ✅ | `"1"`, `"0"` | Must be one of the allowed values |
| `phoneNumber` | String | Student's phone number | ✅ | - | International phone format (E.164), e.g. `+905xxxxxxxxx` |
| `studentNumber` | String | Student's student number | ✅ | - | Exactly 6 digits, numeric only |
| `department` | String | YÖK code of the department | ✅ | - | Must match valid YÖK codes |
| `grade` | String | Student's grade | ✅ | `"Hazırlık"`, `"1. Sınıf"`, `"2. Sınıf"`, `"3. Sınıf"`, `"4. Sınıf"`, `"5. Sınıf"`, `"6. Sınıf"`, `"6+ Sınıf"`, `"Mezun"` | Must be one of the allowed values |
| `skillLevel` | String | Tennis level from 1 to 10 | ✅ | `"1"` to `"10"` | Numeric, between 1 and 10 |
| `password` | String | Password for authentication | ✅ | - | Min: 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character |

#### Example Request

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "isMale": "1",
    "phoneNumber": "+905555555555",
    "studentNumber": "123456",
    "department": "106210211",
    "grade": "1. Sınıf",
    "skillLevel": "4",
    "password": "StrongP@ss123"
}
```

#### Example Response

```json
{
    "code": 200,
    "message": "Kullanıcı başarıyla oluşturuldu.",
    "errors": [],
    "data": {
        "user": {
            "roles": [],
            "isActive": true,
            "groupMemberships": [],
            "isEmailVerified": false,
            "firstName": "John",
            "lastName": "Doe",
            "phoneNumber": "+905555555555",
            "isMale": "1",
            "studentNumber": 123456,
            "department": "106210211",
            "grade": "1. Sınıf",
            "skillLevel": 4,
            "email": "123456@ogr.ktu.edu.tr",
            "isStudent": true,
            "id": "1"
        },
        "tokens": {
            "access": {
                "token": "token",
                "expires": "1970-01-01T00:00:00.000Z"
            },
            "refresh": {
                "token": "token",
                "expires": "1970-01-01T00:00:00.000Z"
            }
        }
    }
}
```

---

### Login

Both students and non-student users can log in using their credentials.

**Endpoint:** `POST /auth/login`

**Description:**
- Students can log in by providing either their student number (e.g. `123456`) or their full university email (e.g. `123456@ogr.ktu.edu.tr`)
- Non-student users must use their registered email address
- If a student number is provided, the system automatically converts it to an email by appending `@ogr.ktu.edu.tr`

#### Request Body

| Field | Type | Description | Required | Allowed Values | Constraints |
|-------|------|-------------|----------|----------------|-------------|
| `identifier` | String | Student number or email address | ✅ | - | Must be a 6-digit numeric or valid email format |
| `password` | String | Password for authentication | ✅ | - | Min: 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character |

#### Example Request

```json
{
    "identifier": "123456",
    "password": "StrongP@ss123"
}
```

#### Example Response

```json
{
    "code": 200,
    "message": "Giriş başarılı.",
    "errors": [],
    "data": {
        "user": {
            "roles": [],
            "isActive": true,
            "groupMemberships": [],
            "isEmailVerified": false,
            "firstName": "John",
            "lastName": "Doe",
            "phoneNumber": "+905555555555",
            "isMale": "1",
            "studentNumber": 123456,
            "department": "106210211",
            "grade": "1. Sınıf",
            "skillLevel": 4,
            "email": "123456@ogr.ktu.edu.tr",
            "isStudent": true,
            "id": "1"
        },
        "tokens": {
            "access": {
                "token": "token",
                "expires": "1970-01-01T00:00:00.000Z"
            },
            "refresh": {
                "token": "token",
                "expires": "1970-01-01T00:00:00.000Z"
            }
        }
    }
}
```

---

### Logout

Logs out a user by invalidating their refresh token.

**Endpoint:** `POST /auth/logout`

#### Request Body

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `refreshToken` | String | Refresh token to be invalidated | ✅ |

#### Example Request

```json
{
    "refreshToken": "JWT REFRESH TOKEN"
}
```

#### Example Response

```json
{
    "code": 200,
    "message": "Başarıyla çıkış yapıldı.",
    "errors": []
}
```

---

### Refresh Tokens

Allows a user to obtain a new access token by presenting a valid refresh token.

**Endpoint:** `POST /auth/refresh-tokens`

#### Request Body

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `refreshToken` | String | A valid refresh token issued during login | ✅ |

#### Example Request

```json
{
    "refreshToken": "JWT REFRESH TOKEN"
}
```

#### Example Response

```json
{
    "code": 200,
    "message": "Token (doğrulama belirteci) başarıyla yenilendi.",
    "errors": [],
    "data": {
        "access": {
            "token": "token",
            "expires": "1970-01-01T00:00:00.000Z"
        },
        "refresh": {
            "token": "token",
            "expires": "1970-01-01T00:00:00.000Z"
        }
    }
}
```

---

### Forgot Password

Allows a user to request a password reset by providing their student number or email address.

**Endpoint:** `POST /auth/forgot-password`

**Description:** A password reset link will be sent to the associated email address.

#### Request Body

| Field | Type | Description | Required | Allowed Values | Constraints |
|-------|------|-------------|----------|----------------|-------------|
| `identifier` | String | Student number or email address | ✅ | - | Must be a 6-digit numeric or valid email format |

#### Example Request

```json
{
    "identifier": "123456@ogr.ktu.edu.tr"
}
```

or

```json
{
    "identifier": "123456"
}
```

#### Example Response

```json
{
    "code": 200,
    "message": "Şifre yenileme postası başarıyla gönderildi.",
    "errors": []
}
```

---

### Reset Password

Allows a user to reset their password using a valid reset token (received via email).

**Endpoint:** `POST /auth/reset-password`

#### Query Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `token` | String | Password reset token sent via email | ✅ |

#### Request Body

| Field | Type | Description | Required | Allowed Values | Constraints |
|-------|------|-------------|----------|----------------|-------------|
| `password` | String | New password to set for the user account | ✅ | - | Min: 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character |

#### Example Request

**URL:**
```
POST /auth/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI...
```

**Body:**
```json
{
    "password": "NewStrongP@ssword123"
}
```

#### Example Response

```json
{
    "code": 200,
    "message": "Şifre başarıyla sıfırlandı.",
    "errors": []
}
```

---

### Send Verification Email

Sends a verification email to the user with a link to confirm their email address.

**Endpoint:** `POST /auth/send-verification-email`

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| `Authorization` | String | Bearer token for authentication | ✅ |

#### Example Request

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
```

**Body:** No body required

#### Example Response

```json
{
    "code": 200,
    "message": "Doğrulama postası başarıyla gönderildi.",
    "errors": []
}
```

---

### Verify Email

Verifies a user's email address using the verification token they received via email.

**Endpoint:** `GET /auth/verify-email`

#### Query Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `token` | String | Email verification token sent via email | ✅ |

#### Example Request

**URL:**
```
GET /auth/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

#### Example Response

```json
{
    "code": 200,
    "message": "E-Posta hesabı başarıyla onaylandı.",
    "errors": []
}
```

---

## Users

### Create User

Creates a new user account in the system.

**Endpoint:** `POST /users/`

**Description:** This endpoint is used by administrators to manually create users (students or non-students).

#### Special Rules

- Password is not provided manually. Instead, a password set token is sent to the user's email to let them set their own password.
- If `isStudent` is `true`:
  - `studentNumber`, `department`, and `grade` are required.
  - If `email` is provided, it will be used as is. Otherwise, it will default to `studentNumber@ogr.ktu.edu.tr`.
- If `isStudent` is `false`:
  - `studentNumber`, `department`, and `grade` must NOT be provided.
  - `email` is required and must be valid.
- `isEmailVerified` can be set manually by the admin.

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| `Authorization` | String | Bearer token with access role | ✅ |

#### Request Body

| Field | Type | Description | Required | Allowed Values | Constraints |
|-------|------|-------------|----------|----------------|-------------|
| `firstName` | String | User's first name | ✅ | - | - |
| `lastName` | String | User's last name | ✅ | - | - |
| `email` | String | Email address (ignored if isStudent) | ⚠️ | - | Required if not student |
| `isStudent` | Boolean | Whether the user is a student | ✅ | `true`, `false` | Must be one of the allowed values |
| `isMale` | String | Indicates if the user is male | ✅ | `"1"`, `"0"` | Must be one of the allowed values |
| `phoneNumber` | String | User's phone number | ✅ | - | International phone format (E.164), e.g. `+905xxxxxxxxx` |
| `studentNumber` | String | Student number (required if student) | ⚠️ | - | - |
| `department` | String | YÖK code of the department (required if student) | ⚠️ | - | Must match valid YÖK codes |
| `grade` | String | Student's grade (required if student) | ⚠️ | `"Hazırlık"`, `"1. Sınıf"`, `"2. Sınıf"`, `"3. Sınıf"`, `"4. Sınıf"`, `"5. Sınıf"`, `"6. Sınıf"`, `"6+ Sınıf"`, `"Mezun"` | Must be one of the allowed values |
| `skillLevel` | String | Tennis level from 1 to 10 | ✅ | `"1"` to `"10"` | Numeric, between 1 and 10 |
| `isEmailVerified` | Boolean | Whether the user's email is verified | ❌ | `true`, `false` | - |
| `roles` | Array | role ids | ❌ | `true`, `false` | - |

groupmembership endpointi eklenecek, payment defaultları gruptan çekilecek veya membershipe özel ayarlanabilecek, kullanıcı membership için başvurabilecek, başvuru detayları doldurulup onaylanabilecek, create user da role verilebilecek, note eklenebilecek, membership ekranı düşünülebilir veya modal olabilir
 
#### Example Request

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@mail.com",
    "isStudent": false,
    "isMale": "1",
    "phoneNumber": "+905555555555",
    "skillLevel": "4",
    "isEmailVerified": true
}
```

#### Example Response

```json
{
    "code": 200,
    "message": "Kullanıcı hesabı başarıyla oluşturuldu.",
    "errors": [],
    "data": {
        "user": {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@mail.com",
            "isStudent": false,
            "isMale": "1",
            "phoneNumber": "+905555555555",
            "skillLevel": "4",
            "isEmailVerified": true,
            "id": "1"
        }
    }
}
```

---

### Get All Users

Retrieves a list of all users in the system.

**Endpoint:** `GET /users/`

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| `Authorization` | String | Bearer token with access role | ✅ |

#### Example Response

```json
{
    "code": 200,
    "message": "Kullanıcılar başarıyla getirildi.",
    "errors": [],
    "data": {
        "users": [
            {
                "id": "1",
                "firstName": "John",
                "lastName": "Doe",
                "email": "john.doe@mail.com",
                "isStudent": false,
                "isMale": "1",
                "phoneNumber": "+905555555555",
                "skillLevel": 4,
                "isEmailVerified": true
            }
        ]
    }
}
```

---

### Get User

Retrieves a specific user by their ID.

**Endpoint:** `GET /users/:userId`

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| `Authorization` | String | Bearer token with access role | ✅ |

#### Path Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `userId` | String | The ID of the user to retrieve | ✅ |

#### Example Response

```json
{
    "code": 200,
    "message": "Kullanıcı başarıyla getirildi.",
    "errors": [],
    "data": {
        "user": {
            "id": "1",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@mail.com",
            "isStudent": false,
            "isMale": "1",
            "phoneNumber": "+905555555555",
            "skillLevel": 4,
            "isEmailVerified": true
        }
    }
}
```

---

### Update User

Updates an existing user's information.

**Endpoint:** `PATCH /users/:userId`

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| `Authorization` | String | Bearer token with access role | ✅ |

#### Path Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `userId` | String | The ID of the user to update | ✅ |

#### Request Body

| Field | Type | Description | Required | Allowed Values | Constraints |
|-------|------|-------------|----------|----------------|-------------|
| `firstName` | String | User's first name | ❌ | - | - |
| `lastName` | String | User's last name | ❌ | - | - |
| `email` | String | Email address | ❌ | - | Valid email format |
| `isMale` | String | Indicates if the user is male | ❌ | `"1"`, `"0"` | Must be one of the allowed values |
| `phoneNumber` | String | User's phone number | ❌ | - | International phone format (E.164) |
| `studentNumber` | String | Student number | ❌ | - | Exactly 6 digits, numeric only |
| `department` | String | YÖK code of the department | ❌ | - | Must match valid YÖK codes |
| `grade` | String | Student's grade | ❌ | `"Hazırlık"`, `"1. Sınıf"`, `"2. Sınıf"`, `"3. Sınıf"`, `"4. Sınıf"`, `"5. Sınıf"`, `"6. Sınıf"`, `"6+ Sınıf"`, `"Mezun"` | Must be one of the allowed values |
| `skillLevel` | String | Tennis level from 1 to 10 | ❌ | `"1"` to `"10"` | Numeric, between 1 and 10 |
| `isEmailVerified` | Boolean | Whether the user's email is verified | ❌ | `true`, `false` | - |

#### Example Request

```json
{
    "firstName": "Jane",
    "skillLevel": "5"
}
```

#### Example Response

```json
{
    "code": 200,
    "message": "Kullanıcı başarıyla güncellendi.",
    "errors": [],
    "data": {
        "user": {
            "id": "1",
            "firstName": "Jane",
            "lastName": "Doe",
            "email": "john.doe@mail.com",
            "isStudent": false,
            "isMale": "1",
            "phoneNumber": "+905555555555",
            "skillLevel": 5,
            "isEmailVerified": true
        }
    }
}
```

---

### Delete User

Deletes a user from the system.

**Endpoint:** `DELETE /users/:userId`

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| `Authorization` | String | Bearer token with access role | ✅ |

#### Path Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `userId` | String | The ID of the user to delete | ✅ |

#### Example Response

```json
{
    "code": 200,
    "message": "Kullanıcı başarıyla silindi.",
    "errors": []
}
``` 