const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  employmentType: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  jobTitle: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  domain: { type: String, required: true },
});

const ProfessionalInfoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  experiences: [ExperienceSchema], // Array of experiences
});

const ProfessionalInfoModel = mongoose.model('ProfessionalInfo', ProfessionalInfoSchema);
module.exports = ProfessionalInfoModel;
