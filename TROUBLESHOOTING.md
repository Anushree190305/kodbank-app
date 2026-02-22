# KodBank Troubleshooting Guide

Quick solutions to common issues.

## Table of Contents
- [MongoDB Issues](#mongodb-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Authentication Issues](#authentication-issues)
- [API Connection Issues](#api-connection-issues)
- [Database Issues](#database-issues)

---

## MongoDB Issues

### Issue: MongoDB Connection Refused

**Error:**
```
❌ MongoDB Connection Refused
   MongoDB is not running...
```

**Solutions:**

**macOS:**
```bash
# Check if running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh
```

**Windows:**
```bash
# In Administrator Command Prompt
net start MongoDB

# Or check Services
services.msc (find MongoDB and click Start)
```

**Linux:**
```bash
# Start service
sudo systemctl start mongod

# Check status
sudo systemctl status mongod

# Enable auto-start
sudo systemctl enable mongod
```

---

### Issue: MongoDB Atlas Connection Issues

**Error:**
```
MongoNetworkError: connect ECONNREFUSED
```

**Solutions:**

1. **Check IP Whitelist:**
   - MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` (allow all IPs)
   - Or add specific server IP

2. **Verify Connection String:**
   - Should include password and database
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/kodbank`

3. **Check Credentials:**
   - Verify username and password
   - No special characters without encoding
   - For special chars, use URL encoding

4. **Test Connection:**
   ```bash
   # In .env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kodbank
   
   # Then test
   npm run dev
   ```

---

### Issue: MongoDB Disk Space Full

**Error:**
```
E11000 duplicate key error
```

**Solution:**
```bash
# Check disk space
df -h

# Clean up old data
# Delete .m0 cluster and create new one (free tier)

# Or use MongoDB compass to view collections
# Right-click collection → Delete
```

---

## Backend Issues

### Issue: Port 5000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**macOS/Linux:**
```bash
# Find process using port
lsof -ti:5000

# Kill process (replace PID)
kill -9 <PID>

# Example:
# lsof -ti:5000 | xargs kill -9
```

**Windows:**
```bash
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Example:
# taskkill /PID 12345 /F
```

**Or Change Port:**
```bash
# Edit server/.env
PORT=5001

# Restart server
npm run dev
```

---

### Issue: "Cannot find module" Error

**Error:**
```
Error: Cannot find module 'express'
at Module._resolveFilename
```

**Solution:**
```bash
cd server

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start server
npm run dev
```

---

### Issue: NODE_ENV Not Set

**Error:**
```
Warning: NODE_ENV not set
```

**Solution:**
```bash
# Edit server/.env
NODE_ENV=development

# Or set in terminal
export NODE_ENV=development  # macOS/Linux
set NODE_ENV=development     # Windows
```

---

### Issue: JWT_SECRET Not Set

**Error:**
```
Error: JWT_SECRET is required
```

**Solution:**
```bash
# Edit server/.env
JWT_SECRET=your_super_secret_key_here

# Generate strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Issue: Server Crashes on Start

**Error:**
```
ReferenceError: variable is not defined
TypeError: Cannot read property 'x' of undefined
```

**Solution:**

1. Check for syntax errors:
   ```bash
   # Verify server.js
   node server.js
   ```

2. Check .env file:
   ```bash
   # Ensure all required variables are set
   cat server/.env
   ```

3. Check MongoDB connection:
   ```bash
   mongosh
   # Should connect successfully
   ```

4. Check port not in use:
   ```bash
   lsof -ti:5000  # Should be empty
   ```

---

## Frontend Issues

### Issue: Port 5173 Already in Use

**Error:**
```
Port 5173 is in use
```

**Solution:**

**macOS/Linux:**
```bash
lsof -ti:5173 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Or Change Port:**
```bash
# Edit client/vite.config.js
export default defineConfig({
  server: {
    port: 5174,  // Change port
  }
})
```

---

### Issue: Blank White Page

**Error:**
```
Page shows white/blank screen
```

**Solutions:**

1. **Clear cache:**
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies
   - Hard refresh (Ctrl+F5)

2. **Check build:**
   ```bash
   cd client
   npm run build
   npm run preview
   ```

3. **Check console:**
   - Press F12
   - Go to Console tab
   - Look for red errors

4. **Reinstall:**
   ```bash
   cd client
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

---

### Issue: "Cannot GET /" Error

**Error:**
```
Cannot GET /
```

**Solutions:**

1. **Check server running:**
   - Verify frontend dev server is running
   - Should show: `Local: http://localhost:5173`

2. **Check vite.config.js:**
   ```javascript
   // Ensure config exists
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5173,
     }
   })
   ```

3. **Restart:**
   ```bash
   cd client
   npm run dev
   ```

---

### Issue: Modules Not Found

**Error:**
```
Module not found: 'react-router-dom'
```

**Solution:**
```bash
cd client
npm install
npm run dev
```

---

## Authentication Issues

### Issue: "Cannot Login" - Always Shows Error

**Error:**
```
"Invalid email or password"
```

**Solutions:**

1. **Verify user exists:**
   - Create new account first
   - Use same credentials immediately

2. **Check password:**
   - Passwords are case-sensitive
   - No spaces before/after

3. **Check MongoDB:**
   ```bash
   mongosh
   use kodbank
   db.users.find()  # Should show user
   ```

4. **Clear cookies:**
   - DevTools → Application → Cookies
   - Delete all cookies
   - Refresh and try again

5. **Reset database:**
   ```bash
   mongosh
   use kodbank
   db.users.deleteMany({})  # Start fresh
   ```

---

### Issue: "Not Authorized" API Error

**Error:**
```
401 Unauthorized
```

**Solutions:**

1. **Check token exists:**
   - DevTools → Application → Cookies
   - Look for "token" cookie

2. **Check token valid:**
   - Token expires in 7 days
   - May need to login again

3. **Verify backend running:**
   - Check http://localhost:5000/api/health
   - Should return: `{"status":"ok"}`

4. **Check JWT_SECRET:**
   - Backend .env must have JWT_SECRET set
   - Should match between login and API calls

---

### Issue: "Email Already Registered"

**Error:**
```
Email already registered
```

**Solutions:**

1. **Use different email:**
   - Each account needs unique email
   - Try: test2@example.com, test3@example.com

2. **Delete user (testing):**
   ```bash
   mongosh
   use kodbank
   db.users.deleteOne({ email: "test@example.com" })
   ```

3. **Reset database:**
   ```bash
   mongosh
   use kodbank
   db.dropDatabase()  # Fresh start
   ```

---

## API Connection Issues

### Issue: CORS Error in Browser

**Error:**
```
Access to XMLHttpRequest from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solutions:**

1. **Verify backend running:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"ok"}
   ```

2. **Check vite proxy:**
   - Edit client/vite.config.js:
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

3. **Restart frontend:**
   ```bash
   # Stop (Ctrl+C) and restart
   npm run dev
   ```

4. **Check backend CORS:**
   - Edit server/server.js:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true,
   }));
   ```

---

### Issue: "Network Error" on API Calls

**Error:**
```
Network Error: connect ECONNREFUSED
```

**Solutions:**

1. **Backend not running:**
   ```bash
   cd server
   npm run dev
   # Should show: "Server running on port 5000"
   ```

2. **Wrong API URL:**
   - Frontend should call `/api/*`
   - Vite proxy converts to http://localhost:5000

3. **Firewall blocking:**
   - Check if port 5000 blocked
   - Disable firewall temporarily for testing

4. **MongoDB not accessible:**
   ```bash
   mongosh
   # Should connect successfully
   ```

---

### Issue: API Response Always 500 Error

**Error:**
```
500 Internal Server Error
```

**Solutions:**

1. **Check backend logs:**
   - Look at terminal running `npm run dev`
   - Copy full error message

2. **Check MongoDB:**
   - Verify MongoDB running
   - Check connection string in .env

3. **Check user exists:**
   - May need to login first
   - Or create new account

4. **Verify data format:**
   - API expects JSON
   - Check request body format
   - Verify axios headers in api.js

---

## Database Issues

### Issue: Data Not Persisting

**Error:**
```
Changes disappear after page refresh
```

**Solutions:**

1. **Check MongoDB connected:**
   ```bash
   # In backend terminal
   # Should see: "MongoDB Connected: localhost"
   ```

2. **Verify database operations:**
   ```bash
   mongosh
   use kodbank
   db.users.find()  # See if data exists
   ```

3. **Check API response:**
   - DevTools → Network tab
   - Check API response status and body
   - Should be 200 OK with data

---

### Issue: Duplicate Key Error

**Error:**
```
E11000 duplicate key error collection
```

**Solutions:**

1. **Check unique fields:**
   - Email must be unique
   - Account number must be unique

2. **Delete duplicates:**
   ```bash
   mongosh
   use kodbank
   db.users.deleteMany({ email: "duplicate@example.com" })
   ```

3. **Reset database:**
   ```bash
   mongosh
   use kodbank
   db.dropDatabase()
   ```

---

### Issue: Cannot See Changes in MongoDB

**Error:**
```
Data not updating in MongoDB
```

**Solutions:**

1. **Use MongoDB Compass:**
   - Download from: https://www.mongodb.com/products/tools/compass
   - Connect to: mongodb://localhost:27017
   - View collections in real-time

2. **Refresh data:**
   ```bash
   mongosh
   use kodbank
   db.users.find()  # Check current data
   ```

3. **Check transaction saved:**
   ```bash
   db.transactions.find()
   # Should see transaction records
   ```

---

## Quick Fixes Checklist

- [ ] MongoDB running: `mongosh`
- [ ] Backend running: Check terminal
- [ ] Frontend running: http://localhost:5173 loads
- [ ] .env configured: Check server/.env
- [ ] Dependencies installed: `npm install` in both folders
- [ ] Ports clear: 5000 and 5173 available
- [ ] Console errors: Check DevTools (F12)
- [ ] API working: `curl http://localhost:5000/api/health`

---

## Still Stuck?

### Debug Steps

1. **Check terminal output:**
   - Copy exact error message
   - Look for line numbers

2. **Enable debug logging:**
   ```javascript
   // Add to backend controllers
   console.log("[DEBUG] Variable:", variable);
   ```

3. **Use DevTools:**
   - F12 → Console tab
   - F12 → Network tab
   - Watch requests in real-time

4. **Restart everything:**
   ```bash
   # Kill all processes
   # Restart MongoDB
   # Restart backend: npm run dev
   # Restart frontend: npm run dev
   ```

5. **Check documentation:**
   - README.md - Overview
   - SETUP.md - Setup issues
   - DEPLOYMENT.md - Production issues
   - DEVELOPER.md - Code structure

---

## Getting Help

### Online Resources
- [Express Errors](https://expressjs.com)
- [Mongoose Docs](https://mongoosejs.com)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [MongoDB Support](https://www.mongodb.com/support)

### Testing Strategy
1. Test locally first
2. Check MongoDB directly
3. Test API with Postman/curl
4. Check frontend network tab
5. Review browser console

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| ECONNREFUSED | Service not running | Start MongoDB/backend |
| EADDRINUSE | Port in use | Kill process or change port |
| ENOTFOUND | Wrong URL/host | Check API baseURL |
| E11000 | Duplicate value | Check unique fields |
| 401 Unauthorized | Invalid token | Login again |
| 404 Not Found | Route doesn't exist | Check route path |
| 500 Server Error | Backend error | Check server logs |

---

## Prevention Tips

1. **Always start MongoDB first**
2. **Use .env for secrets**
3. **Test API with curl/Postman**
4. **Clear cache after code changes**
5. **Check console for warnings**
6. **Use Git for version control**
7. **Keep dependencies updated**

---

**Most issues are solved by:**
1. Restarting (MongoDB, backend, frontend)
2. Clearing cache (Ctrl+Shift+Delete)
3. Reinstalling dependencies (`rm node_modules && npm install`)
4. Checking logs (terminal output)

---

**Having trouble? Start with the Quick Fixes Checklist above! ✅**
