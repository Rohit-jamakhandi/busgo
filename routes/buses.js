const express = require('express');
const Bus = require('../models/Bus');
const { ensureAdmin } = require('../middleware/auth');
const router = express.Router();

// Search buses
router.get('/search', async (req, res, next) => {
  try {
    const { from, to, date } = req.query;
    console.log('Search params:', { from, to, date }); // Debug log
    
    const q = {};
    if (from) q.from = new RegExp(`^${from}$`, 'i');
    if (to) q.to = new RegExp(`^${to}$`, 'i');
    if (date) q.date = date;
    
    console.log('Query:', q); // Debug log
    const buses = await Bus.find(q).sort({ time: 1 });
    console.log('Found buses:', buses.length); // Debug log
    
    res.render('results', { title: 'Results', buses, query: { from, to, date } });
  } catch (err) { next(err); }
});

// Booking page for a bus
router.get('/:id/booking', async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).render('error', { message: 'Bus not found' });
    res.render('booking', { bus });
  } catch (err) { next(err); }
});

// Admin create bus
router.post('/admin', ensureAdmin, async (req, res, next) => {
  try {
    const { bus_id, bus_name, from, to, date, time, seats_total, available_seats, fare } = req.body;
    await Bus.create({ bus_id, bus_name, from, to, date, time, seats_total, available_seats, fare });
    req.flash('success_msg', 'Bus added');
    res.redirect('/admin');
  } catch (err) { next(err); }
});

// Admin update bus
router.post('/admin/:id', ensureAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const { bus_name, from, to, date, time, seats_total, available_seats, fare } = req.body;
    await Bus.findByIdAndUpdate(id, { bus_name, from, to, date, time, seats_total, available_seats, fare });
    req.flash('success_msg', 'Bus updated');
    res.redirect('/admin');
  } catch (err) { next(err); }
});

// Admin delete bus
router.post('/admin/:id/delete', ensureAdmin, async (req, res, next) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Bus removed');
    res.redirect('/admin');
  } catch (err) { next(err); }
});

module.exports = router;
