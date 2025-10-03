const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      req.flash('error_msg', 'Email already registered');
      return res.redirect('/signup');
    }
    const user = await User.create({ name, email, password });
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.name = user.name;
    req.session.isAdmin = user.isAdmin;
    req.flash('success_msg', 'Account created');
    res.redirect('/');
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
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
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.name = user.name;
    req.session.isAdmin = user.isAdmin;
    req.flash('success_msg', 'Logged in');
    res.redirect('/');
  } catch (err) { next(err); }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
