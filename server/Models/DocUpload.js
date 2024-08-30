const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    file: { type: String, required: true }
});

const DocumentUploadSchema = new mongoose.Schema({
    email: { type: String, required: true },
    documents: {
        identification: DocumentSchema,
        birthCertificate: DocumentSchema,
        addressVerification: DocumentSchema,
        educationalCredentials: DocumentSchema,
        resume: { type: String }
    }
});

const DocumentUploadModel = mongoose.model('DocumentUpload', DocumentUploadSchema);
module.exports = DocumentUploadModel;
