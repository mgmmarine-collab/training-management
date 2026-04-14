const router = require('express').Router();
const Candidate = require('../models/Candidate');

router.get('/', async (req, res) => {
  const { batchId, isPlaced, certificateStatus, hasIncentive } = req.query;
  const filter = {};
  if (batchId) filter.batchId = batchId;
  if (isPlaced !== undefined) filter.isPlaced = isPlaced === 'true';
  if (certificateStatus) filter.certificateStatus = certificateStatus;
  if (hasIncentive !== undefined) filter.hasIncentive = hasIncentive === 'true';
  const candidates = await Candidate.find(filter).populate('batchId').populate('courseId');
  res.json(candidates);
});

router.post('/', async (req, res) => {
  try {
    // Remove empty string values to prevent validation errors
    const data = { ...req.body };
    
    // Clean up empty ObjectId fields
    if (data.courseId === '' || data.courseId === null) {
      delete data.courseId;
    }
    if (data.batchId === '' || data.batchId === null) {
      delete data.batchId;
    }
    
    // Validate required fields
    if (!data.name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const candidate = new Candidate(data);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Clean up empty ObjectId fields
    if (data.courseId === '' || data.courseId === null) {
      delete data.courseId;
    }
    if (data.batchId === '' || data.batchId === null) {
      delete data.batchId;
    }
    
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, data, { new: true }).populate('batchId').populate('courseId');
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const candidate = await Candidate.findById(req.params.id).populate('batchId').populate('courseId');
  res.json(candidate);
});

module.exports = router;