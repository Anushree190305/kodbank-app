# KodBank Deployment Guide

Complete guide to deploy KodBank to production.

## Deployment Overview

KodBank is a full-stack application with three components to deploy:
1. **Frontend** (React/Vite) → Vercel or Netlify
2. **Backend** (Express) → Vercel, Render, or Railway
3. **Database** (MongoDB) → MongoDB Atlas

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] No console errors in frontend
- [ ] No console errors in backend
- [ ] Environment variables documented
- [ ] Password hashing working (test login)
- [ ] Transactions saving to database
- [ ] All API endpoints tested

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account with repository
- Vercel account (vercel.com)
- MongoDB Atlas account

### Step 1: Prepare MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster:
   - Choose "Free" tier (M0)
   - Choose AWS region closest to you
   - Click "Create"
4. Wait for cluster to be created (~10 mins)
5. Click "Connect":
   - Choose "Connect your application"
   - Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/kodbank`
   - Add `/kodbank` to path if not present

### Step 2: Push to GitHub

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit - KodBank banking app"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/kodbank.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import repository → Select `kodbank` repository
4. **Important Setup:**
   - Set **Root Directory**: `server`
   - Click "Environment Variables" and add:
     - `MONGO_URI`: MongoDB Atlas connection string
     - `JWT_SECRET`: Generate strong secret (see below)
     - `NODE_ENV`: `production`
5. Click "Deploy"
6. Wait for deployment to complete
7. Copy deployment URL (e.g., `https://kodbank-api.vercel.app`)

### Generate Strong JWT Secret

```bash
# Run this command (Node.js required)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Step 4: Deploy Frontend to Vercel

1. In Vercel dashboard, click "Add New..." → "Project"
2. Import same `kodbank` repository again
3. **Setup:**
   - Keep **Root Directory** as default (empty)
   - Set **Framework**: Vite
   - Click "Environment Variables" and add:
     - `VITE_API_URL`: Your backend API URL (e.g., `https://kodbank-api.vercel.app/api`)
   - Or update `client/src/services/api.js` baseURL
4. Click "Deploy"
5. Wait for deployment

### Step 5: Update Frontend API Configuration

Edit `client/src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const accountAPI = {
  deposit: (amount) => api.post('/account/deposit', { amount }),
  withdraw: (amount) => api.post('/account/withdraw', { amount }),
  transfer: (recipientEmailOrAccount, amount) =>
    api.post('/account/transfer', { recipientEmailOrAccount, amount }),
  getTransactions: () => api.get('/account/transactions'),
  getProfile: () => api.get('/account/profile'),
  updateProfile: (data) => api.put('/account/profile', data),
  changePassword: (data) => api.put('/account/change-password', data),
};

export default api;
```

### Step 6: Update Backend CORS

Edit `server/server.js`:

```javascript
app.use(
  cors({
    origin: 'https://your-frontend-domain.vercel.app', // Your frontend URL
    credentials: true,
  })
);
```

### Step 7: Redeploy

```bash
git add .
git commit -m "Update production configuration"
git push origin main
```

Both frontend and backend will redeploy automatically.

## Option 2: Deploy Backend to Render

### Step 1: Create Render Account
- Go to https://render.com
- Sign up with GitHub

### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Select `kodbank` repository
4. **Configuration:**
   - Name: `kodbank-api`
   - Root Directory: `server`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables:**
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random string
   - `NODE_ENV`: `production`
6. Create Web Service
7. Copy service URL (e.g., `https://kodbank-api.onrender.com`)

### Step 3: Update Frontend

Update `client/src/services/api.js`:
```javascript
baseURL: 'https://kodbank-api.onrender.com/api'
```

## Option 3: Deploy Backend to Railway

### Step 1: Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### Step 2: Create Project

1. Click "Create Project"
2. Choose "Deploy from GitHub"
3. Select `kodbank` repository
4. Click "Deploy Now"

### Step 3: Configure

1. Select `server` folder as root
2. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV`: `production`
3. Railway generates URL (e.g., `https://kodbank-api-production.railway.app`)

## Option 4: Deploy Frontend to Netlify

### Step 1: Build Locally

```bash
cd client
npm run build
```

