# KodBank Developer Guide

Quick reference for developers working on KodBank.

## Quick Start

```bash
# Terminal 1: Backend
cd server && npm install && npm run dev

# Terminal 2: Frontend  
cd client && npm install && npm run dev

# Access at http://localhost:5173
```

## Project Architecture

```
KodBank (Full-Stack)
├── Frontend (React/Vite)
│   ├── Pages (7 components)
│   ├── Components (3 reusable)
│   └── Services (API calls)
├── Backend (Express/Node)
│   ├── Controllers (2 files)
│   ├── Routes (2 files)
│   ├── Models (2 schemas)
│   └── Middleware (1 auth)
└── Database (MongoDB)
    ├── Users (auth + profile)
    └── Transactions (history)
```

## Frontend Architecture

### State Management
- **AuthContext**: User auth state & methods
- Local state: Form data in components
- No Redux/Zustand needed (simple app)

### Component Structure
```
App.jsx
├── AppRoutes
│   ├── CreateAccount (public)
│   ├── Login (public)
│   └── DashboardLayout (protected)
│       ├── Sidebar (navigation)
│       └── Outlet (nested routes)
│           ├── Dashboard
│           ├── Deposit
│           ├── Withdraw
│           ├── Transfer
│           ├── Transactions
│           └── Profile
```

### Adding a New Page

1. **Create page component**:
```jsx
// client/src/pages/NewFeature.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountAPI } from '../services/api';

export default function NewFeature() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    try {
      setLoading(true);
      // API call here
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>New Feature</h1>
      {/* Component JSX */}
    </div>
  );
}
```

2. **Add to router** (`client/src/App.jsx`):
```jsx
<Route path="/dashboard/new-feature" element={<NewFeature />} />
```

3. **Add to sidebar** (`client/src/components/Sidebar.jsx`):
```jsx
{ path: '/dashboard/new-feature', label: 'New Feature', icon: '...' }
```

### Styling Guidelines

Use Tailwind CSS classes:
```jsx
// ✅ Good
<div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
  <h2 className="text-lg font-semibold text-gray-800">Title</h2>
</div>

// ❌ Bad - Don't use arbitrary values
<div className="p-[16px] bg-[#ffffff]">

// ❌ Bad - Don't use inline styles
<div style={{ padding: '16px' }}>
```

### Color System
```
Primary: #2563eb (blue-600)
Text: #1f2937 (gray-800)
Borders: #e5e7eb (gray-200)
Background: #f9fafb (gray-50)
Success: #16a34a (green-600)
Error: #dc2626 (red-600)
```

## Backend Architecture

### Route Structure
```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   └── GET /me (protected)
└── /account (all protected)
    ├── POST /deposit
    ├── POST /withdraw
    ├── POST /transfer
    ├── GET /transactions
    ├── GET /profile
    ├── PUT /profile
    └── PUT /change-password
```

### Adding a New Endpoint

1. **Create controller method**:
```javascript
// server/controllers/accountController.js
const newFeature = async (req, res) => {
  try {
    const { data } = req.body;
    const user = await User.findById(req.user.id);
    
    // Business logic
    
    res.json({ message: 'Success', data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { ..., newFeature };
```

2. **Add route**:
```javascript
// server/routes/accountRoutes.js
router.post('/new-feature', newFeature);
```

3. **Add API call**:
```javascript
// client/src/services/api.js
export const accountAPI = {
  ...
  newFeature: (data) => api.post('/account/new-feature', data),
};
```

### Middleware Pattern

All account routes use JWT protection:
```javascript
// server/middleware/auth.js
const protect = async (req, res, next) => {
  let token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid' });
  }
};
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  accountType: 'Savings' | 'Current',
  password: String (hashed),
  accountNumber: String (unique, auto-generated),
  balance: Number,
  totalDeposited: Number,
  totalWithdrawn: Number,
  createdAt: Date
}
```

### Transaction Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: 'deposit' | 'withdraw' | 'transfer',
  amount: Number,
  recipient: String (email, for transfer),
  recipientAccountNumber: String,
  status: 'completed',
  date: Date
}
```

## Common Tasks

### Update Balance After Transaction

```javascript
// Backend
const user = await User.findById(userId);
user.balance += amount;
user.totalDeposited += amount;
await user.save();

// Frontend - Sync UI
updateUser({ balance: user.balance, totalDeposited: user.totalDeposited });
```

### Validate Input

```javascript
// Frontend
if (!value || isNaN(value) || value <= 0) {
  setError('Invalid amount');
  return;
}

