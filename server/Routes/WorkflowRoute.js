const express = require('express');
const router = express.Router();
const WorkflowModel = require('../Models/Workflow');
const EmployeeModel = require('../Models/Employee');
const { requireSuperAdmin, authenticate } = require('../middlewares/auth');

// Fetches the current workflow order
router.get('/workflow', authenticate, async (req, res) => {
  try {
    const workflow = await WorkflowModel.findOne();
    res.status(200).json(workflow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

// Saves or updates the workflow order
router.post('/workflow', requireSuperAdmin, async (req, res) => {
  try {
    const { order } = req.body;
    const workflow = await WorkflowModel.findOneAndUpdate({}, { order }, { new: true, upsert: true });
    res.status(200).json(workflow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

// Get user role
router.get('/get-role', authenticate, async (req, res) => {
  try {
    const user = await EmployeeModel.findById(req.userId); // Assuming req.userId is set after authentication
    if (user) {
      res.status(200).json(user.role);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
