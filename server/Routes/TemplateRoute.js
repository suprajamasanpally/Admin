const express = require('express');
const router = express.Router();
const TemplateModel = require('../Models/Template');

//get all templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await TemplateModel.find();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new template
router.post('/templates', async (req, res) => {
  const { name, content } = req.body;

  try {
    const newTemplate = new TemplateModel({ name, content });
    await newTemplate.save();
    res.status(201).json({ status: 'Success', message: 'Template added successfully', template: newTemplate });
  } catch (error) {
    console.error('Error adding template:', error);
    res.status(500).json({ status: 'Error', message: 'Internal Server Error', error: error.message });
  }
});

// Update an existing template
router.put('/templates/:id', async (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;

  try {
    const updatedTemplate = await TemplateModel.findByIdAndUpdate(
      id,
      { name, content },
      { new: true }
    );
    if (updatedTemplate) {
      res.json({ status: 'Success', updatedTemplate });
    } else {
      res.status(404).json({ error: 'Template not found' });
    }
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a template
router.delete('/templates/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTemplate = await TemplateModel.findByIdAndDelete(id);
    if (deletedTemplate) {
      res.json({ status: 'Success', message: 'Template deleted successfully' });
    } else {
      res.status(404).json({ error: 'Template not found' });
    }
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;