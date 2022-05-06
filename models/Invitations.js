const mongoose = require('mongoose');

const invitationsSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  limit: { type: String, required: true },
  name: { type: String, required: true },
  events: [
    {
      name: String,
      count: String,
    },
  ],
});

const Invitations = mongoose.model('Invitations', invitationsSchema);
module.exports = Invitations;
