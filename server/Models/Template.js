const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // For more flexibility in content
    required: true,
  },
});

const TemplateModel = mongoose.model('Template', TemplateSchema);
module.exports = TemplateModel;
