const User = require('../models/User');

function ensureAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  
  // Check if it's an API request (JSON)
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(401).json({ error: 'Please log in first' });
  }
  
  req.flash('error_msg', 'Please log in first');
  return res.redirect('/login');
}

function ensureAdmin(req, res, next) {
  if (req.session && req.session.userId && req.session.isAdmin) return next();
  req.flash('error_msg', 'Admin access required');
  return res.redirect('/');
}

async function ensureAuthOptional(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      req.user = { _id: req.session.userId, name: req.session.name, email: req.session.email, isAdmin: req.session.isAdmin };
    } catch (e) {
      // ignore
    }
  }
  next();
}

module.exports = { ensureAuth, ensureAdmin, ensureAuthOptional };
