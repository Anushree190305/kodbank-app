# KodBank - Secure Banking Application

A complete full-stack banking application featuring secure JWT authentication, real-time transaction processing, and professional banking UI. Built with React (Vite), Node.js/Express, and MongoDB.

## ✨ Features

### 🔐 Authentication & Security
- User registration with account creation
- Secure login with JWT authentication
- HTTP-only cookie token storage (prevents XSS attacks)
- Password hashing with bcrypt (12 salt rounds)
- Protected dashboard routes with auth middleware
- Auto-logout on token expiry (7 days)

### 💰 Banking Operations
- **Dashboard**: Real-time balance, total deposited, total withdrawn
- **Deposit**: Add funds with instant balance update
- **Withdraw**: Withdraw with balance validation
- **Transfer**: Send money to other users via email or account number
- **Transactions**: Complete transaction history with sorting
- **Profile Management**: Edit profile and change password securely

### 🎨 Design & UX
- Clean, professional banking interface
- Responsive design (mobile & desktop)
- Blue/gray color theme
- Smooth transitions and hover effects
- Loading spinners and real-time feedback
- Error handling with clear messages

## 🏗️ Tech Stack

**Frontend:**
- React 19.2 with Vite
- React Router v6 for routing
- Axios for API communication
- Tailwind CSS for styling
- Context API for state management

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- cookie-parser for HTTP-only cookies
- CORS enabled for development

**Database:**
- MongoDB (local or MongoDB Atlas cloud)

## 📁 Project Structure

```
kodbank-app/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CreateAccount.jsx   # Registration page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Dashboard.jsx        # Balance overview
│   │   │   ├── Deposit.jsx          # Deposit funds
│   │   │   ├── Withdraw.jsx         # Withdraw funds
│   │   │   ├── Transfer.jsx         # Transfer money
│   │   │   ├── Transactions.jsx     # Transaction history
│   │   │   └── Profile.jsx          # Profile & password
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx # Main layout
│   │   │   ├── Sidebar.jsx          # Navigation menu
│   │   │   └── ProtectedRoute.jsx   # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state
│   │   ├── services/
│   │   │   └── api.js               # API calls
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js               # Vite config with API proxy
│   ├── tailwind.config.js           # Tailwind with blue theme
│   └── package.json
├── server/                          # Express Backend
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Transaction.js           # Transaction schema
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   └── accountController.js     # Account logic
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── accountRoutes.js         # Account endpoints
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── server.js                    # Entry point
│   ├── .env.example                 # Environment template
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation & Setup

#### 1️⃣ Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kodbank
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

✅ Server running on: http://localhost:5000

#### 2️⃣ Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running on: http://localhost:5173

#### 3️⃣ MongoDB Setup

**Option A: Local MongoDB**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows - run in Command Prompt (admin)
mongod

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/kodbank`
4. Update `MONGO_URI` in server `.env`

## 📡 API Endpoints

All endpoints (except auth register) are protected with JWT authentication.

### Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user (protected) |

### Account Routes (All Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/account/deposit` | Deposit funds |
| POST | `/api/account/withdraw` | Withdraw funds |
| POST | `/api/account/transfer` | Transfer to user |
| GET | `/api/account/transactions` | Get transaction history |
| GET | `/api/account/profile` | Get user profile |
| PUT | `/api/account/profile` | Update profile |
| PUT | `/api/account/change-password` | Change password |

## 🔑 Example: Testing the App

### Create a Test Account
1. Go to http://localhost:5173
2. Click "Create Account"
3. Fill in details:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Phone**: 9876543210
   - **Account Type**: Savings
   - **Password**: password123
4. Confirm password and create account
5. Auto-generated account number: `KB<timestamp><random>`

### Login & Use
1. Click "Sign In"
2. Enter email and password
3. Access dashboard with real-time balance
4. Try all features: deposit, withdraw, transfer, etc.

## 🔒 Security Implementation

✅ **Password Security**
- Passwords hashed with bcrypt (12 rounds)
- Never stored in plain text
- Password change available in profile

✅ **JWT Authentication**
- Token expires in 7 days
- Stored in HTTP-only cookies (no JavaScript access)
- CSRF-safe with sameSite: 'strict'

