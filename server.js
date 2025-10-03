require('dotenv').config();
const path = require('path');
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { connectDB } = require('./config/db');
const { ensureAuthOptional, ensureAdmin } = require('./middleware/auth');
const Bus = require('./models/Bus');

// Routes
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/buses');
const bookingRoutes = require('./routes/bookings');

const app = express();

// DB
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(layouts);
app.set('layout', 'layout');

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Sessions
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions',
  touchAfter: 24 * 3600 // lazy session update
});

app.set('trust proxy', 1); // Trust first proxy (Vercel)

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'changeme',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true,
      sameSite: 'lax'
    },
  })
);
app.use(flash());

// Static
app.use('/public', express.static(path.join(__dirname, 'public')));

// Locals
app.use(ensureAuthOptional);
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user || null;
  res.locals.STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/buses', busRoutes);
app.use('/bookings', bookingRoutes);

// Pages
app.get('/', (req, res) => {
  res.render('home', { title: 'Bus Ticketing' });
});

app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/admin', ensureAdmin, async (req, res, next) => {
  try {
    const buses = await Bus.find().sort({ date: 1, time: 1 });
    res.render('admin', { buses });
  } catch (err) { next(err); }
});
app.get('/profile', (req, res) => res.redirect('/bookings/my'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (req.accepts('html')) {
    return res.status(500).render('error', { message: err.message || 'Server Error' });
  }
  res.status(500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
