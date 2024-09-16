import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ProfessionalInfoPage.css";

const ProfessionalInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, workflow } = location.state || {};
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [professionalInfo, setProfessionalInfo] = useState({ experiences: [] });
  const currentPageId = "3";
  const currentPageIndex = workflow ? workflow.indexOf(currentPageId) : -1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from localStorage or wherever you store it
        const token = localStorage.getItem('token');
  
        const response = await axios.get(
          `http://localhost:3001/api/professional-info/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
  
        setFields(response.data.fields);
  
        const formattedProfessionalInfo =
          response.data.userInfo?.experiences || [];
        formattedProfessionalInfo.forEach((exp) => {
          Object.keys(exp).forEach((key) => {
            if (key.toLowerCase().includes("date")) {
              exp[key] = formatDateString(exp[key]);
            }
          });
        });
  
        setProfessionalInfo({ experiences: formattedProfessionalInfo });
      } catch (error) {
        console.error("Error fetching professional info:", error);
        setError("Failed to load professional info. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);
  
  const formatDateString = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
  };

  const handleChange = (index, fieldName, value) => {
    const updatedExperiences = [...professionalInfo.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [fieldName]: value,
    };
    setProfessionalInfo({ experiences: updatedExperiences });
  };

  const handleAddExperience = () => {
    setProfessionalInfo((prevState) => ({
      experiences: [...prevState.experiences, {}],
    }));
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = professionalInfo.experiences.filter(
      (_, i) => i !== index
    );
    setProfessionalInfo({ experiences: updatedExperiences });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3001/api/professional-info/${email}`,
        professionalInfo,
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
      console.error("Error saving professional info:", error);
      setError("Failed to save professional info. Please try again later.");
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pro-info-container">
      <h1 className="pro-info-title">Professional Information</h1>
      <form onSubmit={handleSave} className="pro-info-form">
        {professionalInfo.experiences.map((experience, index) => (
          <div key={index} className="pro-info-experience-section">
            <h2>Experience {index + 1}</h2>
            {fields.map((field) => (
              <div key={field._id} className="pro-info-row">
                <label className="pro-info-input-label">{field.label}</label>
                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={`Enter your ${field.label}`}
                    className="pro-info-input-field"
                    value={experience[field.fieldName] || ""}
                    onChange={(e) =>
                      handleChange(index, field.fieldName, e.target.value)
                    }
                  />
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    placeholder={`Enter your ${field.label}`}
                    className="pro-info-input-field"
                    value={experience[field.fieldName] || ""}
                    onChange={(e) =>
                      handleChange(index, field.fieldName, e.target.value)
                    }
                  />
                )}
                {field.type === "date" && (
                  <input
                    type="date"
                    className="pro-info-input-field"
                    value={experience[field.fieldName] || ""}
                    onChange={(e) =>
                      handleChange(index, field.fieldName, e.target.value)
                    }
                  />
                )}
                {field.type === "select" && (
                  <select
                    className="pro-info-input-field"
                    value={experience[field.fieldName] || ""}
                    onChange={(e) =>
                      handleChange(index, field.fieldName, e.target.value)
                    }
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === "checkbox" && (
                  <input
                    type="checkbox"
                    className="pro-info-checkbox"
                    checked={experience[field.fieldName] || false}
                    onChange={(e) =>
                      handleChange(index, field.fieldName, e.target.checked)
                    }
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    className="pro-info-input-field"
                    placeholder="Enter your roles and responsibilities"
                    value={experience[field.fieldName] || ""}
                    onChange={(e) =>
                      handleChange(index, field.fieldName, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleRemoveExperience(index)}
              className="pro-info-btn-remove"
            >
              Remove Experience
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddExperience}
          className="pro-info-btn-add"
        >
          Add Experience
        </button>
        <button type="submit" className="pro-info-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfessionalInfoPage;
