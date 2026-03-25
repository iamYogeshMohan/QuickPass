const express = require('express');
const jwt = require('jsonwebtoken');
const Visitor = require('../models/Visitor');
const Log = require('../models/Log');
const { auth, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Middleware to secure endpoints for security guards only
router.use(auth, restrictTo('security', 'admin'));

// Validate QR Token
router.post('/validate', async (req, res) => {
  try {
    const { qrToken } = req.body;
    if (!qrToken) return res.status(400).json({ error: 'QR Token is required', status: 'invalid' });

    let decoded;
    try {
      decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
    } catch(err) {
      return res.status(400).json({ error: 'Invalid or forged QR Code', status: 'invalid' });
    }

    const visitor = await Visitor.findById(decoded.visitorId).populate('hostId', 'name');
    if (!visitor) return res.status(404).json({ error: 'Visitor not found', status: 'invalid' });

    const now = new Date();
    if (now < new Date(visitor.validFrom)) {
      return res.json({ visitor, isValid: false, reason: 'Pass is not active yet (too early)', status: 'invalid' });
    }
    if (now > new Date(visitor.validTo)) {
      return res.json({ visitor, isValid: false, reason: 'Pass has expired', status: 'expired' });
    }

    // Check if visitor has already exited (completed visit)
    const existingLog = await Log.findOne({ visitorId: visitor._id, status: 'completed' });
    if (existingLog) {
      return res.json({ visitor, isValid: false, reason: 'Pass already used', status: 'expired' });
    }

    // Valid pass
    res.json({ visitor, isValid: true, status: 'valid' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during validation', status: 'error' });
  }
});

// Mark Entry
router.post('/entry', async (req, res) => {
  try {
    const { visitorId } = req.body;
    
    // Check if there is an active log already
    const existingLog = await Log.findOne({ visitorId, status: 'active' });
    if (existingLog) return res.status(400).json({ error: 'Visitor is already marked as entered' });

    const log = new Log({
      visitorId,
      guardId: req.user._id,
      entryTime: new Date(),
      status: 'active'
    });

    await log.save();
    res.status(201).json({ message: 'Entry recorded successfully', log });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark Exit
router.post('/exit', async (req, res) => {
  try {
    const { visitorId } = req.body;

    const log = await Log.findOne({ visitorId, status: 'active' });
    if (!log) return res.status(400).json({ error: 'No active entry found for this visitor' });

    log.exitTime = new Date();
    log.status = 'completed';
    await log.save();

    res.status(200).json({ message: 'Exit recorded successfully', log });
  } catch(error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
