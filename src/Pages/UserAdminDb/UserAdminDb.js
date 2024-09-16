import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserAdminDb.css";

const UserAdminDb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {}; 
  const [workflow, setWorkflow] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/workflow", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token in headers
      })
      .then((response) => {
        if (response.data && response.data.order) {
          setWorkflow(response.data.order);
        } else {
          console.warn("No workflow data returned.");
        }
      })
      .catch((error) => console.error("Error fetching workflow:", error));
  }, []);

  const handleFillDetails = () => {
    if (workflow && workflow.length > 0) {
      const firstPageId = workflow[0]; 
      navigate(`/page-${firstPageId}`, { state: { email, workflow } });
    } else {
      console.error("Workflow is not defined or is empty.");
      navigate("/error"); 
    }
  };

  return (
    <div className="userpage">
      <h1>Hello {email ? email : "User"}, Welcome to the Home!</h1>
      <button onClick={handleFillDetails} className="btn">
        Fill in Details
      </button>
      <div className="w-btn">
        {workflow.length > 0 ? (
          <p>Workflow order: {workflow.join(" -> ")}</p>
        ) : (
          <p>No workflow defined.</p>
        )}
      </div>
    </div>
  );
};

export default UserAdminDb;
