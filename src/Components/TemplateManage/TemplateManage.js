import React, { useState } from "react";
import axios from "axios";
import { themes } from "../../themes";
import { useNavigate } from "react-router-dom";
import "./TemplateManage.css";

const TemplateManage = () => {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const handleApplyTheme = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
      setMessage('Authentication required');
      return;
    }
    try {
      await axios.post(
        'http://localhost:3001/api/themes',
        { theme: selectedTheme },
        {
          headers: {
            Authorization: `Bearer ${token}` // Add token to the request header
          }
        }
      );
      localStorage.setItem('theme', selectedTheme);
      setMessage('Theme applied successfully');
      navigate("/superadmin-dashboard");
    } catch (error) {
      console.error('Error applying theme:', error);
      setMessage('Error applying theme');
    }
  };
  
  return (
    <div className="template-management">
      <h2>Template Management</h2>
      <div className="themes">
        {Object.keys(themes).map((key) => (
          <button
            key={key}
            onClick={() => handleThemeChange(key)}
            className={`theme-button ${key}`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
      <button onClick={handleApplyTheme}>Apply Theme</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default TemplateManage;
