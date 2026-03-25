const express = require('express');
const Log = require('../models/Log');
const { auth, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes here are admin only
router.use(auth, restrictTo('admin'));

// Fetch all logs with populated visitor, host, and guard information
router.get('/logs', async (req, res) => {
  try {
    // Basic filtering hookup setup
    const { status, date, hostId } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    // Add simple date filtering for today if date='today'
    if (date === 'today') {
      const start = new Date();
      start.setHours(0,0,0,0);
      const end = new Date();
      end.setHours(23,59,59,999);
      query.entryTime = { $gte: start, $lte: end };
    }

    const logs = await Log.find(query)
      .populate({
        path: 'visitorId',
        select: 'visitorName phone purpose hostId',
        populate: {
          path: 'hostId',
          select: 'name email'
        }
      })
      .populate('guardId', 'name')
      .sort({ createdAt: -1 });

    // Filter by hostId post-populate if requested
    let filteredLogs = logs;
    if (hostId) {
      filteredLogs = logs.filter(log => log.visitorId && log.visitorId.hostId && log.visitorId.hostId._id.toString() === hostId);
    }

    // Analytics Calculation
    const totalVisitors = filteredLogs.length;
    const activeVisitors = filteredLogs.filter(l => l.status === 'active').length;
    const completedVisitors = filteredLogs.filter(l => l.status === 'completed').length;

    res.status(200).json({
      analytics: {
        totalVisitors,
        activeVisitors,
        completedVisitors
      },
      logs: filteredLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching logs' });
  }
});

module.exports = router;
