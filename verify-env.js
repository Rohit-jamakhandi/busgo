// Quick script to verify environment variables are set correctly
require('dotenv').config();

console.log('\n=== Environment Variables Check ===\n');

const requiredVars = [
  'MONGODB_URI',
  'SESSION_SECRET',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY'
];

const optionalVars = [
  'BASE_URL',
  'DB_NAME',
  'NODE_ENV',
  'PORT'
];

let allGood = true;

console.log('Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    const masked = varName.includes('SECRET') || varName.includes('KEY') || varName.includes('URI')
      ? value.substring(0, 10) + '...' + value.substring(value.length - 5)
      : value;
    console.log(`✓ ${varName}: ${masked}`);
  } else {
    console.log(`✗ ${varName}: NOT SET`);
    allGood = false;
  }
});

console.log('\nOptional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✓ ${varName}: ${value}`);
  } else {
    console.log(`- ${varName}: not set (optional)`);
  }
});

console.log('\n' + '='.repeat(40));
if (allGood) {
  console.log('✓ All required variables are set!');
  console.log('\nNext: Make sure these same variables are set in Vercel:');
  console.log('https://vercel.com/dashboard → Your Project → Settings → Environment Variables');
} else {
  console.log('✗ Some required variables are missing!');
  console.log('Please set them in your .env file (locally) and Vercel dashboard (production)');
}
console.log('='.repeat(40) + '\n');
