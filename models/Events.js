const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventname: { type: String, required: true },
  count: { type: Number, required: true },
  invitations: [{ type: mongoose.Types.ObjectId, ref: 'invitations' }],
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
