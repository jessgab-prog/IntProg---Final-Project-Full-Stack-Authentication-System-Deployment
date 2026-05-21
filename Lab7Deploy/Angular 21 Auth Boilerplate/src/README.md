# Angular 21 Auth Boilerplate (Beginner Guide)

This project is a beginner-friendly Angular 21 boilerplate that demonstrates a complete authentication flow:

- Email sign up + email verification
- Login + logout
- JWT auth header for API requests
- Refresh tokens (cookie-based) + auto-refresh before access token expiry
- Forgot password + reset password
- Role-based authorization (User & Admin)
- Admin area for account management
- Profile area for viewing/updating your own account

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Run the App (Real API)](#2-run-the-app-real-api)
3. [Run the App (Fake Backend, No API)](#3-run-the-app-fake-backend-no-api)
4. [Using the App (What to Click)](#4-using-the-app-what-to-click)
5. [How Authentication Works](#5-how-authentication-works)
6. [Authorization (Roles + Route Guards)](#6-authorization-roles--route-guards)
7. [Project Structure (Quick Tour)](#7-project-structure-quick-tour)
8. [Troubleshooting](#8-troubleshooting)

---

# 1) Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node.js)

(Optional) Angular CLI:

```bash
npm i -g @angular/cli
```

---

# 2) Run the App (Real API)

By default this project is set up to call a real API at:

- `http://localhost:4000`

(see `src/environments/environment.ts`)

## Step 1: Install Packages

From the project root (where `package.json` is):

```bash
npm install
```

## Step 2: Start Your Backend API

Start an API that implements the `/accounts/` endpoints described in the
[How Authentication Works](#5-how-authentication-works) section.

The frontend expects the API to be available at:

```txt
http://localhost:4000
```

## Step 3: Start Angular

```bash
npm start
```

This runs:

```bash
ng serve --open
```

and should open the app in your browser.

## Step 4: Update API URL (if your API runs elsewhere)

Edit the environment file:

- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

Update:

```ts
apiUrl: 'http://localhost:4000'
```

---

# 3) Run the App (Fake Backend, No API)

If you want to run everything fully in the browser (no backend), you can enable the built-in fake backend interceptor.

## Step 1: Enable the Fake Backend Provider

Open:

```txt
src/app/app.module.ts
```

and uncomment the `fakeBackendProvider` line in the providers array.

It should look like this:

```ts
providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
]
```

## Step 2: Run the App

```bash
npm install
npm start
```

## How the Fake Backend Behaves (Important for Beginners)

- Accounts are stored in your browser `localStorage`, not in a database.
- "Emails" (verification + reset password links) are displayed in the UI as alerts because a browser-only app can't send real emails.
- The first registered account becomes `Admin`, and all other accounts become `User`.

If you want a clean slate while using the fake backend, clear site data in your browser or remove the local storage key:

```txt
angular-15-signup-verification-boilerplate-accounts
```

---

# 4) Using the App (What to Click)

This section assumes you are starting fresh and want to see the full flow.

## A) Create an Account

1. Go to Register
2. Fill in your details and submit
3. If you are using the fake backend, a "verification email" will appear as an alert with a link
4. Click the verification link (or paste it in the browser) to verify your account

## B) Login

1. Go to Login
2. Enter your email + password
3. On success you'll be redirected to the home page

## C) Forgot Password + Reset Password

1. Go to Forgot Password
2. Enter your email and submit
3. If you are using the fake backend, a "reset password email" will appear as an alert with a link
4. Click the reset link and set a new password

## D) Profile and Admin Areas

- Profile pages allow you to view and update your own account details.
- The Admin area is restricted to accounts with the `Admin` role.

---

# 5) How Authentication Works

This boilerplate uses two tokens:

- **Access token (JWT)**  
  Short-lived token used in the:

```txt
Authorization: Bearer <token>
```

header.

- **Refresh token**  
  Long-lived token stored in a cookie and sent with:

```ts
withCredentials: true
```

---

## The Important Pieces

### API Base URL

```txt
src/environments/environment.ts
```

### Account Service (login/logout/refresh/register/etc.)

```txt
src/app/_services/account.service.ts
```

### App Initializer (tries to refresh on first app load)

```txt
src/app/_helpers/app.initializer.ts
```

### JWT Interceptor (adds the Authorization header for API calls)

```txt
src/app/_helpers/jwt.interceptor.ts
```

### Error Interceptor (auto-logout on 401/403)

```txt
src/app/_helpers/error.interceptor.ts
```

---

## Flow: Login

1. Login component calls:

```ts
AccountService.login(email, password)
```

2. The API returns an Account object that includes:

```txt
jwtToken
```

3. The app stores the account in memory (a `BehaviorSubject`) and starts a refresh timer.
4. For future API requests, the JWT interceptor attaches:

```txt
Authorization: Bearer <token>
```

---

## Flow: Refresh Token (Important)

1. The refresh token is sent to the API using cookies (`withCredentials: true`)
2. The API responds with a new access token (`jwtToken`)
3. The app schedules an automatic refresh about 1 minute before the access token expires
4. When you reload the page, `APP_INITIALIZER` calls refresh immediately to restore the session (if the cookie is still valid)

---

## Expected API Endpoints

The frontend calls these endpoints (base URL is `environment.apiUrl`):

```txt
POST   /accounts/authenticate
POST   /accounts/refresh-token
POST   /accounts/revoke-token

POST   /accounts/register
POST   /accounts/verify-email

POST   /accounts/forgot-password
POST   /accounts/validate-reset-token
POST   /accounts/reset-password

GET    /accounts
GET    /accounts/:id

POST   /accounts
PUT    /accounts/:id
DELETE /accounts/:id
```

---

# 6) Authorization (Roles + Route Guards)

Routes are protected with `AuthGuard`.

- If you are not logged in, you are redirected to:

```txt
/account/login
```

- If you are logged in but don't have the required role, you are redirected to:

```txt
/
```

Role restrictions are applied using route data.

Example:

```txt
/admin
```

requires:

```ts
Role.Admin
```

## Key Files

```txt
src/app/_helpers/auth.guard.ts
src/app/_models/role.ts
src/app/app-routing.module.ts
```

---

# 7) Project Structure (Quick Tour)

Most code lives under:

```txt
src/app
```

## Main Folders

### `_services/`

Shared services  
Example:

```txt
AccountService
AlertService
```

### `_helpers/`

Cross-cutting helpers:

- guards
- interceptors
- app initializer
- fake backend

### `_models/`

Shared types and enums:

- Account
- Role
- Alert

### `account/`

Authentication screens:

- login
- register
- verify email
- forgot password
- reset password

### `profile/`

User profile screens.

### `admin/`

Admin-only screens for account management.

The UI is styled with Bootstrap 5 via CDN in:

```txt
src/index.html
```

---

# 8) Troubleshooting

## The App Redirects Me Back to Login After Refresh

If you are using a real API, make sure it:

- sets a refresh token cookie
- supports:

```txt
POST /accounts/refresh-token
```

If your API runs on another origin (different hostname/port), you must configure CORS correctly and ensure cookies use proper:

- `SameSite`
- `Secure`

settings.

---

## I'm Calling an API on Another Port and Cookies Aren't Being Sent

This frontend uses:

```ts
withCredentials: true
```

for login/refresh/revoke requests.

The backend must also:

- Enable CORS with credentials
- Return:

```txt
Access-Control-Allow-Credentials: true
```

- Allow the frontend origin in:

```txt
Access-Control-Allow-Origin
```

It **cannot** be `*` when using credentials.

---

## I Want to Reset the Fake Backend Data

Clear browser storage for the site or remove the local storage key:

```txt
angular-15-signup-verification-boilerplate-accounts
```

---

## Run Unit Tests

```bash
npm test
```