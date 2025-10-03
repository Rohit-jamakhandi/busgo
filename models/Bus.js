const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema(
  {
    bus_id: { type: String, required: true, unique: true },
    bus_name: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    seats_total: { type: Number, required: true, default: 40 },
    available_seats: { type: Number, required: true },
    fare: { type: Number, required: true },
    women_seats: { type: [Number], default: [] }, // Array of seat numbers reserved for women
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bus', BusSchema);
