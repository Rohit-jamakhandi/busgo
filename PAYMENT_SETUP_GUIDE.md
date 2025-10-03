# Payment Setup Guide

## ✅ What's Been Added

Your bus ticketing app now supports **TWO payment methods**:

1. **💳 Card Payment** (via Stripe)
2. **📱 UPI/QR Code Payment** (Scan & Pay)

## 🔧 Fixing the Stripe API Key Error

### Problem
You're getting this error:
```
❌ Error: Invalid API Key provided: sk_test_***...ZxJN
```

### Solution
The Stripe secret key in your `.env` file is **incorrect or truncated**. 

**Steps to fix:**

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Open your `.env` file in the project root
4. Replace the `STRIPE_SECRET_KEY` value with the correct key from Stripe
5. Save the file and restart the server

**Example `.env` file:**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://localhost:27017/bustickets
SESSION_SECRET=smy-super-secret-session-key-12345

# Stripe Keys (Test Mode) - GET THESE FROM STRIPE DASHBOARD
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# App
BASE_URL=http://localhost:3000
```

## 📱 How to Use QR Code Payment

### For Users:

1. **Select your seats** on the booking page
2. **Choose payment method**: Click on "📱 UPI/QR Code" button
3. **Click "Generate QR Code"** button
4. **Scan the QR code** with any UPI app (Google Pay, PhonePe, Paytm, etc.)
5. **Complete payment** in your UPI app
6. **Return to the website** and click "✅ I've Paid - Verify Payment"
7. **(Optional)** Enter your UPI transaction ID for reference
8. **Done!** Your booking is confirmed

### Payment Flow:

```
Select Seats → Choose "UPI/QR Code" → Generate QR → Scan & Pay → Click "I've Paid" → Booking Confirmed! 🎉
```

## 🔄 How It Works

### QR Code Payment:
- Generates a UPI payment QR code with booking details
- User scans and pays via any UPI app
- User confirms payment on the website
- Booking is marked as successful

### Card Payment:
- Uses Stripe for secure card processing
- Supports all major credit/debit cards
- Automatic payment verification

## ⚙️ Configuration for Production

### UPI Merchant ID
Currently, the QR code uses a placeholder merchant UPI ID: `merchant@upi`

**To use real payments:**
1. Get a merchant UPI ID from your payment provider
2. Update line 114 in `routes/bookings.js`:
   ```javascript
   const upiString = `upi://pay?pa=YOUR_MERCHANT_UPI_ID@bank&pn=BusTicketing&am=${amount}&cu=INR&tn=Booking-${booking._id}&mc=0000`;
   ```

### Payment Gateway Integration
For automatic payment verification, integrate with:
- **Razorpay** (supports UPI QR codes)
- **PayU**
- **Cashfree**
- **Instamojo**

These services provide webhooks to automatically verify payments.

## 🧪 Testing

### Test Card Payment (Stripe):
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Test QR Payment:
- Generate QR code
- Since it's using a placeholder UPI ID, you can click "I've Paid" directly
- In production, users would actually scan and pay

## 📝 Important Notes

1. **Stripe Key**: You MUST fix the Stripe secret key for card payments to work
2. **UPI ID**: Replace the placeholder UPI ID with your real merchant ID
3. **Payment Verification**: Current QR payment is manual - integrate a payment gateway for automatic verification
4. **Security**: Never commit your `.env` file to Git (it's already in `.gitignore`)

## 🚀 Starting the Server

```bash
npm start
```

Then visit: http://localhost:3000

## 📞 Support

If you need help:
1. Check the server logs in the terminal
2. Check browser console for JavaScript errors
3. Verify your `.env` file has correct values
4. Ensure MongoDB is connected

---

**Happy Booking! 🚌💳📱**
