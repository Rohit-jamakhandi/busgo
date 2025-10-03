# Vercel Deployment Guide for Bus-Go

## ✅ Completed Setup

Your application is now ready for Vercel deployment with the following configurations:

### 1. Files Created/Updated:
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `.env.example` - Updated with MongoDB Atlas credentials
- ✅ All changes committed to git

### 2. MongoDB Atlas Configuration:
- **Database**: MongoDB Atlas (Free Tier)
- **Connection String**: See `.env.vercel` file (not committed to GitHub)
- **Credentials**: Stored securely in `.env.vercel` file

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Push to GitHub

Since you already have the repository at https://github.com/Rohit-jamakhandi/Bus-Go, you need to push your local changes:

```bash
# If the remote repository has existing content, you may need to pull first
git pull origin master --allow-unrelated-histories

# If there are merge conflicts, resolve them, then:
git add .
git commit -m "Merge and add Vercel configuration"

# Push to GitHub
git push origin master
```

**Alternative (if repository is empty or you want to overwrite):**
```bash
git push origin master --force
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your repository: `Rohit-jamakhandi/Bus-Go`
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Other (or Node.js)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (not needed for Node.js)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables** (CRITICAL):
   Click "Environment Variables" and add the following:

   ```
   NODE_ENV=production
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   SESSION_SECRET=<your_session_secret>
   STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   PORT=3000
   ```

   **Note**: Copy the actual values from your `.env.vercel` file (not committed to GitHub)

   **Important**: After deployment, you'll need to add one more variable:
   ```
   BASE_URL=https://your-actual-vercel-url.vercel.app
   ```

6. **Deploy**:
   - Click "Deploy"
   - Wait for the deployment to complete (2-3 minutes)

7. **Update BASE_URL**:
   - Once deployed, copy your Vercel URL (e.g., `https://bus-go-xyz.vercel.app`)
   - Go to Project Settings → Environment Variables
   - Add/Update `BASE_URL` with your actual Vercel URL
   - Redeploy the project

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from your project directory)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? bus-go (or your preferred name)
# - Directory? ./ (current directory)
# - Override settings? No

# Add environment variables
vercel env add NODE_ENV
# Enter: production

vercel env add MONGODB_URI
# Enter: <your_mongodb_atlas_connection_string>

vercel env add SESSION_SECRET
# Enter: <your_session_secret>

vercel env add STRIPE_PUBLISHABLE_KEY
# Enter: <your_stripe_publishable_key>

vercel env add STRIPE_SECRET_KEY
# Enter: <your_stripe_secret_key>

# Copy values from .env.vercel file

# Deploy to production
vercel --prod
```

---

## 🔧 Post-Deployment Configuration

### 1. MongoDB Atlas Network Access

Ensure MongoDB Atlas allows connections from Vercel:

1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com
2. Navigate to **Network Access** (left sidebar)
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary for Vercel's dynamic IPs
5. Click **"Confirm"**

### 2. Seed Database (First Time Only)

After deployment, you need to seed your database with bus data:

**Option A: Run locally connected to Atlas**
```bash
# Update your local .env to use MongoDB Atlas
# Then run:
node seed-buses.js
node seed-more-buses.js
```

**Option B: Create a seed endpoint (temporary)**
You can add a temporary admin route to seed data, then remove it after use.

### 3. Test Your Deployment

1. Visit your Vercel URL
2. Test the following:
   - ✅ Home page loads
   - ✅ User registration works
   - ✅ User login works
   - ✅ Bus search and listing works
   - ✅ Booking flow works
   - ✅ Payment with Stripe works
   - ✅ QR code generation works

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin master

# Vercel will automatically detect and deploy!
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Verify MongoDB Atlas Network Access allows 0.0.0.0/0
- Check environment variables in Vercel dashboard
- Ensure MONGODB_URI is correct

### Issue: "Session store error"
**Solution**: 
- Ensure SESSION_SECRET is set in Vercel environment variables
- Check MongoDB connection is working

### Issue: "Stripe payments not working"
**Solution**: 
- Verify STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY are set
- Update BASE_URL to your actual Vercel URL
- Check Stripe webhook settings if using webhooks

### Issue: "Static files not loading"
**Solution**: 
- Verify `vercel.json` is in the root directory
- Check that `/public` route is configured correctly
- Clear browser cache

### Issue: "Application crashes on startup"
**Solution**: 
- Check Vercel deployment logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (>=18)

---

## 📊 Monitoring

### View Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View "Functions" logs for server errors

### Performance:
- Vercel provides automatic performance monitoring
- Check "Analytics" tab in your project dashboard

---

## 🔐 Security Recommendations

1. **Change SESSION_SECRET**: Use a strong, random secret in production
   ```bash
   # Generate a secure secret:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Use Production Stripe Keys**: Replace test keys with live keys when ready

3. **Environment Variables**: Never commit `.env` file to GitHub (already in `.gitignore`)

4. **MongoDB Security**: 
   - Use strong passwords
   - Limit IP access if possible
   - Enable MongoDB Atlas audit logs

---

## 📝 Summary

Your Bus-Go application is configured and ready for Vercel deployment with:
- ✅ Vercel configuration (`vercel.json`)
- ✅ MongoDB Atlas integration
- ✅ Environment variables template
- ✅ Git repository ready
- ✅ All dependencies included

**Next Steps:**
1. Push code to GitHub: `git push origin master`
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy and test!

**Your Repository**: https://github.com/Rohit-jamakhandi/Bus-Go
**MongoDB Atlas**: Already configured and ready

---

## 🆘 Need Help?

If you encounter any issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Ensure MongoDB Atlas network access is configured
4. Test MongoDB connection string locally first

Good luck with your deployment! 🚀