### Step 2: Connect to Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Select repository
5. **Build settings:**
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
6. Add environment variables:
   - `VITE_API_URL`: Your backend URL
7. Deploy

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Can create account
- [ ] Can login
- [ ] Dashboard shows balance
- [ ] Can deposit/withdraw
- [ ] Can transfer between accounts
- [ ] Can view transactions
- [ ] Can change password
- [ ] Database connections working
- [ ] No sensitive data in logs

## Performance Optimization

### Frontend Optimization

```javascript
// Lazy load routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Deposit = lazy(() => import('./pages/Deposit'));

// Use in router
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### Backend Optimization

```javascript
// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

// Add compression
const compression = require('compression');
app.use(compression());
```

## Monitoring & Logs

### Vercel Logs
- Dashboard → Project → Deployments → Build/Runtime Logs

### Render/Railway Logs
- Dashboard → Service → Logs tab

### MongoDB Atlas Logs
- Cluster → Logs → View Logs

## Environment Variables Reference

### Backend Production
```env
PORT=3000 (auto-set by platform)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kodbank
JWT_SECRET=<strong_random_string_64_chars>
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend Production
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Security Checklist for Production

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] CORS origin is restricted to your domain
- [ ] Passwords are hashed (bcrypt)
- [ ] No sensitive data in logs
- [ ] HTTPS enforced
- [ ] Rate limiting enabled (optional)
- [ ] Input validation on all endpoints
- [ ] Database backups enabled (MongoDB Atlas)

## SSL/HTTPS

All major platforms (Vercel, Render, Railway, Netlify) provide free SSL certificates automatically. No additional configuration needed.

## Database Backups

### MongoDB Atlas
1. Go to Cluster → Backup
2. Enable automatic backup (default: daily)
3. Backups retained for 7 days (free tier)

### Restore from Backup
1. Cluster → Backup → Restore
2. Choose backup date
3. Follow prompts

## Monitoring & Alerts

### Set up Alerts (MongoDB Atlas)

1. Go to Organization → Alerts
2. Create alert for:
   - Replication lag
   - Connection limit
   - Database size

### Application Performance

- Monitor API response times
- Check error rates
- Review database query performance

## Troubleshooting Deployment

### Frontend Won't Load

- Check build logs in Vercel/Netlify
- Verify `vite.config.js` configuration
- Ensure dependencies are installed

### Backend API Not Responding

- Check deployment logs
- Verify environment variables are set
- Test MongoDB connection
- Check CORS origin matches

### CORS Errors in Production

```javascript
// server/server.js - Update to production domain
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
```

### Database Connection Issues

1. Check MongoDB Atlas IP whitelist:
   - Network Access → IP Whitelist
   - Add `0.0.0.0/0` (allows all IPs) or specific server IP
2. Verify connection string
3. Check database user permissions

### High Database Latency

- Check MongoDB region matches app region
- Reduce number of queries
- Add indexes to frequently queried fields
- Cache responses

## Cost Estimation

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Vercel | 100GB bandwidth | $20+ |
| Render | Shared CPU | $7+ |
| Railway | $5 credit/month | $5+/month |
| MongoDB Atlas | 512MB storage | $0 (M0) |
| Netlify | 100GB bandwidth | Free |

## Performance Tips

1. Use CDN for static assets
2. Enable gzip compression
3. Minimize API calls
4. Cache frequently accessed data
5. Use indexes in MongoDB
6. Lazy load components
7. Optimize images
8. Minify CSS/JavaScript

## Scaling for Growth

### When to Scale

- 1,000+ active users → upgrade MongoDB to M2
- 10,000+ requests/day → scale backend to multiple instances
- High database queries → add caching layer (Redis)

### Scaling Options

- Vertical: Upgrade server specs
- Horizontal: Add load balancer + multiple servers
- Database: Sharding, read replicas

## Maintenance

### Regular Tasks

- Monitor error logs weekly
- Review database size monthly
- Update dependencies quarterly
- Backup database weekly (auto with MongoDB Atlas)
- Review security logs monthly

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Your KodBank is now live in production! 🚀**

Monitor logs regularly and enjoy your deployed banking application! 💰
