import React from "react";
import { useNavigate } from "react-router-dom";
import "./SuperAdminDb.css";

const SuperAdminDb = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Get role from localStorage

  if (role !== 'SuperAdmin') {
    return <div>Access Denied</div>;
  }

  const handleNavigation = (path, page) => {
    navigate(path, { state: { page } });
  };



  return (
    <div className="s-dashboard">
      <h1>SuperAdmin Dashboard</h1>
      <button onClick={() => handleNavigation("/workflow-management")}>
        Workflow Management
      </button>
      <button onClick={() => handleNavigation("/template-management")}>
        Template Management
      </button>
      <button onClick={() => handleNavigation("/field-management")}>
        Field Management
      </button>
    </div>
  );
};

export default SuperAdminDb;
