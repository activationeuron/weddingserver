const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  adults: { type: Number, required: true },
  kids: { type: Number, required: true },
});

const Rsvp = mongoose.model('Rsvp', rsvpSchema);
module.exports = Rsvp;
