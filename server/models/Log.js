const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
  entryTime: { type: Date },
  exitTime: { type: Date },
  guardId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'completed', 'expired'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);
