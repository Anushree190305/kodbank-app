# KodBank Setup Guide

Complete step-by-step guide to get KodBank banking application running locally.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Verification & Testing](#verification--testing)
7. [Troubleshooting](#troubleshooting)

## System Requirements

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **MongoDB**: v4.4 or higher
- **Disk Space**: ~500MB
- **RAM**: ~2GB minimum
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

### Check Your Versions
```bash
node --version   # Should be v16+
npm --version    # Should be v7+
```

## MongoDB Setup

### Option 1: Local MongoDB Installation (Recommended for Development)

#### macOS (with Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb
```

#### Windows
1. Download from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Run Service as Network Service"
4. Complete installation
5. MongoDB starts automatically as a service

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod
```

### Option 2: MongoDB Atlas (Cloud - No Installation)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free M0 cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/kodbank`
5. Use this string in `.env` file (see Backend Setup)

### Verify MongoDB is Running

```bash
# Connect to MongoDB
mongosh

# You should see a shell prompt:
# test>

# Exit
exit
```

If you see an error, MongoDB is not running. Start it with the appropriate command above.

## Backend Setup

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all required packages from `package.json`:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cookie-parser
- cors
- dotenv
- nodemon (dev dependency)

### Step 3: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Or if you're on Windows
copy .env.example .env
```

Edit `.env` file with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kodbank
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

**Important:**
- `PORT`: Default 5000 (change if port is in use)
- `MONGO_URI`: Local MongoDB or MongoDB Atlas connection string
- `JWT_SECRET`: Change to a strong random string for production
- `NODE_ENV`: Set to "development" for local, "production" for live

### Step 4: Start the Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

✅ **Backend is ready!** Running on http://localhost:5000

## Frontend Setup

### Step 1: Navigate to Client Directory
```bash
cd ../client
# or from project root:
cd client
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- vite (bundler)

### Step 3: Verify Configuration

Check `vite.config.js` includes API proxy:
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

This tells Vite to forward `/api` calls to the backend.

### Step 4: Start the Frontend Server

```bash
npm run dev
```

You should see:
```
  VITE v7.3.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is ready!** Running on http://localhost:5173

## Running the Application

### Terminal 1: Backend
```bash
cd server
npm run dev
```

### Terminal 2: Frontend
```bash
cd client
npm run dev
```

### Access the App
Open browser and go to: **http://localhost:5173**

You should see the KodBank login/registration page.

## Verification & Testing

### 1. Database Connection Test

```bash
# In a third terminal
mongosh

# In MongoDB shell
show dbs
# Should show "kodbank" after first registration
```

### 2. API Endpoint Test

```bash
# Test if backend is running
curl http://localhost:5000/api/health
# Response: {"status":"ok"}
```

### 3. Create Test Account

1. Go to http://localhost:5173
2. Click "Create Account"
3. Fill form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Phone**: 9876543210
   - **Account Type**: Savings
   - **Password**: Test123!
   - **Confirm Password**: Test123!
4. Click "Create Account"
5. You should be redirected to login page

### 4. Login

1. Enter email: test@example.com
2. Enter password: Test123!
3. Click "Sign In"
4. Should see Dashboard with Welcome message

### 5. Test Features

- **Dashboard**: Check balance displays
- **Deposit**: Add 1000 rupees, check balance updates
- **Withdraw**: Withdraw 500, check balance
- **Transactions**: View deposit and withdrawal
- **Profile**: View account details
- **Transfer**: Create another account and transfer funds

## Troubleshooting

### Issue: "MongoDB Connection Refused"

**Error Message:**
```
❌ MongoDB Connection Refused
   MongoDB is not running...
```

**Solution:**
```bash
# Start MongoDB (choose one)

# macOS
brew services start mongodb-community

# Windows - Run as Admin
net start MongoDB

# Linux
sudo systemctl start mongod

# Verify
mongosh
# You should see: test>
```

### Issue: "Port 5000 Already in Use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Issue: "Port 5173 Already in Use"

```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9
```

### Issue: "Cannot find module 'express'"

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd server
npm install
```

### Issue: CORS Error in Browser Console

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Ensure backend is running on http://localhost:5000
2. Check `vite.config.js` proxy configuration
3. Restart frontend: `npm run dev`

### Issue: "Password does not match" on Login

**Error:**
```
Invalid email or password
```

**Solution:**
1. Verify email exists (create new account if needed)
2. Check password carefully (case-sensitive)
3. Clear browser cookies and try again
4. Reset database: `mongosh` → `db.dropDatabase()`

### Issue: Blank Page or "Cannot GET /"

**Solution:**
1. Verify frontend is running: `npm run dev` in client folder
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+F5)
4. Check browser console for errors (F12)

### Issue: "ENOTFOUND localhost:5000"

**Frontend cannot connect to backend**

**Solution:**
1. Verify backend is running: `npm run dev` in server folder
2. Check `vite.config.js` proxy configuration
3. Ensure both run on correct ports (5000 and 5173)
4. Check no VPN is blocking local connections

### Issue: Transactions Not Showing

**Solution:**
1. Refresh the page
2. Check browser DevTools → Network tab for `/api/account/transactions`
3. Verify you're logged in (check auth cookie exists)
4. Make sure transactions exist (do a deposit first)

## Configuration Files Overview

### Backend: `server/.env`
```env
PORT=5000                                          # Server port
MONGO_URI=mongodb://localhost:27017/kodbank       # Database connection
JWT_SECRET=your_secret_key_change_in_production   # Token signing key
NODE_ENV=development                               # Environment
```

### Backend: `server/package.json`
Dependencies for Express server, MongoDB, JWT, and bcrypt.

### Frontend: `client/vite.config.js`
- Dev server on port 5173
- API proxy to backend
- React plugin configuration

### Frontend: `client/tailwind.config.js`
- Blue color theme (primary colors)
- Tailwind CSS customization

### Frontend: `client/package.json`
Dependencies for React, Vite, Tailwind, and Axios.

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Backend server port | 5000 |
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017/kodbank |
| `JWT_SECRET` | Secret key for signing tokens | very_long_random_string_here |
| `NODE_ENV` | Environment type | development or production |

## Next Steps

1. ✅ Run both servers locally
2. ✅ Create test account and login
3. ✅ Test all features (deposit, withdraw, transfer)
4. ✅ Review code in `client/src` and `server`
5. ✅ Deploy to cloud (Vercel, Render, Railway)

## Production Deployment

### Before Going Live

1. Generate strong JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Use MongoDB Atlas instead of local MongoDB

3. Update CORS in `server/server.js` with production domain

4. Set `NODE_ENV=production`

5. Update API calls for production domain

### Deployment Platforms

- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Vercel, Render, Railway, Heroku
- **Database**: MongoDB Atlas

## Support

If you're stuck:
1. Check browser console (F12)
2. Check terminal for error messages
3. Review this SETUP.md guide
4. Check main README.md for troubleshooting
5. Verify MongoDB is running: `mongosh`

---

**Congratulations! You now have a working banking application! 🎉**

Time to explore, modify, and deploy! 🚀
