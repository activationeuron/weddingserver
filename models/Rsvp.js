const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  plus: { type: Boolean },
  email: { type: String },
  plusName: { type: String },
});

const Rsvp = mongoose.model('Rsvp', rsvpSchema);
module.exports = Rsvp;
