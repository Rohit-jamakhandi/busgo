const express = require('express');
const QRCode = require('qrcode');
const { ensureAuth } = require('../middleware/auth');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const router = express.Router();

// Create payment intent and provisional booking
router.post('/create', async (req, res, next) => {
  try {
    const { busId, seats } = req.body;
    
    console.log('=== CREATE BOOKING REQUEST ===');
    console.log('Body:', req.body);
    console.log('Session:', req.session);
    
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
      console.log('User not logged in');
      return res.status(401).json({ error: 'Please log in to book tickets' });
    }
    
    console.log('User ID:', req.session.userId);
    
    const bus = await Bus.findById(busId);
    if (!bus) {
      console.log('Bus not found:', busId);
      return res.status(404).json({ error: 'Bus not found' });
    }
    console.log('Bus found:', bus.bus_name);

    const seatCount = Array.isArray(seats) ? seats.length : 0;
    if (seatCount === 0) return res.status(400).json({ error: 'No seats selected' });
    if (seatCount > bus.available_seats) return res.status(400).json({ error: 'Not enough seats available' });

    const amount = bus.fare * seatCount * 100;
    console.log('Amount (paise):', amount);

    console.log('Initializing Stripe...');
    const stripe = getStripeInstance();
    
    console.log('Creating payment intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      payment_method_types: ['card', 'upi', 'netbanking'],
      metadata: { busId: bus._id.toString(), seats: seats.join(',') },
    });
    console.log('✅ Payment intent created:', paymentIntent.id);

    console.log('Creating booking in database...');
    const booking = await Booking.create({
      user: req.session.userId,
      bus: bus._id,
      seats,
      amount: amount / 100,
      paymentStatus: 'pending',
      orderId: paymentIntent.id,
    });
    console.log('✅ Booking created:', booking._id);

    const response = { 
      clientSecret: paymentIntent.client_secret, 
      bookingId: booking._id,
      amount: amount / 100
    };
    console.log('✅ Sending response:', response);
    
    res.json(response);
  } catch (err) { 
    console.error('❌ ERROR in /bookings/create:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Generate UPI QR Code for payment
router.post('/create-qr', async (req, res, next) => {
  try {
    const { busId, seats } = req.body;
    
    console.log('=== CREATE QR PAYMENT REQUEST ===');
    console.log('Body:', req.body);
    
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
      console.log('User not logged in');
      return res.status(401).json({ error: 'Please log in to book tickets' });
    }
    
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const seatCount = Array.isArray(seats) ? seats.length : 0;
    if (seatCount === 0) return res.status(400).json({ error: 'No seats selected' });
    if (seatCount > bus.available_seats) return res.status(400).json({ error: 'Not enough seats available' });

    const amount = bus.fare * seatCount;
    
    // Create booking with pending status
    const booking = await Booking.create({
      user: req.session.userId,
      bus: bus._id,
      seats,
      amount: amount,
      paymentStatus: 'pending',
      orderId: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    // Generate UPI payment string
    // Format: upi://pay?pa=MERCHANT_UPI_ID&pn=MERCHANT_NAME&am=AMOUNT&cu=INR&tn=TRANSACTION_NOTE
    const upiString = `upi://pay?pa=merchant@upi&pn=BusTicketing&am=${amount}&cu=INR&tn=Booking-${booking._id}&mc=0000`;
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(upiString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    console.log('✅ QR Code generated for booking:', booking._id);
    
    res.json({ 
      qrCode: qrCodeDataURL,
      bookingId: booking._id,
      amount: amount,
      upiString: upiString
    });
  } catch (err) { 
    console.error('❌ ERROR in /bookings/create-qr:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Verify UPI payment (manual verification by admin or auto-webhook)
router.post('/verify-qr', ensureAuth, async (req, res, next) => {
  try {
    const { bookingId, transactionId } = req.body;
    const booking = await Booking.findById(bookingId).populate('bus');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // In production, you would verify with payment gateway
    // For now, we'll mark as success and let admin verify
    booking.paymentStatus = 'success';
    booking.paymentId = transactionId || `UPI-${Date.now()}`;
    await booking.save();

    // Decrement seats
    const seatCount = booking.seats.length;
    await Bus.findByIdAndUpdate(booking.bus._id, { $inc: { available_seats: -seatCount } });

    res.json({ success: true, bookingId: booking._id, paymentId: booking.paymentId });
  } catch (err) { next(err); }
});

// Verify payment
router.post('/verify', ensureAuth, async (req, res, next) => {
  try {
    const { paymentIntentId, bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('bus');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const stripe = getStripeInstance();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      booking.paymentStatus = 'failed';
      await booking.save();
      return res.status(400).json({ error: 'Payment not successful' });
    }

    // success
    booking.paymentStatus = 'success';
    booking.paymentId = paymentIntent.id;
    await booking.save();

    // decrement seats
    const seatCount = booking.seats.length;
    await Bus.findByIdAndUpdate(booking.bus._id, { $inc: { available_seats: -seatCount } });

    res.json({ success: true, bookingId: booking._id, paymentId: paymentIntent.id });
  } catch (err) { next(err); }
});

// Confirm booking directly without payment gateway
router.post('/confirm', async (req, res, next) => {
  try {
    const { busId, seats } = req.body;
    
    console.log('=== CONFIRM BOOKING REQUEST ===');
    console.log('Body:', req.body);
    console.log('Session:', req.session);
    
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
      console.log('User not logged in');
      return res.status(401).json({ error: 'Please log in to book tickets' });
    }
    
    console.log('User ID:', req.session.userId);
    
    const bus = await Bus.findById(busId);
    if (!bus) {
      console.log('Bus not found:', busId);
      return res.status(404).json({ error: 'Bus not found' });
    }
    console.log('Bus found:', bus.bus_name);

    const seatCount = Array.isArray(seats) ? seats.length : 0;
    if (seatCount === 0) return res.status(400).json({ error: 'No seats selected' });
    if (seatCount > bus.available_seats) return res.status(400).json({ error: 'Not enough seats available' });

    const amount = bus.fare * seatCount;
    console.log('Amount:', amount);

    console.log('Creating booking in database...');
    const booking = await Booking.create({
      user: req.session.userId,
      bus: bus._id,
      seats,
      amount: amount,
      paymentStatus: 'success',
      paymentId: `CONF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderId: `ORD-${Date.now()}`,
    });
    console.log('✅ Booking created:', booking._id);

    // Decrement seats
    await Bus.findByIdAndUpdate(bus._id, { $inc: { available_seats: -seatCount } });
    console.log('✅ Seats decremented');

    const response = { 
      success: true,
      bookingId: booking._id,
      seats: seats,
      amount: amount
    };
    console.log('✅ Sending response:', response);
    
    res.json(response);
  } catch (err) { 
    console.error('❌ ERROR in /bookings/confirm:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Download receipt
router.get('/receipt/:bookingId', ensureAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('bus').populate('user');
    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    // Check if booking belongs to user
    if (booking.user._id.toString() !== req.session.userId) {
      return res.status(403).send('Unauthorized');
    }

    // Generate receipt HTML
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Booking Receipt - ${booking._id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      padding: 40px; 
      background: #f5f5f5;
    }
    .receipt { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      padding: 40px; 
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header { 
      text-align: center; 
      border-bottom: 3px solid #667eea; 
      padding-bottom: 20px; 
      margin-bottom: 30px;
    }
    .header h1 { 
      color: #667eea; 
      font-size: 2rem; 
      margin-bottom: 10px;
    }
    .header p { 
      color: #666; 
      font-size: 1rem;
    }
    .section { 
      margin-bottom: 25px;
    }
    .section-title { 
      font-size: 1.2rem; 
      color: #333; 
      margin-bottom: 15px; 
      font-weight: 600;
      border-left: 4px solid #667eea;
      padding-left: 10px;
    }
    .info-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px 0; 
      border-bottom: 1px solid #eee;
    }
    .info-label { 
      color: #666; 
      font-weight: 500;
    }
    .info-value { 
      color: #333; 
      font-weight: 600;
    }
    .total { 
      background: #f8f9fa; 
      padding: 20px; 
      border-radius: 8px; 
      margin-top: 20px;
    }
    .total-row { 
      display: flex; 
      justify-content: space-between; 
      font-size: 1.5rem; 
      font-weight: bold;
      color: #667eea;
    }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      padding-top: 20px; 
      border-top: 2px solid #eee;
      color: #999;
      font-size: 0.9rem;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      background: #28a745;
      color: white;
    }
    @media print {
      body { background: white; padding: 0; }
      .receipt { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>🚌 Bus Ticket Receipt</h1>
      <p>Thank you for booking with us!</p>
    </div>

    <div class="section">
      <div class="section-title">Booking Information</div>
      <div class="info-row">
        <span class="info-label">Booking ID:</span>
        <span class="info-value">${booking._id}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Payment ID:</span>
        <span class="info-value">${booking.paymentId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Booking Date:</span>
        <span class="info-value">${new Date(booking.createdAt).toLocaleString()}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value"><span class="status-badge">CONFIRMED</span></span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Passenger Information</div>
      <div class="info-row">
        <span class="info-label">Name:</span>
        <span class="info-value">${booking.user.name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${booking.user.email}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Journey Details</div>
      <div class="info-row">
        <span class="info-label">Bus Name:</span>
        <span class="info-value">${booking.bus.bus_name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Bus ID:</span>
        <span class="info-value">${booking.bus.bus_id}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Route:</span>
        <span class="info-value">${booking.bus.from} → ${booking.bus.to}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Journey Date:</span>
        <span class="info-value">${booking.bus.date}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Departure Time:</span>
        <span class="info-value">${booking.bus.time}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Seat Numbers:</span>
        <span class="info-value">${booking.seats.join(', ')}</span>
      </div>
    </div>

    <div class="total">
      <div class="total-row">
        <span>Total Amount Paid:</span>
        <span>₹${booking.amount}</span>
      </div>
    </div>

    <div class="footer">
      <p>This is a computer-generated receipt and does not require a signature.</p>
      <p>Please carry a printed or digital copy of this receipt during your journey.</p>
      <p style="margin-top: 10px;">For support, contact us at support@busticketing.com</p>
    </div>
  </div>

  <script>
    // Auto-print on load
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
    `;

    res.send(receiptHTML);
  } catch (err) { 
    console.error('❌ ERROR in /bookings/receipt:', err);
    next(err); 
  }
});

// List my bookings
router.get('/my', ensureAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.session.userId }).populate('bus').sort({ createdAt: -1 });
    res.render('profile', { bookings });
  } catch (err) { next(err); }
});

module.exports = router;
