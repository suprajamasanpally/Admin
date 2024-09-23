const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  version: {
    type: Number,
    default: 1, // Initial version number
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Increment the version number before saving
TemplateSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.version += 1; // Increment version number
    this.updatedAt = Date.now();
  }
  next();
});

const TemplateModel = mongoose.model('Template', TemplateSchema);
module.exports = TemplateModel;
