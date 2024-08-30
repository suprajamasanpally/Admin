const express = require('express');
const router = express.Router();
const WorkflowModel = require('../Models/Workflow');

// Get workflow order
router.get('/workflow', async (req, res) => {
  try {
    const workflow = await WorkflowModel.findOne();
    res.status(200).json(workflow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});
// Save or update workflow order
router.post('/workflow', async (req, res) => {
  try {
    const { order } = req.body;
    const workflow = await WorkflowModel.findOneAndUpdate({}, { order }, { new: true, upsert: true });
    res.status(200).json(workflow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

module.exports = router;