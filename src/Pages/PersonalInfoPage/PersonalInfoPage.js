import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./PersonalInfoPage.css";

const PersonalInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, workflow } = location.state || {};
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `http://localhost:3001/api/fields/PersonalInfo`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setFields(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fields:", error);
        setError("Failed to load form fields. Please try again later.");
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  if (!workflow || workflow.length === 0) {
    return <div>Workflow not provided.</div>;
  }

  const currentPageId = "1"; 
  const currentPageIndex = workflow.indexOf(currentPageId);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');

      await axios.post(
        "http://localhost:3001/api/personal-info",
        {
          email,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const nextPageIndex = currentPageIndex + 1;
      const nextPageId = workflow[nextPageIndex];
      if (nextPageId) {
        navigate(`/page-${nextPageId}`, { state: { email, workflow } });
      } else {
        navigate("/thank-you", { state: { email } });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save data. Please try again later.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="personal-info-container">
      <h1 className="personal-info-title">Personal Information</h1>
      {error && <div className="personal-info-error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="personal-info-form">
        {fields.map((field) => (
          <div className="personal-info-row" key={field._id}>
            <div className="personal-info-column">
              <label className="personal-info-input-label">{field.label}</label>
              {field.type === "text" && (
                <input
                  type="text"
                  placeholder={`Enter your ${field.label}`}
                  className="personal-info-input-field"
                  value={formData[field.fieldName] || ""}
                  onChange={(e) =>
                    handleInputChange(field.fieldName, e.target.value)
                  }
                />
              )}
              {field.type === "number" && (
                <input
                  type="number"
                  placeholder={`Enter your ${field.label}`}
                  className="personal-info-input-field"
                  value={formData[field.fieldName] || ""}
                  onChange={(e) =>
                    handleInputChange(field.fieldName, e.target.value)
                  }
                />
              )}
              {field.type === "date" && (
                <input
                  type="date"
                  className="personal-info-input-field"
                  value={formData[field.fieldName] || ""}
                  onChange={(e) =>
                    handleInputChange(field.fieldName, e.target.value)
                  }
                />
              )}
              {field.type === "select" && (
                <select
                  className="personal-info-input-field"
                  value={formData[field.fieldName] || ""}
                  onChange={(e) =>
                    handleInputChange(field.fieldName, e.target.value)
                  }
                >
                  <option value="">Select {field.label}</option>
                  {field.options &&
                    field.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              )}
              {field.type === "checkbox" && (
                <label className="personal-info-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData[field.fieldName] || false}
                    onChange={(e) =>
                      handleInputChange(field.fieldName, e.target.checked)
                    }
                    className="personal-info-checkbox"
                  />
                  {field.label}
                </label>
              )}
            </div>
          </div>
        ))}
        <div className="personal-info-btn-container">
          <button className="personal-info-btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoPage;
