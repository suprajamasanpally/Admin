const express = require("express");
const router = express.Router();
const Field = require("../Models/Field");
const Workflow = require("../Models/Workflow");

// Create a new field
router.post("/:page", async (req, res) => {
  try {
    const latestWorkflow = await Workflow.findOne().sort({ createdAt: -1 });
    const version = latestWorkflow ? latestWorkflow.version : '1.0.0';

    const newField = new Field({
      ...req.body,
      page: req.params.page,
      version,  // Attach current version
    });
    
    const field = await newField.save();
    console.log('Saved field:', field);
    res.status(201).json(field);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all fields for a specific page
router.get("/:page", async (req, res) => {
  try {
    const fields = await Field.find({ page: req.params.page }).sort("order");
    res.json(fields);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a field
router.put("/:id", async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    
    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }
    
    // Increment the version (assume it's a simple version bump here)
    const versionParts = field.version.split('.');
    versionParts[2] = (parseInt(versionParts[2], 10) + 1).toString();  // Patch version increment
    const newVersion = versionParts.join('.');
    
    field.set({
      ...req.body,
      version: newVersion  // Update the version
    });
    
    const updatedField = await field.save();
    console.log('Updated field:', updatedField);
    res.json(updatedField);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Delete a field
router.delete("/:id", async (req, res) => {
  try {
    await Field.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
