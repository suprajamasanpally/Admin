const express = require("express");
const router = express.Router();
const Field = require("../Models/Field");

// Create a new field
router.post("/:page", async (req, res) => {
  try {
    const newField = new Field({
      ...req.body,
      page: req.params.page,
    });
    const field = await newField.save();
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
    const field = await Field.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(field);
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
