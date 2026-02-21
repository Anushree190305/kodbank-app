# KodBank - Full Stack Banking Application

A secure full-stack banking web application built with React, Node.js, Express, and MongoDB.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (HTTP-only cookies), bcrypt

## Project Structure

```
kodbank-app/
├── client/     # React Frontend
└── server/    # Node Backend
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally on default port 27017)

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/kodbank
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

Start the server:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 3. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Features

- **Create Account** - Register with name, email, phone, account type, password
- **Sign In** - JWT-based authentication with HTTP-only cookies
- **Dashboard** - View balance, total deposited, total withdrawn
- **Deposit** - Add funds to account
- **Withdraw** - Withdraw with balance validation
- **Transfer** - Transfer to other users by email or account number
- **Transactions** - View transaction history
- **Profile** - Edit profile and change password
- **Logout** - Secure logout clearing cookies

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Sign in |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user (protected) |
| POST | /api/account/deposit | Deposit (protected) |
| POST | /api/account/withdraw | Withdraw (protected) |
| POST | /api/account/transfer | Transfer (protected) |
| GET | /api/account/transactions | Get transactions (protected) |
| GET | /api/account/profile | Get profile (protected) |
| PUT | /api/account/profile | Update profile (protected) |
| PUT | /api/account/change-password | Change password (protected) |
