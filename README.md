# BusGo - Professional Bus Ticketing System

A modern, full-stack Node.js application for bus search, booking, and instant confirmation. Built with Express, MongoDB Atlas, EJS, Bootstrap 5, Lucide Icons, and Lenis smooth scrolling.

## ✨ Features

- **User Authentication**: Secure signup/login with bcrypt and session-based authentication
- **Admin Dashboard**: Complete bus management (add/edit/remove buses)
- **Smart Search**: Find buses by source, destination, and date
- **Interactive Seat Selection**: Visual seat grid with real-time availability
- **Instant Booking Confirmation**: No payment gateway - direct booking confirmation
- **Digital Receipts**: Professional, printable booking receipts
- **Booking History**: Complete booking management in user profile
- **Professional UI**: Modern design with Lucide icons and smooth scrolling
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, Bootstrap 5, Lucide Icons, Lenis Smooth Scroll
- **Database**: MongoDB Atlas (Mongoose)
- **Authentication**: bcrypt, express-session
- **Session Management**: express-session with MongoDB store
- **Icons**: Lucide Icons (professional SVG icons)
- **Animations**: Lenis smooth scrolling library

## 📁 Project Structure

```
bus-ticketing-app/
├── server.js              # Main Express server
├── config/
│   ├── db.js             # MongoDB connection
│   └── stripe.js         # Legacy Stripe config (not used)
├── models/
│   ├── User.js           # User schema with bcrypt
│   ├── Bus.js            # Bus schema
│   └── Booking.js        # Booking schema
├── routes/
│   ├── auth.js           # Signup/login/logout
│   ├── buses.js          # Bus CRUD & search
│   └── bookings.js       # Booking confirmation & receipts
├── views/
│   ├── layout.ejs        # Main layout with Lucide icons & Lenis
│   ├── home.ejs          # Professional search page
│   ├── results.ejs       # Bus results with icons
│   ├── booking.ejs       # Seat selection & confirmation
│   ├── login.ejs         # Login form
│   ├── signup.ejs        # Signup form
│   ├── admin.ejs         # Admin dashboard
│   ├── profile.ejs       # User bookings with receipt download
│   └── error.ejs         # Error page
├── public/
│   ├── css/style.css     # Professional custom styles
│   └── js/main.js        # Client-side JS
├── DEPLOYMENT.md         # Deployment guide
└── .gitignore           # Git ignore file
```

## Setup Instructions 🚀

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)

### 2. Clone and Install
```bash
cd bus-ticketing-app
npm install
```

### 3. Configure Environment Variables
Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bustickets?retryWrites=true&w=majority
SESSION_SECRET=your-random-secret-key-here
BASE_URL=http://localhost:3000
```

### 4. Get MongoDB Atlas URI
1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist your IP (or use 0.0.0.0/0 for testing)
4. Get connection string and replace `<username>`, `<password>`, `<cluster>`

### 5. Run the Application
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Visit: **http://localhost:3000**

## Admin Access 🔐
To access the admin dashboard:
1. Sign up for a new account
2. Connect to your MongoDB Atlas database
3. Find your user document in the `users` collection
4. Set `isAdmin: true` for that user
5. Visit `/admin` to manage buses

## Usage Guide 📖

### For Users:
1. **Sign up** or **Login**
2. **Search buses** by entering from/to/date
3. **Select bus** from results
4. **Choose seats** using the interactive grid
5. **Click "Proceed to Pay"** to confirm booking instantly
6. **Download receipt** from confirmation page or "My Bookings"
7. **View all bookings** in "My Bookings" section

### For Admins:
1. Login with admin account
2. Visit `/admin`
3. Add new buses with route, date, time, seats, fare
4. Edit or delete existing buses
5. Monitor all bookings

## API Endpoints 🔌

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout

### Buses
- `GET /buses/search?from=X&to=Y&date=Z` - Search buses
- `GET /buses/:id/booking` - Booking page
- `POST /buses/admin` - Add bus (admin only)
- `POST /buses/admin/:id` - Update bus (admin only)
- `POST /buses/admin/:id/delete` - Delete bus (admin only)

### Bookings
- `POST /bookings/confirm` - Confirm booking instantly
- `GET /bookings/receipt/:id` - Download receipt
- `GET /bookings/my` - User's bookings

## Security Features 🔒
- Password hashing with bcrypt (10 rounds)
- Session-based authentication with MongoDB store
- Environment variables for sensitive data
- MongoDB injection protection via Mongoose
- Secure session cookies

## Deployment 🚀

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy Options:**
- **Render** (Recommended - Free tier): [render.com](https://render.com)
- **Railway**: [railway.app](https://railway.app)
- **Vercel**: [vercel.com](https://vercel.com)
- **Heroku**: [heroku.com](https://heroku.com)

**Note**: This is a Node.js app with backend - it **cannot** be hosted on GitHub Pages (static only).

## Production Checklist ✅
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `SESSION_SECRET` (random 32+ characters)
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Set up error logging (Winston/Morgan)
- [ ] Configure CORS properly
- [ ] Use HTTPS (automatic on most platforms)
- [ ] Implement seat locking mechanism
- [ ] Add email notifications

## Optional Enhancements 🎁
- ✅ **Downloadable receipts** (Already implemented!)
- Email confirmation with Nodemailer
- PDF ticket generation
- QR code for tickets
- Booking cancellation
- SMS notifications
- Multi-language support
- Dark mode
- Payment gateway integration (Razorpay, PayPal)

## Troubleshooting 🔧

**Server won't start:**
- Check `.env` file exists and has correct values
- Verify MongoDB URI is correct
- Ensure all dependencies are installed (`npm install`)

**Can't connect to database:**
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check database user credentials
- Ensure connection string format is correct

**Can't access admin:**
- Verify `isAdmin: true` is set in database
- Clear browser cookies and re-login
- Check session is working properly

**Icons not showing:**
- Ensure Lucide script is loaded in layout.ejs
- Check `lucide.createIcons()` is called after DOM load
- Verify internet connection for CDN

## GitHub Setup 📦

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Professional bus ticketing system"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/bus-ticketing-app.git
git branch -M main
git push -u origin main
```

## Support 💬
For issues or questions:
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Lucide Icons](https://lucide.dev/)
- [Lenis Smooth Scroll](https://github.com/studio-freight/lenis)

## License 📄
MIT License - feel free to use for learning and projects!

---

Made with ❤️ using Node.js, Express, MongoDB, Bootstrap 5, Lucide Icons, and Lenis
