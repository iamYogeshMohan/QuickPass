const express = require('express');
const jwt = require('jsonwebtoken');
const Visitor = require('../models/Visitor');
const User = require('../models/User');
const { auth, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Create Visitor Pass (Only Hosts and Admin can do this)
router.post('/create', auth, restrictTo('host', 'admin'), async (req, res) => {
  try {
    const { visitorName, phone, purpose, validFrom, validTo } = req.body;
    
    // Create new visitor passing the host's ID
    const visitor = new Visitor({
      visitorName,
      phone,
      purpose,
      hostId: req.user._id,
      validFrom,
      validTo,
      qrToken: 'temp' // Will update below
    });

    await visitor.save();

    // Create secure QR Token encrypted with JWT
    const qrToken = jwt.sign(
      { visitorId: visitor._id, validTo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // maximum time to live, actual check is validTo
    );

    visitor.qrToken = qrToken;
    await visitor.save();

    res.status(201).json({ visitor, qrToken });
  } catch (error) {
    res.status(500).json({ error: 'Server error while creating pass' });
  }
});

// Get Visitor details for the public page (No auth required)
router.get('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('hostId', 'name email');
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get visitors created by host
router.get('/host/me', auth, restrictTo('host', 'admin'), async (req, res) => {
  try {
    const visitors = await Visitor.find({ hostId: req.user._id }).sort({ createdAt: -1 });
    res.json(visitors);
  } catch(error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