// Backend
if (!amount || isNaN(amount) || amount <= 0) {
  return res.status(400).json({ message: 'Invalid amount' });
}
```

### Handle Async Operations

```javascript
// Frontend pattern
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    const { data } = await api.post('/endpoint', payload);
    // Success - update state
  } catch (err) {
    setError(err.response?.data?.message || 'Error occurred');
  } finally {
    setLoading(false);
  }
};
```

## Testing Workflows

### Test Deposit
1. Login
2. Go to Deposit
3. Enter amount (e.g., 1000)
4. Click Deposit
5. Check balance updated
6. Check in Transactions page

### Test Withdrawal
1. Ensure balance > 0
2. Go to Withdraw
3. Enter amount less than balance
4. Withdraw succeeds
5. Check balance reduced
6. Check in Transactions

### Test Transfer
1. Create account A and B
2. Deposit funds to A
3. Login as A
4. Go to Transfer
5. Enter B's email and amount
6. Transfer succeeds
7. Login as B
8. Check balance increased
9. Check in Transactions

### Test Password Change
1. Login
2. Go to Profile
3. Click "Change Password"
4. Enter old password
5. Enter new password
6. Logout and login with new password

## Debugging

### Console Logging Pattern
```javascript
// Good debug log
console.log("[v0] User created:", { id: user._id, email: user.email });

// Check state
console.log("[v0] Auth state:", { user, loading });

// API response
console.log("[v0] API response:", data);
```

### Check Network Calls
1. Open DevTools (F12)
2. Go to Network tab
3. Make API call
4. Check request/response
5. Verify status code (200 ok, 401 unauthorized, 500 error)

### Check Auth Status
```javascript
// In browser console
document.cookie // See cookies
// Look for "token=..." cookie

// Or in app
useAuth() // Check user state
```

### MongoDB Debugging
```bash
# Connect to MongoDB
mongosh

# See all databases
show dbs

# Use kodbank database
use kodbank

# Check collections
show collections

# View users
db.users.find()

# View transactions
db.transactions.find()

# Count documents
db.users.countDocuments()

# Delete all data (testing)
db.users.deleteMany({})
```

## Performance Tips

### Frontend
- Lazy load routes (optional)
- Avoid re-renders with useCallback
- Use local state for forms
- Debounce search inputs

### Backend
- Add indexes to frequently queried fields
- Use lean() for read-only queries
- Cache responses (Redis optional)
- Limit transaction history returned

### Database
```javascript
// Add index
userSchema.index({ email: 1 });
transactionSchema.index({ userId: 1, date: -1 });

// Use lean() for read-only
const transactions = await Transaction.find(...).lean();
```

## Error Handling

### Frontend Pattern
```jsx
{error && (
  <div className="p-3 bg-red-50 text-red-600 rounded-lg">
    {error}
  </div>
)}
```

### Backend Pattern
```javascript
try {
  // Logic
  res.json({ message: 'Success', data });
} catch (error) {
  res.status(500).json({ message: error.message || 'Server error' });
}
```

## Code Style

### JavaScript
- Use ES6+ syntax (const/let, arrow functions)
- Use descriptive variable names
- Add comments for complex logic
- Handle errors explicitly

### React
- Functional components only
- Hooks for state/effects
- Extract reusable components
- Props over drilling

### Files
- Max 300 lines per file
- One component per file
- Clear naming: `ComponentName.jsx`
- Organize by feature

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create PR
git push origin feature/new-feature

# Merge after review
git checkout main
git merge feature/new-feature
```

## Useful Commands

```bash
# Backend
npm run dev          # Development server
npm start            # Production server
npm test             # Run tests (if added)

# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build

# MongoDB
mongosh              # Connect to MongoDB
db.users.find()      # View all users
db.dropDatabase()    # Delete current database
```

## Package Dependencies

### Frontend
- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **tailwindcss**: CSS framework
- **vite**: Build tool

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT tokens
- **bcryptjs**: Password hashing
- **cookie-parser**: Cookie parsing
- **cors**: Cross-origin requests
- **dotenv**: Environment variables

## Future Enhancements

### Easy to Add
- Transaction search/filter
- Export transactions (CSV)
- Account type switching
- Two-factor authentication
- Email notifications
- Activity log

### Medium Effort
- Mobile app (React Native)
- Dark mode
- Multiple currencies
- Payment gateway integration
- Admin dashboard

### Complex Features
- Real-time notifications (WebSocket)
- Advanced analytics
- Investment features
- Loan system
- Cryptocurrency support

## Resources

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind Docs](https://tailwindcss.com)
- [Axios Docs](https://axios-http.com)
- [JWT Docs](https://jwt.io)

---

**Happy coding! 🚀 Feel free to extend and customize KodBank!**
