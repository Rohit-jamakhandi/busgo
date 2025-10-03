const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      req.flash('error_msg', 'All fields are required');
      return res.redirect('/signup');
    }
    
    const exists = await User.findOne({ email });
    if (exists) {
      req.flash('error_msg', 'Email already registered');
      return res.redirect('/signup');
    }
    
    const user = await User.create({ name, email, password });
    
    // Save session explicitly
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.name = user.name;
    req.session.isAdmin = user.isAdmin;
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return next(err);
      }
      req.flash('success_msg', 'Account created');
      res.redirect('/');
    });
  } catch (err) { 
    console.error('Signup error:', err);
    next(err); 
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      req.flash('error_msg', 'Email and password are required');
      return res.redirect('/login');
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/login');
    }
    
    const ok = await user.comparePassword(password);
    if (!ok) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/login');
    }
    
    // Save session explicitly
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.name = user.name;
    req.session.isAdmin = user.isAdmin;
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return next(err);
      }
      req.flash('success_msg', 'Logged in');
      res.redirect('/');
    });
  } catch (err) { 
    console.error('Login error:', err);
    next(err); 
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
