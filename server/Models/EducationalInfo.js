const mongoose = require('mongoose');

const EducationalInfoSchema = new mongoose.Schema({
  email: { type: String, required: true},
  highestQualification: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  university: { type: String, required: true },
  gpa: { type: Number, required: true },
  completionDate: { type: Date, required: true },
  tenthSchoolName:{ type: String, require: true },
  tenthMarks: { type: Number, require: true },
  tenthPoY: { type: Date, require: true },
  interCollegeName: { type: String, require: true },
  interMarks: { type: Number, require: true },
  interPoY: { type: Date, require: true },
  certifications: [
    {
      name: String,
      date: Date,
    },
  ],
});

const EducationalInfoModel = mongoose.model('EducationalInfo', EducationalInfoSchema);
module.exports = EducationalInfoModel;
