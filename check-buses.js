require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('./models/Bus');

async function checkBuses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const buses = await Bus.find({});
    console.log(`Total buses in database: ${buses.length}\n`);

    if (buses.length === 0) {
      console.log('❌ No buses found! Run: node seed-buses.js');
    } else {
      console.log('✅ Buses found:');
      buses.forEach(b => {
        console.log(`  - ${b.from} → ${b.to} | ${b.date} ${b.time} | ${b.bus_name}`);
      });
      
      console.log('\n📝 To search, use:');
      console.log('  From: Mumbai');
      console.log('  To: Pune');
      console.log('  Date: 2025-10-02');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkBuses();
