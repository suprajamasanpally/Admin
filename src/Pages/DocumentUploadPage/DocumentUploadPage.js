import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./DocumentUploadPage.css";

const DocumentUploadPage = () => {
  const [documents, setDocuments] = useState({
    identification: { type: "", file: null },
    birthCertificate: { type: "", file: null },
    addressVerification: { type: "", file: null },
    educationalCredentials: { type: "", file: null },
    resume: null,
  });

const navigate = useNavigate();
const location = useLocation();
const { email, workflow } = location.state || {}; 

const currentPageId = '4'; 

if (!workflow || workflow.length === 0) {
return <p>No workflow defined.</p>;
}

const currentPageIndex = workflow.indexOf(currentPageId);

const handleFileChange = (field, file) => {
setDocuments({ ...documents, [field]: { ...documents[field], file } });
};

const handleTypeChange = (field, type) => {
setDocuments({ ...documents, [field]: { ...documents[field], type } });
};

const handleResumeChange = (file) => {
setDocuments({ ...documents, resume: file });
};

const handleSave = (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('email', email);  
  for (const [key, value] of Object.entries(documents)) {
    if (key === "resume") {
      formData.append(key, value);
    } else {
      formData.append(`${key}[type]`, value.type);
      if (value.file) {
        formData.append(`${key}[file]`, value.file);
      }
    }
  }

  axios
    .post("http://localhost:3001/documents-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(() => {
      const nextPageIndex = currentPageIndex + 1;
      const nextPageId = workflow[nextPageIndex];

      if (nextPageId) {
        navigate(`/page-${nextPageId}`, { state: { email, workflow } });
      } else {
        navigate('/thank-you', { state: { email } });
      }
    })
    .catch((err) => {
      console.error("Error uploading documents:", err);
    });
};



  return (
    <div className="document-upload-container">
      <h1 className="document-upload-title">Document Upload</h1>
      <form className="document-upload-form" onSubmit={handleSave}>
        <div className="document-upload-row">
          <div className="document-upload-column">
            <label className="document-upload-input-label">Identification Documents</label>
            <select
              className="document-upload-select-field"
              value={documents.identification.type}
              onChange={(e) =>
                handleTypeChange("identification", e.target.value)
              }
            >
              <option value="">Select type</option>
              <option value="pancard">PAN Card</option>
              <option value="passport">Passport</option>
              <option value="driversLicense">Driver's License</option>
            </select>
            <input
              type="file"
              className="document-upload-input-field"
              onChange={(e) =>
                handleFileChange("identification", e.target.files[0])
              }
            />
          </div>
          <div className="document-upload-column">
            <label className="document-upload-input-label">Proof of Age</label>
            <select
              className="document-upload-select-field"
              value={documents.birthCertificate.type}
              onChange={(e) =>
                handleTypeChange("birthCertificate", e.target.value)
              }
            >
              <option value="">Select type</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="birthCertificate">Birth Certificate</option>
            </select>
            <input
              type="file"
              className="document-upload-input-field"
              onChange={(e) =>
                handleFileChange("birthCertificate", e.target.files[0])
              }
            />
          </div>
        </div>
        <div className="document-upload-row">
          <div className="document-upload-column">
            <label className="document-upload-input-label">Address Verification Documents</label>
            <select
              className="document-upload-select-field"
              value={documents.addressVerification.type}
              onChange={(e) =>
                handleTypeChange("addressVerification", e.target.value)
              }
            >
              <option value="">Select type</option>
              <option value="utilityBills">Utility Bills</option>
              <option value="bankStatements">Bank Statements</option>
            </select>
            <input
              type="file"
              className="document-upload-input-field"
              onChange={(e) =>
                handleFileChange("addressVerification", e.target.files[0])
              }
            />
          </div>
          <div className="document-upload-column">
            <label className="document-upload-input-label">Educational Credentials</label>
            <select
              className="document-upload-select-field"
              value={documents.educationalCredentials.type}
              onChange={(e) =>
                handleTypeChange("educationalCredentials", e.target.value)
              }
            >
              <option value="">Select type</option>
              <option value="academicTranscripts">Academic Transcripts</option>
              <option value="diplomas">Diplomas</option>
            </select>
            <input
              type="file"
              className="document-upload-input-field"
              onChange={(e) =>
                handleFileChange("educationalCredentials", e.target.files[0])
              }
            />
          </div>
        </div>
        <div className="document-upload-row">
          <div className="document-upload-column">
            <label className="document-upload-input-label">Resume</label>
            <input
              type="file"
              className="document-upload-input-field"
              onChange={(e) => handleResumeChange(e.target.files[0])}
            />
          </div>
        </div>
        <div className="btn-container">
          <button type="submit" className="document-upload-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUploadPage;
