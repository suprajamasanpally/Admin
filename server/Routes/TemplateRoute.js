const express = require('express');
const router = express.Router();
const TemplateModel = require('../Models/Template');

// Get the latest version of each template
router.get('/templates', async (req, res) => {
  try {
    const templates = await TemplateModel.find().sort({ updatedAt: -1 });

    const latestTemplates = {};
    templates.forEach(template => {
      if (!latestTemplates[template.name] || template.updatedAt > latestTemplates[template.name].updatedAt) {
        latestTemplates[template.name] = template;
      }
    });

    res.json(Object.values(latestTemplates));
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Creates a new template version
router.post('/templates', async (req, res) => {
  const { name, content } = req.body;

  try {
    const newTemplate = new TemplateModel({ name, content });
    await newTemplate.save();
    console.log(`Template created: ${name}, Version: ${newTemplate.version}`); // Log the version
    res.status(201).json({ status: 'Success', message: 'Template added successfully', template: newTemplate });
  } catch (error) {
    console.error('Error adding template:', error);
    res.status(500).json({ status: 'Error', message: 'Internal Server Error', error: error.message });
  }
});


// Update a template by ID
router.put('/templates/:id', async (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;

  try {
    const updatedTemplate = await TemplateModel.findById(id);
    if (updatedTemplate) {
      updatedTemplate.name = name;
      updatedTemplate.content = content; // Update content
      await updatedTemplate.save();
      console.log(`Template updated: ${updatedTemplate.name}, Version: ${updatedTemplate.version}`); // Log the version
      res.json({ status: 'Success', updatedTemplate });
    } else {
      res.status(404).json({ error: 'Template not found' });
    }
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete a template by ID
router.delete('/templates/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTemplate = await TemplateModel.findByIdAndDelete(id);
    if (deletedTemplate) {
      console.log(`Template deleted: ${deletedTemplate.name}, Version: ${deletedTemplate.version}`); // Log the version
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
