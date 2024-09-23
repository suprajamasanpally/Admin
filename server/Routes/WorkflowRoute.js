const express = require('express');
const router = express.Router();
const WorkflowModel = require('../Models/Workflow');
const EmployeeModel = require('../Models/Employee');
const { requireSuperAdmin, authenticate } = require('../middlewares/auth');

// Fetch the latest workflow version
router.get('/workflow', authenticate, async (req, res) => {
  try {
    const workflow = await WorkflowModel.findOne().sort({ updatedAt: -1 }); // Get the latest version
    if (!workflow) {
      return res.status(404).json({ error: 'No workflow found' });
    }
    res.status(200).json(workflow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

// Save or update the workflow order, triggering version increment
router.post('/workflow', requireSuperAdmin, async (req, res) => {
  try {
    const { order } = req.body;
    let workflow = await WorkflowModel.findOne();

    if (workflow) {
      // If workflow exists, update it
      workflow.order = order;
    } else {
      // If no workflow exists, create a new one
      workflow = new WorkflowModel({ order });
    }

    // Save the workflow, pre-save hook will increment the version
    await workflow.save();
    
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
