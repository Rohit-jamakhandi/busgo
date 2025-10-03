# Vercel Deployment Fix

## Changes Made

### 1. Fixed Database Connection (`config/db.js`)
- **Removed `process.exit()`** - This crashes serverless functions
- **Added connection caching** - Reuses existing connections in serverless environment
- **Added proper error throwing** - Allows Express to handle errors gracefully
- **Added serverless-optimized timeouts** - Faster connection attempts

### 2. Updated Server (`server.js`)
- **Lazy database connection** - Connects on first request instead of at startup
- **Added connection middleware** - Ensures DB is connected before handling requests
- **Better error responses** - Returns 503 with clear message if DB fails

### 3. Updated Vercel Config (`vercel.json`)
- **Increased timeout to 30s** - Allows more time for cold starts
- **Increased memory to 1024MB** - Better performance for database operations
- **Added NODE_ENV** - Sets production environment

## Required Vercel Environment Variables

Go to your Vercel project dashboard → Settings → Environment Variables and ensure these are set:

### Required Variables:
1. **MONGODB_URI** - Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
   - Make sure IP whitelist includes `0.0.0.0/0` in MongoDB Atlas

2. **SESSION_SECRET** - A random secret string
   - Example: `your-super-secret-session-key-change-this`

3. **STRIPE_PUBLISHABLE_KEY** - Your Stripe publishable key
   - Format: `pk_test_...` or `pk_live_...`

4. **STRIPE_SECRET_KEY** - Your Stripe secret key
   - Format: `sk_test_...` or `sk_live_...`

5. **BASE_URL** - Your deployed URL
   - Example: `https://busgo-y4k8.vercel.app`

### Optional Variables:
- **DB_NAME** - Database name (if not in connection string)
- **NODE_ENV** - Set to `production` (already in vercel.json)

## Deployment Steps

1. **Verify Environment Variables in Vercel**
   ```
   Visit: https://vercel.com/[your-username]/[project-name]/settings/environment-variables
   ```

2. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is in the IP whitelist
   - Or add Vercel's IP ranges

3. **Deploy the Changes**
   ```bash
   git add .
   git commit -m "Fix serverless function crashes"
   git push
   ```

4. **Monitor Deployment**
   - Go to Vercel dashboard
   - Check the deployment logs
   - Look for "MongoDB connected successfully" in logs

5. **Test the Application**
   - Visit: https://busgo-y4k8.vercel.app/login
   - Should load without 500 error

## Troubleshooting

### If still getting 500 error:

1. **Check Vercel Function Logs**
   ```
   Visit: https://vercel.com/[your-username]/[project-name]/logs
   ```
   Look for specific error messages

2. **Verify MongoDB Connection String**
   - Test locally with the same connection string
   - Ensure password doesn't contain special characters (or URL encode them)

3. **Check MongoDB Atlas**
   - Verify cluster is running
   - Check database user has read/write permissions
   - Verify network access allows Vercel

4. **Test Environment Variables**
   - In Vercel dashboard, check all variables are set
   - Redeploy after adding/updating variables

### Common Issues:

- **"MONGODB_URI not set"** → Add the variable in Vercel settings
- **"Connection timeout"** → Check MongoDB Atlas network access
- **"Authentication failed"** → Verify MongoDB username/password
- **"Session store error"** → Check SESSION_SECRET is set

## Next Steps

After deploying:
1. Monitor the first few requests in Vercel logs
2. Test all major features (login, booking, payment)
3. Check that sessions persist correctly
4. Verify Stripe payments work in production

## Support

If issues persist, check:
- Vercel deployment logs for specific errors
- MongoDB Atlas logs for connection attempts
- Network connectivity between Vercel and MongoDB Atlas
