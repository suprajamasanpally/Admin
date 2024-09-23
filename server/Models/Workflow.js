const mongoose = require('mongoose');

const WorkflowSchema = new mongoose.Schema({
  order: {
    type: [String],
    required: true,
  },
  version: {
    type: String,  // Now storing version as a string, e.g., "1.0"
    default: "1.0", // Initial version is "1.0"
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure the `version` field is updated whenever the document is modified
WorkflowSchema.pre('save', function(next) {
  if (this.isModified('order')) {
    // Split the version into major and minor
    let [major, minor] = this.version.split('.').map(Number);
    // Increment the minor version on each update
    minor += 1;

    // Update version with the new minor version
    this.version = `${major}.${minor}`;
    this.updatedAt = Date.now();
  }
  next();
});

const WorkflowModel = mongoose.model('Workflow', WorkflowSchema);
module.exports = WorkflowModel;
