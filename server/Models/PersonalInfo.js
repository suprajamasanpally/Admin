const mongoose = require('mongoose');

const PersonalInfoSchema = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    phoneType: String,
    phoneNumber: String,
    addressType: String,
    address: String,
    age: Number,
    maritalStatus: String
});

const PersonalInfoModel = mongoose.model('personalinfos', PersonalInfoSchema);
module.exports=PersonalInfoModel;