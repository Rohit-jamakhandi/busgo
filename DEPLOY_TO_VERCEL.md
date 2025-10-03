# 🚀 Deploy Bus-Go to Vercel - Final Steps

## ✅ Completed Steps

1. ✅ **Code pushed to GitHub**: https://github.com/Rohit-jamakhandi/busgo
2. ✅ **Vercel configuration created**: `vercel.json`
3. ✅ **Environment variables prepared**: `.env.vercel` (local only)
4. ✅ **MongoDB Atlas ready**: Connection string configured

---

## 🎯 Next: Deploy to Vercel

### Step 1: Import Project to Vercel

1. **Go to Vercel**: https://vercel.com/
2. **Sign in** with your GitHub account
3. Click **"Add New..."** → **"Project"**
4. Find and select your repository: **`Rohit-jamakhandi/busgo`**
5. Click **"Import"**

### Step 2: Configure Project Settings

**Framework Preset**: Other (or Node.js)
**Root Directory**: `./` (leave as default)
**Build Command**: Leave empty
**Output Directory**: Leave empty
**Install Command**: `npm install`

### Step 3: Add Environment Variables (CRITICAL!)

Click **"Environment Variables"** and add these **one by one**:

#### Required Variables:

```
NODE_ENV
production

MONGODB_URI
mongodb+srv://rohitsj8825_db_user:rnsrh0wAB6mAGZkR@busgo.irfpsp7.mongodb.net/?retryWrites=true&w=majority&appName=Busgo

SESSION_SECRET
smy-super-secret-session-key-12345

PORT
3000
```

#### Stripe Keys (copy from your .env.vercel file):

```
STRIPE_PUBLISHABLE_KEY
<copy_from_your_env_vercel_file>

STRIPE_SECRET_KEY
<copy_from_your_env_vercel_file>
```

**Note**: The actual Stripe keys are stored in your local `.env.vercel` file (not committed to GitHub for security).

**Important**: Make sure to select **"Production", "Preview", and "Development"** for all environment variables.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment to complete
3. You'll get a URL like: `https://busgo-xyz.vercel.app`

### Step 5: Update BASE_URL

1. Copy your Vercel deployment URL
2. Go to **Project Settings** → **Environment Variables**
3. Add a new variable:
   ```
   BASE_URL
   https://your-actual-vercel-url.vercel.app
   ```
4. Click **"Redeploy"** from the Deployments tab

---

## 🔧 Post-Deployment: Configure MongoDB Atlas

### Allow Vercel to Access MongoDB

1. Go to **MongoDB Atlas Dashboard**: https://cloud.mongodb.com/
2. Click on your cluster: **Busgo**
3. Go to **Network Access** (left sidebar)
4. Click **"Add IP Address"**
5. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is required because Vercel uses dynamic IPs
6. Click **"Confirm"**

### Seed Your Database (First Time Only)

You need to add bus data to your database. Run these commands **locally** with your MongoDB Atlas connection:

```bash
# Make sure your local .env has the MongoDB Atlas URI
node seed-buses.js
node seed-more-buses.js
```

This will populate your database with bus routes and schedules.

---

## ✅ Test Your Deployment

Visit your Vercel URL and test:

1. **Home page loads** ✓
2. **User registration** ✓
3. **User login** ✓
4. **Search for buses** ✓
5. **Select seats and book** ✓
6. **Payment with Stripe** ✓
7. **View bookings** ✓

### Test Payment (Stripe Test Mode)

Use these test card details:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

---

## 🔄 Continuous Deployment

Every time you push to GitHub, Vercel will automatically deploy:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will detect the push and deploy automatically! 🎉

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**:
- Verify MongoDB Atlas Network Access allows 0.0.0.0/0
- Check MONGODB_URI in Vercel environment variables
- Ensure the connection string is correct

### Issue: "Application crashes"
**Solution**:
- Check Vercel deployment logs (Functions tab)
- Verify all environment variables are set
- Ensure Node.js version is compatible (>=18)

### Issue: "No buses showing"
**Solution**:
- You need to seed the database first
- Run `node seed-buses.js` locally with Atlas connection

### Issue: "Stripe payment not working"
**Solution**:
- Verify STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY are set
- Check that BASE_URL is set to your actual Vercel URL
- Use test card: 4242 4242 4242 4242

---

## 📊 Monitor Your Application

### View Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View **"Functions"** tab for server logs

### Check Performance:
- Vercel provides automatic performance monitoring
- Check **"Analytics"** tab in your project

---

## 🔐 Security Recommendations

1. **Change SESSION_SECRET** to a strong random value:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Use Production Stripe Keys** when ready to go live:
   - Get live keys from Stripe Dashboard
   - Replace test keys in Vercel environment variables

3. **Enable HTTPS** (Vercel does this automatically)

4. **Monitor MongoDB Access**:
   - Review connection logs in MongoDB Atlas
   - Set up alerts for unusual activity

---

## 📝 Summary

**Your Bus-Go Application is Ready! 🎉**

- ✅ **GitHub**: https://github.com/Rohit-jamakhandi/busgo
- ✅ **MongoDB Atlas**: Configured and ready
- ✅ **Vercel**: Ready to deploy
- ✅ **Environment Variables**: Prepared
- ✅ **Payment Integration**: Stripe configured

**Next Action**: Follow Step 1-5 above to deploy to Vercel!

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas network access is configured
4. Test MongoDB connection locally first

**Your deployment should take less than 5 minutes!** 🚀

---

**Repository**: https://github.com/Rohit-jamakhandi/busgo
**MongoDB**: MongoDB Atlas (Free Tier)
**Hosting**: Vercel (Free Tier)
**Payment**: Stripe (Test Mode)

Good luck! 🎊
