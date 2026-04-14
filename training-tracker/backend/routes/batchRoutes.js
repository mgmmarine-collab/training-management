const router = require('express').Router();
const Batch = require('../models/Batch');

router.get('/', async (req, res) => {
  const batches = await Batch.find().populate('courseId');
  res.json(batches);
});

router.post('/', async (req, res) => {
  const batch = new Batch(req.body);
  await batch.save();
  res.status(201).json(batch);
});

router.put('/:id', async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(batch);
});

router.get('/:id', async (req, res) => {
  const batch = await Batch.findById(req.params.id).populate('courseId');
  res.json(batch);
});

router.delete('/:id', async (req, res) => {
  await Batch.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;