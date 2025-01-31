const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  page: { 
    type: String, 
    enum: ['PersonalInfo', 'EducationalInfo', 'ProfessionalInfo'], 
    required: true 
  },
  fieldName: { type: String, required: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'number', 'date', 'select', 'checkbox', 'textarea'], 
    required: true 
  },
  required: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  options: {
    type: [String], 
    default: [] 
  },
  version: { 
    type: String, 
    default: "1.0.0"  // Set default version to 1.0.0 for newly created fields
  }
});

module.exports = mongoose.model('Field', fieldSchema);
