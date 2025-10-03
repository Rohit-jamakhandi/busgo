require('dotenv').config();

console.log('Environment Variables Check:');
console.log('PORT:', process.env.PORT || '3000 (default)');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Missing');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✓ Set' : '✗ Missing');
console.log('STRIPE_PUBLISHABLE_KEY:', process.env.STRIPE_PUBLISHABLE_KEY ? '✓ Set' : '✗ Missing');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✓ Set' : '✗ Missing');

if (!process.env.MONGODB_URI) {
  console.error('\n❌ MONGODB_URI is missing! Server will fail to start.');
}
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('\n❌ STRIPE_SECRET_KEY is missing! Payments will fail.');
}

console.log('\nIf all keys show ✓, you can start the server with: npm run dev');
