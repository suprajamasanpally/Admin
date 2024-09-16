const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['User', 'SuperAdmin'], // Ensure these values match exactly
    required: true
  }
});

const EmployeeModel = mongoose.model('Employee', employeeSchema);

module.exports = EmployeeModel;
