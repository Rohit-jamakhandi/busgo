# Deployment Guide

## Deploy to GitHub

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `bus-ticketing-app` (or your preferred name)
3. Keep it public or private based on your preference
4. Don't initialize with README (we already have one)

### 2. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Professional bus ticketing app with Lucide icons and Lenis smooth scrolling"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bus-ticketing-app.git

# Push to GitHub
git push -u origin main
```

If you get an error about 'master' branch, use:
```bash
git branch -M main
git push -u origin main
```

## Deploy to Hosting Platforms

### Option 1: Deploy to Render (Recommended - Free Tier Available)

1. Go to [Render](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: bus-ticketing-app
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: A random secret string
   - `PORT`: 3000 (optional, Render sets this automatically)
7. Click "Create Web Service"

Your app will be live at: `https://bus-ticketing-app.onrender.com`

### Option 2: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: A random secret string
6. Deploy!

### Option 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Other
   - Build Command: `npm install`
   - Output Directory: (leave empty)
4. Add Environment Variables
5. Deploy!

### Option 4: Deploy to Heroku

```bash
# Install Heroku CLI
# Then run:
heroku login
heroku create bus-ticketing-app
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set SESSION_SECRET="your_secret"
git push heroku main
```

## MongoDB Setup

### Using MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string
6. Replace `<password>` with your database user password
7. Use this as your `MONGODB_URI` environment variable

## Environment Variables

Make sure to set these on your hosting platform:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bustickets?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-random-string-here
PORT=3000
```

## Post-Deployment

1. Visit your deployed URL
2. Create an admin account
3. Add buses through the admin panel
4. Test the booking flow

## Troubleshooting

### App crashes on startup
- Check MongoDB connection string
- Ensure all environment variables are set
- Check logs for specific errors

### Can't connect to database
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check database user credentials
- Ensure connection string is correct

### Sessions not working
- Make sure `SESSION_SECRET` is set
- For production, consider using a session store like `connect-mongo`

## GitHub Pages Note

**Important**: GitHub Pages only hosts static websites (HTML, CSS, JS). Since this is a Node.js application with a backend server and database, it **cannot** be hosted on GitHub Pages.

Use one of the hosting options above (Render, Railway, Vercel, or Heroku) instead.

## Continuous Deployment

Once connected to GitHub, most platforms will automatically redeploy when you push changes to your main branch.

To update your app:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Your hosting platform will automatically detect the changes and redeploy!
