const mongoose = require('mongoose');

const WorkflowSchema = new mongoose.Schema({
  order: {
    type: [String],
    required: true,
  }
});

const WorkflowModel = mongoose.model('Workflow', WorkflowSchema);
module.exports = WorkflowModel;
