import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserAdminDb.css";

const UserAdminDb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {}; // Get email from state
  const [workflow, setWorkflow] = useState([]);

  useEffect(() => {
    // Fetch workflow
    axios
      .get("http://localhost:3001/api/workflow")
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
      const firstPageId = workflow[0]; // Get the first page ID from the workflow
      navigate(`/page-${firstPageId}`, { state: { email, workflow } });
    } else {
      console.error("Workflow is not defined or is empty.");
      navigate("/error"); // Redirect to an error page if workflow is not defined
    }
  };

  return (
    <div className="userpage">
      <h1>Hello {email}, Welcome to the Home!</h1>
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
