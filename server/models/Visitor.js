const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  phone: { type: String, required: true },
  purpose: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qrToken: { type: String, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', VisitorSchema);
