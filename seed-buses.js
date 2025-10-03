require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('./models/Bus');

// Realistic buses based on actual Indian bus operators
const buses = [
  // Mumbai - Pune Route (Popular)
  { bus_id: 'MH12AB1234', bus_name: 'VRL Travels Volvo Multi-Axle', from: 'Mumbai', to: 'Pune', date: '2025-01-15', time: '06:00', fare: 600, total_seats: 40, available_seats: 35, women_seats: [1, 2, 5, 6] },
  { bus_id: 'MH12CD5678', bus_name: 'Neeta Volvo AC Sleeper', from: 'Mumbai', to: 'Pune', date: '2025-01-15', time: '22:30', fare: 800, total_seats: 36, available_seats: 30, women_seats: [1, 2, 9, 10] },
  { bus_id: 'MH14EF9012', bus_name: 'Shivneri Shivai Bus', from: 'Mumbai', to: 'Pune', date: '2025-01-15', time: '08:00', fare: 450, total_seats: 50, available_seats: 45, women_seats: [1, 2, 3, 4] },
  
  // Bangalore - Chennai Route
  { bus_id: 'KA01GH3456', bus_name: 'KPN Travels Scania AC', from: 'Bangalore', to: 'Chennai', date: '2025-01-16', time: '23:00', fare: 900, total_seats: 40, available_seats: 32, women_seats: [1, 2, 5, 6, 9, 10] },
  { bus_id: 'TN09IJ7890', bus_name: 'SRS Travels Volvo', from: 'Bangalore', to: 'Chennai', date: '2025-01-16', time: '22:00', fare: 850, total_seats: 45, available_seats: 38, women_seats: [1, 2, 3, 4] },
  { bus_id: 'KA05KL1234', bus_name: 'Kallada Travels G4', from: 'Bangalore', to: 'Chennai', date: '2025-01-16', time: '21:30', fare: 1000, total_seats: 36, available_seats: 28, women_seats: [1, 2, 5, 6] },
  
  // Delhi - Agra Route
  { bus_id: 'DL01MN5678', bus_name: 'Rajasthan roadways Volvo', from: 'Delhi', to: 'Agra', date: '2025-01-17', time: '06:00', fare: 500, total_seats: 50, available_seats: 42, women_seats: [1, 2, 3, 4, 5, 6] },
  { bus_id: 'UP16OP9012', bus_name: 'UP roadways AC Seater', from: 'Delhi', to: 'Agra', date: '2025-01-17', time: '07:30', fare: 450, total_seats: 55, available_seats: 48, women_seats: [1, 2, 3, 4] },
  
  // Hyderabad - Bangalore Route
  { bus_id: 'TS09QR3456', bus_name: 'Orange Travels Volvo', from: 'Hyderabad', to: 'Bangalore', date: '2025-01-18', time: '21:00', fare: 750, total_seats: 40, available_seats: 35, women_seats: [1, 2, 5, 6] },
  { bus_id: 'KA03ST7890', bus_name: 'IntrCity SmartBus', from: 'Hyderabad', to: 'Bangalore', date: '2025-01-18', time: '22:30', fare: 800, total_seats: 36, available_seats: 30, women_seats: [1, 2, 9, 10] },
  { bus_id: 'TS07UV1234', bus_name: 'TSRTC Garuda Plus', from: 'Hyderabad', to: 'Bangalore', date: '2025-01-18', time: '20:00', fare: 700, total_seats: 45, available_seats: 40, women_seats: [1, 2, 3, 4] },
  
  // Pune - Mumbai Route (Return)
  { bus_id: 'MH12WX5678', bus_name: 'Shivneri AC Sleeper', from: 'Pune', to: 'Mumbai', date: '2025-01-19', time: '07:00', fare: 550, total_seats: 40, available_seats: 36, women_seats: [1, 2, 5, 6] },
  { bus_id: 'MH14YZ9012', bus_name: 'VRL Volvo B11R', from: 'Pune', to: 'Mumbai', date: '2025-01-19', time: '23:00', fare: 750, total_seats: 36, available_seats: 32, women_seats: [1, 2, 9, 10] },
  
  // Chennai - Bangalore Route (Return)
  { bus_id: 'TN01AA3456', bus_name: 'Parveen Travels AC', from: 'Chennai', to: 'Bangalore', date: '2025-01-20', time: '22:00', fare: 850, total_seats: 40, available_seats: 35, women_seats: [1, 2, 5, 6] },
  { bus_id: 'KA09BB7890', bus_name: 'VRL Travels Volvo', from: 'Chennai', to: 'Bangalore', date: '2025-01-20', time: '23:30', fare: 900, total_seats: 45, available_seats: 38, women_seats: [1, 2, 3, 4] },
  
  // Additional Popular Routes
  { bus_id: 'MH02CC1234', bus_name: 'RedBus Primo Volvo', from: 'Mumbai', to: 'Goa', date: '2025-01-21', time: '20:00', fare: 1200, total_seats: 36, available_seats: 28, women_seats: [1, 2, 5, 6, 9, 10] },
  { bus_id: 'KA05DD5678', bus_name: 'KSRTC Airavat Club Class', from: 'Bangalore', to: 'Mysore', date: '2025-01-21', time: '08:00', fare: 400, total_seats: 50, available_seats: 45, women_seats: [1, 2, 3, 4] },
  { bus_id: 'DL03EE9012', bus_name: 'Manali Volvo Service', from: 'Delhi', to: 'Manali', date: '2025-01-22', time: '18:00', fare: 1500, total_seats: 40, available_seats: 32, women_seats: [1, 2, 5, 6] },
  { bus_id: 'RJ14FF3456', bus_name: 'RSRTC Gold Line', from: 'Jaipur', to: 'Delhi', date: '2025-01-22', time: '22:00', fare: 650, total_seats: 45, available_seats: 40, women_seats: [1, 2, 3, 4] },
  { bus_id: 'GJ01GG7890', bus_name: 'Gujarat Travels Volvo', from: 'Ahmedabad', to: 'Mumbai', date: '2025-01-23', time: '21:00', fare: 900, total_seats: 40, available_seats: 35, women_seats: [1, 2, 5, 6] },
  {
    bus_id: 'BLR01',
    bus_name: 'Chennai Express',
    from: 'Bangalore',
    to: 'Chennai',
    date: '2025-10-02',
    time: '07:00',
    seats_total: 40,
    available_seats: 40,
    fare: 600
  },
  {
    bus_id: 'BLR02',
    bus_name: 'Hyderabad Super',
    from: 'Bangalore',
    to: 'Hyderabad',
    date: '2025-10-02',
    time: '10:00',
    seats_total: 40,
    available_seats: 40,
    fare: 700
  },
  {
    bus_id: 'HYD01',
    bus_name: 'Mumbai Express',
    from: 'Hyderabad',
    to: 'Mumbai',
    date: '2025-10-02',
    time: '16:00',
    seats_total: 40,
    available_seats: 40,
    fare: 900
  },
  {
    bus_id: 'CHN01',
    bus_name: 'Bangalore Volvo',
    from: 'Chennai',
    to: 'Bangalore',
    date: '2025-10-02',
    time: '20:00',
    seats_total: 36,
    available_seats: 36,
    fare: 650
  }
];

async function seedBuses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing buses
    await Bus.deleteMany({});
    console.log('Cleared existing buses');

    // Insert sample buses
    await Bus.insertMany(buses);
    console.log(`✅ Successfully added ${buses.length} buses to the database!`);

    console.log('\nSample routes added:');
    console.log('- Mumbai → Pune (4 buses)');
    console.log('- Delhi → Bangalore (2 buses)');
    console.log('- Bangalore → Chennai (1 bus)');
    console.log('- Bangalore → Hyderabad (1 bus)');
    console.log('- Hyderabad → Mumbai (1 bus)');
    console.log('- Chennai → Bangalore (1 bus)');

    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now search for buses on http://localhost:3000');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedBuses();
