# GitHub Setup & Hosting Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon in top right → **New repository**
3. Fill in details:
   - **Repository name**: `bus-ticketing-app`
   - **Description**: Professional bus ticketing system with instant booking
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** check "Initialize with README" (we already have one)
4. Click **Create repository**

## Step 2: Push Your Code to GitHub

Open your terminal in the project directory and run:

```bash
# Initialize git (if not already done)
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: Professional bus ticketing system with Lucide icons and Lenis smooth scrolling"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/bus-ticketing-app.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### If you get authentication errors:

**Option 1: Use Personal Access Token**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when prompted

**Option 2: Use GitHub CLI**
```bash
gh auth login
git push -u origin main
```

## Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. README.md should display automatically

## Important: GitHub Pages Cannot Host This App

⚠️ **GitHub Pages only hosts static websites** (HTML, CSS, JavaScript files).

This is a **Node.js application** with:
- Backend server (Express.js)
- Database (MongoDB)
- Server-side rendering (EJS)
- Session management

**You MUST use a proper hosting platform** that supports Node.js applications.

## Recommended Hosting Platforms

### 1. Render (Recommended - Free Tier)

**Why Render?**
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Easy to use
- ✅ Supports Node.js natively
- ✅ Free MongoDB hosting available

**Steps:**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name**: bus-ticketing-app
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
6. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_random_secret_key
   ```
7. Click **Create Web Service**
8. Wait 2-3 minutes for deployment
9. Your app will be live at: `https://bus-ticketing-app.onrender.com`

### 2. Railway (Easy & Fast)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Add environment variables
6. Deploy!

### 3. Vercel (Good for Node.js)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings
4. Add environment variables
5. Deploy!

### 4. Heroku (Classic Option)

```bash
# Install Heroku CLI first
heroku login
heroku create bus-ticketing-app
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set SESSION_SECRET="your_secret"
git push heroku main
```

## MongoDB Atlas Setup (Required)

Your app needs a database. Use MongoDB Atlas (free):

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a **Free Cluster** (M0)
4. Click **Database Access** → Add Database User
   - Username: `busapp`
   - Password: Generate secure password
5. Click **Network Access** → Add IP Address
   - Add: `0.0.0.0/0` (allow from anywhere)
6. Click **Database** → **Connect** → **Connect your application**
7. Copy connection string
8. Replace `<password>` with your database password
9. Use this as `MONGODB_URI` in your hosting platform

## Environment Variables

Set these on your hosting platform:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bustickets?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-random-string-minimum-32-characters
PORT=3000
NODE_ENV=production
```

## After Deployment

1. Visit your deployed URL
2. Sign up for an account
3. Connect to MongoDB and set `isAdmin: true` for your user
4. Login and visit `/admin` to add buses
5. Test the complete booking flow

## Continuous Deployment

Once connected to GitHub, your hosting platform will automatically redeploy when you push changes:

```bash
# Make changes to your code
git add .
git commit -m "Updated feature X"
git push origin main

# Your hosting platform will automatically detect and redeploy!
```

## Troubleshooting

### "Application Error" after deployment
- Check environment variables are set correctly
- View logs on your hosting platform
- Ensure MongoDB connection string is correct

### Can't connect to database
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check database user credentials
- Test connection string locally first

### App works locally but not on hosting
- Ensure `PORT` is read from `process.env.PORT`
- Check all dependencies are in `package.json`
- Verify `node_modules` is in `.gitignore`

## Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **GitHub Docs**: [docs.github.com](https://docs.github.com)

---

**Remember**: This is a full-stack application. You need a platform that supports Node.js backend, not just static file hosting like GitHub Pages!
