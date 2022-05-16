const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  text: { type: String },
  solved: { type: String },
});

const Support = mongoose.model('Support', supportSchema);
module.exports = Support;
