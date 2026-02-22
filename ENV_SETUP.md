# Environment Variables Setup Guide

Complete reference for configuring environment variables for KodBank.

## Overview

KodBank uses environment variables to store sensitive configuration and secrets. These should NEVER be committed to version control.

## Backend Environment Variables

### File Location
```
server/.env
```

### Required Variables

#### PORT
```env
PORT=5000
```
- **Description**: Port where Express server runs
- **Default**: 5000
- **Example Values**: 5000, 5001, 8000
- **Purpose**: Where backend API is accessible
- **Production**: Usually auto-set by hosting platform

#### MONGO_URI
```env
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/kodbank

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kodbank
```
- **Description**: MongoDB connection string
- **Required**: YES
- **Local Format**: `mongodb://localhost:27017/kodbank`
- **Atlas Format**: `mongodb+srv://user:pass@cluster.mongodb.net/kodbank`
- **Purpose**: Connect to MongoDB database
- **Note**: Include database name (kodbank) at end

#### JWT_SECRET
```env
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```
- **Description**: Secret key for signing JWT tokens
- **Required**: YES
- **Minimum Length**: 32 characters
- **Generate Strong Secret**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Purpose**: Secure token generation and verification
- **CRITICAL**: Must be strong and unique in production
- **Example**: `a7f3e9d2c1b8f5a4e9c2d1f8a3b7e4c9d2f1a8e5b3c7f2d9e4a1b8c5f3e7a`

#### NODE_ENV
```env
NODE_ENV=development
```
- **Description**: Application environment
- **Values**: `development` or `production`
- **Default**: development
- **Purpose**: Controls logging, error messages, and performance
- **Development**: More verbose, easier debugging
- **Production**: Optimized, minimal logging

### Optional Variables

#### CORS_ORIGIN
```env
# Development
CORS_ORIGIN=http://localhost:5173

# Production
CORS_ORIGIN=https://yourdomain.com
```
- **Description**: Allowed frontend domain for CORS
- **Default**: http://localhost:5173 (hardcoded)
- **Purpose**: Prevent unauthorized API access
- **Multiple Origins**: Not currently supported (add as feature)

#### DEBUG
```env
DEBUG=true
```
- **Description**: Enable debug logging (if implemented)
- **Values**: true or false
- **Default**: false
- **Purpose**: More detailed console output

## Frontend Environment Variables

### File Location
```
client/.env
client/.env.local
client/.env.production
```

### Optional Variables

#### VITE_API_URL
```env
# Development (uses proxy)
VITE_API_URL=/api

# Production
VITE_API_URL=https://your-api-domain.com/api
```
- **Description**: Backend API base URL
- **Default**: `/api` (uses Vite proxy in dev)
- **Purpose**: Configure API endpoint
- **Development**: Vite proxy handles it
- **Production**: Set to actual backend domain

### Using Frontend Environment Variables

Access in React code:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Or in Vite config:
import.meta.env.VITE_API_URL
```

## Development Setup (.env)

### Server .env for Development

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kodbank
JWT_SECRET=dev_key_12345678901234567890123456789012
NODE_ENV=development
```

### Create from Example

```bash
cd server
cp .env.example .env
```

Then edit values as needed.

## Production Setup

### Server Environment Variables (Production)

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kodbank
JWT_SECRET=<STRONG_32_CHAR_RANDOM_STRING>
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.vercel.app
```

### How to Set on Different Platforms

#### Vercel
1. Go to Project Settings
2. Click "Environment Variables"
3. Add each variable:
   - Key: Variable name
   - Value: Variable value
4. Select "Production" for production env
5. Deploy

```bash
# Or via CLI
vercel env add MONGO_URI
# Enter value when prompted
```

#### Render.com
1. Dashboard → Service → Environment
2. Click "Add Environment Variable"
3. Enter Key and Value
4. Auto-redeploys on save

#### Railway
1. Dashboard → Service → Variables
2. Click "New Variable"
3. Enter Key and Value
4. Auto-redeploys

#### Heroku
```bash
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your-secret"
heroku config:set NODE_ENV=production
```

## MongoDB Connection Strings

### Local MongoDB
```env
MONGO_URI=mongodb://localhost:27017/kodbank
```
- Default port: 27017
- Database name: kodbank

### MongoDB Atlas

1. **Create Connection String:**
   - MongoDB Atlas → Cluster → Connect
   - Choose "Connect your application"
   - Copy connection string

2. **Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/kodbank
   ```

3. **Important:**
   - Replace `<username>` with your username
   - Replace `<password>` with your password
   - Add database name: `/kodbank` at the end
   - No angle brackets in final string

4. **Special Characters in Password:**
   ```
   If password has @, use %40
   If password has :, use %3A
   If password has /, use %2F
   
   Example:
   Original: MyPass@123
   Encoded: MyPass%40123
   
   mongodb+srv://user:MyPass%40123@cluster.mongodb.net/kodbank
   ```

## JWT Secret Generation

### Generate Secure Secret