✅ **Backend Validation**
- Input validation on all endpoints
- Type checking with Mongoose schemas
- Duplicate email prevention
- Balance validation for withdrawals/transfers

✅ **Protected Routes**
- Frontend: ProtectedRoute component
- Backend: JWT middleware on all account routes
- Automatic redirect to login if unauthorized

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  accountType: String (Savings/Current),
  password: String (hashed),
  accountNumber: String (auto-generated, unique),
  balance: Number (default: 0),
  totalDeposited: Number (default: 0),
  totalWithdrawn: Number (default: 0),
  createdAt: Date
}
```

### Transaction Model
```javascript
{
  userId: ObjectId (ref: User),
  type: String (deposit/withdraw/transfer),
  amount: Number,
  recipient: String (optional, for transfers),
  recipientAccountNumber: String (optional),
  status: String (default: completed),
  date: Date
}
```

## 🛠️ Development

### Useful Commands

```bash
# Backend
cd server
npm run dev      # Start with nodemon
npm start        # Production start

# Frontend
cd client
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Debug Tips
- Backend: Check console logs in terminal
- Frontend: Use browser DevTools (F12)
- MongoDB: Use MongoDB Compass for GUI
- Add breakpoints in VS Code debugger

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Deploy banking app"
git push origin main
```

2. **Deploy Backend (Vercel or Railway/Render)**
```bash
# Using Vercel with serverless functions
# Add vercel.json (included in repo)
vercel deploy
```

3. **Deploy Frontend (Vercel)**
- Import repository from GitHub
- Set environment variables
- Deploy automatically on push

### Environment Variables for Production

**Backend:**
- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Use strong random: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `NODE_ENV`: Set to "production"
- `PORT`: Usually auto-set by hosting

**Frontend:**
- No secrets needed (uses relative API paths)

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Refused
```
**Solution**: Start MongoDB service (see MongoDB Setup above)

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### CORS Errors in Browser
- Ensure backend is running on http://localhost:5000
- Check `vite.config.js` proxy configuration
- Verify backend CORS settings

### Login Not Working
- Clear browser cookies (DevTools → Application → Cookies)
- Verify `.env` variables are set correctly
- Check MongoDB has user data

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Key Implementation Details

### Authentication Flow
1. User registers → password hashed → account number generated
2. User logs in → JWT token created → stored in HTTP-only cookie
3. Each request includes token → verified by middleware
4. Token valid → continue → invalid → redirect to login

### Real-time Updates
- Balance updates instantly after deposits/withdrawals
- Auth context updates user state across all pages
- No page refresh needed for balance updates

### Transaction Processing
- Deposits: Add to balance and totalDeposited
- Withdrawals: Deduct from balance, add to totalWithdrawn
- Transfers: Deduct from sender, add to receiver, create 2 transactions

## 🎯 Features Breakdown

| Feature | Frontend | Backend | Database |
|---------|----------|---------|----------|
| Registration | CreateAccount.jsx | authController.register | User model |
| Login | Login.jsx | authController.login | JWT token |
| Dashboard | Dashboard.jsx | (no endpoint) | User data |
| Deposit | Deposit.jsx | accountController.deposit | User, Transaction |
| Withdraw | Withdraw.jsx | accountController.withdraw | User, Transaction |
| Transfer | Transfer.jsx | accountController.transfer | User, Transaction (×2) |
| Transactions | Transactions.jsx | accountController.getTransactions | Transaction |
| Profile | Profile.jsx | accountController.getProfile/updateProfile | User |
| Password | Profile.jsx | accountController.changePassword | User (password) |

## 📦 Dependencies

### Frontend
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.21.1",
  "axios": "^1.6.2"
}
```

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [JWT Introduction](https://jwt.io)
- [Tailwind CSS Docs](https://tailwindcss.com)

## 📄 License

MIT License - Feel free to use this project for learning and personal projects.

## 👨‍💻 Support

If you encounter issues:
1. Check MongoDB is running
2. Verify environment variables in `.env`
3. Clear browser cache and cookies
4. Check terminal for error messages
5. Review this README's troubleshooting section

---

**Built with ❤️ using React, Node.js, and MongoDB**

**Ready for production with proper security, validation, and error handling.**
