const router = require('express').Router();
const Candidate = require('../models/Candidate');
const Batch = require('../models/Batch');

router.get('/', async (req, res) => {
  try {
    const total = await Candidate.countDocuments();
    const certified = await Candidate.countDocuments({ certificateStatus: 'issued' });
    const placed = await Candidate.countDocuments({ isPlaced: true });
    const incentive = await Candidate.countDocuments({ hasIncentive: true });
    const totalIncentiveAmount = await Candidate.aggregate([
      { $match: { hasIncentive: true } },
      { $group: { _id: null, total: { $sum: '$totalIncentiveAmount' } } }
    ]);

    // Batch categorization
    const now = new Date();
    const activeBatches = await Batch.countDocuments({ 
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: 'active'
    });
    const completedBatches = await Batch.countDocuments({ status: 'completed' });
    const upcomingBatches = await Batch.countDocuments({ 
      startDate: { $gt: now }
    });

    res.json({
      total, 
      certified, 
      placed, 
      incentive,
      totalIncentiveAmount: totalIncentiveAmount[0]?.total || 0,
      batches: {
        active: activeBatches,
        completed: completedBatches,
        upcoming: upcomingBatches,
        total: activeBatches + completedBatches + upcomingBatches
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;