```bash
# Node.js command
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# a7f3e9d2c1b8f5a4e9c2d1f8a3b7e4c9d2f1a8e5b3c7f2d9e4a1b8c5f3e7a
```

### Bash (Mac/Linux)
```bash
openssl rand -hex 32
```

### Python
```python
import secrets
print(secrets.token_hex(32))
```

### Windows PowerShell
```powershell
-join ((1..32) | ForEach-Object { '{0:X2}' -f (Get-Random -Maximum 256) }) | ForEach-Object { $_.ToLower() }
```

## Environment Variable Validation

### Check Variables Are Set

**Backend:**
```bash
# In server folder
cat .env

# Or in Node:
console.log(process.env.MONGO_URI)
console.log(process.env.JWT_SECRET)
```

**Verify Connection:**
```bash
mongosh
# Should connect successfully
```

### Common Issues

#### Missing MONGO_URI
```
Error: MongoParseError: Invalid connection string
```
**Solution:** Set MONGO_URI in .env

#### Invalid JWT_SECRET
```
Error: JWT malformed
```
**Solution:** JWT_SECRET must be set and not empty

#### PORT Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT or kill process using port

## .env.example Template

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/kodbank

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# CORS Configuration (Optional)
CORS_ORIGIN=http://localhost:5173
```

## Development vs Production

| Variable | Development | Production |
|----------|-------------|-----------|
| PORT | 5000 | Auto-set by platform |
| NODE_ENV | development | production |
| MONGO_URI | mongodb://localhost:27017 | mongodb+srv://atlas |
| JWT_SECRET | dev_secret_key | Strong random 32 chars |
| CORS_ORIGIN | http://localhost:5173 | https://yourdomain.com |
| DEBUG | true | false |

## Security Best Practices

### ✅ DO:
- Use strong, random JWT_SECRET (32+ chars)
- Store .env in .gitignore
- Never commit .env to version control
- Use environment variables for all secrets
- Rotate JWT_SECRET periodically in production
- Use strong MongoDB password (Atlas)

### ❌ DON'T:
- Don't hardcode secrets in code
- Don't share .env files
- Don't use simple secrets like "password123"
- Don't put .env in version control
- Don't use same secret in dev and production

## .gitignore Configuration

Ensure .env files are ignored:

```
# .gitignore
.env
.env.local
.env.*.local
node_modules/
dist/
```

## Troubleshooting

### "Cannot find variable"
**Cause:** Environment variable not set
**Solution:** Add to .env file and restart server

### "Connection refused"
**Cause:** MongoDB not running or MONGO_URI wrong
**Solution:** Verify MongoDB running and connection string correct

### "Token verification failed"
**Cause:** JWT_SECRET changed or not set
**Solution:** Ensure same JWT_SECRET used everywhere

### "CORS error"
**Cause:** CORS_ORIGIN doesn't match frontend
**Solution:** Update CORS_ORIGIN to frontend domain

## Environment Files for Different Scenarios

### Local Development
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kodbank
JWT_SECRET=dev_secret_key_12345678901234567890
NODE_ENV=development
```

### MongoDB Atlas Development
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kodbank
JWT_SECRET=dev_secret_key_12345678901234567890
NODE_ENV=development
```

### Production (Vercel/Render)
```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kodbank
JWT_SECRET=<strong_random_32_char_string>
NODE_ENV=production
CORS_ORIGIN=https://your-domain.vercel.app
```

### Docker/Containerization
```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/kodbank
JWT_SECRET=<random_string>
NODE_ENV=production
```

## Checking Environment Setup

### Verify Backend Configuration

```bash
cd server

# Check .env exists
ls -la .env

# Check required variables are set
grep -E "PORT|MONGO_URI|JWT_SECRET" .env

# Start server and check for errors
npm run dev
```

### Verify Database Connection

```bash
# Test local MongoDB
mongosh

# Test MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/test"
```

### Verify API Working

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Should return:
# {"status":"ok"}
```

## Updating Environment Variables

### During Development
```bash
# Edit .env file
nano server/.env

# Restart server (Ctrl+C then npm run dev)
npm run dev
```

### In Production

**Vercel:**
1. Project Settings → Environment Variables
2. Edit variable
3. Redeploy automatically

**Render/Railway:**
1. Dashboard → Variables
2. Click variable to edit
3. Auto-redeploys

## Common Environment Setups

### Setup 1: Local Development (Fastest)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kodbank
JWT_SECRET=dev_key_change_me
NODE_ENV=development
```

### Setup 2: Atlas + Local Frontend
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kodbank
JWT_SECRET=dev_key_change_me
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Setup 3: Full Production
```env
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kodbank
JWT_SECRET=strong_random_generated_string
NODE_ENV=production
CORS_ORIGIN=https://app.example.com
```

## Reference Links

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Render Environment Setup](https://render.com/docs/environment-variables)
- [Railway Configuration](https://docs.railway.app/guides/variables)
- [MongoDB Atlas Connection](https://docs.mongodb.com/manual/reference/connection-string)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

**Environment variables are critical for security. Set them up correctly!**

Questions? Check TROUBLESHOOTING.md or the main README.md
