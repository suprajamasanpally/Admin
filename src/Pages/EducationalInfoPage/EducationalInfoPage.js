import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./EducationalInfoPage.css";

const EducationalInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, workflow } = location.state || {};
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [educationalInfo, setEducationalInfo] = useState({});
  const [certifications, setCertifications] = useState([]);
  const currentPageId = "2";
  const currentPageIndex = workflow ? workflow.indexOf(currentPageId) : -1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `http://localhost:3001/api/educational-info/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setFields(response.data.fields);

        const formattedEducationalInfo = response.data.userInfo?.fields || {};
        Object.keys(formattedEducationalInfo).forEach((key) => {
          if (key.toLowerCase().includes("date")) {
            formattedEducationalInfo[key] = formatDateString(
              formattedEducationalInfo[key]
            );
          }
        });

        setEducationalInfo(formattedEducationalInfo);

        const formattedCertifications =
          response.data.userInfo?.certifications || [];
        formattedCertifications.forEach((certification) => {
          if (certification.date) {
            certification.date = formatDateString(certification.date);
          }
        });

        setCertifications(formattedCertifications);
      } catch (error) {
        console.error("Error fetching educational info:", error);
        setError("Failed to load educational info. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);

  const formatDateString = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
  };

  const handleChange = (fieldName, value) => {
    setEducationalInfo({ ...educationalInfo, [fieldName]: value });
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = certifications.map((certification, certIndex) => {
      if (index === certIndex) {
        return { ...certification, [field]: value };
      }
      return certification;
    });
    setCertifications(newCertifications);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: "", date: "" }]);
  };

  const removeCertification = (index) => {
    setCertifications(
      certifications.filter((_, certIndex) => certIndex !== index)
    );
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');

      const dataToSave = { ...educationalInfo, certifications };
      await axios.post(
        `http://localhost:3001/api/educational-info/${email}`,
        dataToSave,
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
    } catch (error) {
      console.error("Error saving educational info:", error);
      setError("Failed to save educational info. Please try again later.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="edu-info-container">
      <h1 className="edu-info-title">Educational Information</h1>
      <form onSubmit={handleSave} className="edu-info-form">
        {fields.map((field) => (
          <div key={field._id} className="edu-info-row">
            <label className="edu-info-input-label">{field.label}</label>
            {field.type === "text" && (
              <input
                type="text"
                placeholder={`Enter your ${field.label}`}
                className="edu-info-input-field"
                value={educationalInfo[field.fieldName] || ""}
                onChange={(e) => handleChange(field.fieldName, e.target.value)}
              />
            )}
            {field.type === "number" && (
              <input
                type="number"
                placeholder={`Enter your ${field.label}`}
                className="edu-info-input-field"
                value={educationalInfo[field.fieldName] || ""}
                onChange={(e) => handleChange(field.fieldName, e.target.value)}
              />
            )}
            {field.type === "date" && (
              <input
                type="date"
                className="edu-info-input-field"
                value={educationalInfo[field.fieldName] || ""}
                onChange={(e) => handleChange(field.fieldName, e.target.value)}
              />
            )}
            {field.type === "select" && (
              <select
                className="edu-info-input-field"
                value={educationalInfo[field.fieldName] || ""}
                onChange={(e) => handleChange(field.fieldName, e.target.value)}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {field.type === "checkbox" && (
              <input
                type="checkbox"
                className="edu-info-checkbox"
                checked={educationalInfo[field.fieldName] || false}
                onChange={(e) =>
                  handleChange(field.fieldName, e.target.checked)
                }
              />
            )}
          </div>
        ))}

        <div className="edu-info-certifications-section">
          <h2 className="edu-info-certifications-title">Certifications</h2>
          {certifications.map((certification, index) => (
            <div key={index} className="edu-info-certification-row">
              <div className="edu-info-certification-field">
                <label className="edu-info-certification-label">
                  Certification Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Certification Name"
                  value={certification.name}
                  onChange={(e) =>
                    handleCertificationChange(index, "name", e.target.value)
                  }
                  className="edu-info-input-field"
                />
              </div>
              <div className="edu-info-certification-field">
                <label className="edu-info-certification-label">
                  Certification is valid up to:
                </label>
                <input
                  type="date"
                  placeholder="Enter Certification Date"
                  value={certification.date}
                  onChange={(e) =>
                    handleCertificationChange(index, "date", e.target.value)
                  }
                  className="edu-info-input-field"
                />
              </div>
              <button
                type="button"
                className="edu-info-btn-remove"
                onClick={() => removeCertification(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="edu-info-btn-add"
            onClick={addCertification}
          >
            Add Certification
          </button>
        </div>

        <button type="submit" className="edu-info-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export default EducationalInfoPage;
