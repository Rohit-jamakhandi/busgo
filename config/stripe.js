const Stripe = require('stripe');

function getStripeInstance() {
  const secret_key = process.env.STRIPE_SECRET_KEY;
  if (!secret_key) {
    throw new Error('Stripe secret key missing in environment');
  }
  return Stripe(secret_key);
}

module.exports = { getStripeInstance };
