import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import axios from "axios";
import "./WorkflowManage.css";

const WorkflowManage = () => {
  const [pages, setPages] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  useEffect(() => {
    const checkAuthorizationAndFetchPages = async () => {
      try {
        // Check authorization first
        const response = await axios.get("http://localhost:3001/api/get-role", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data === "SuperAdmin") {
          setIsAuthorized(true);
  
          // Fetch pages if authorized
          const pagesResponse = await axios.get("http://localhost:3001/api/workflow", {
            headers: { Authorization: `Bearer ${token}` }
          });
  
          console.log("Fetched workflow:", pagesResponse.data);
  
          if (pagesResponse.data && Array.isArray(pagesResponse.data.order)) {
            setPages(
              pagesResponse.data.order.map((id) => ({
                id,
                content: getPageContent(id),
              }))
            );
          } else {
            console.error("Unexpected response format:", pagesResponse.data);
          }
        } else {
          navigate("/unauthorized");
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/unauthorized");
      }
    };
  
    checkAuthorizationAndFetchPages();
  }, [navigate, token]);
  

  const getPageContent = (id) => {
    switch (id) {
      case "1":
        return "Personal Info Page";
      case "2":
        return "Educational Info Page";
      case "3":
        return "Professional Info Page";
      case "4":
        return "Document Upload Page";
      default:
        return `Page ${id}`;
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    const updatedPages = Array.from(pages);
    const [movedPage] = updatedPages.splice(source.index, 1);
    updatedPages.splice(destination.index, 0, movedPage);

    setPages(updatedPages);
  };

  const handleDone = () => {
    axios
      .post("http://localhost:3001/api/workflow", {
        order: pages.map((page) => page.id),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        console.log("Workflow updated successfully");
        navigate("/superadmin-dashboard"); // Ensure you're redirecting to the correct dashboard route
      })
      .catch((error) => {
        console.error("Error updating workflow:", error);
        if (error.response?.status === 403) {
          navigate("/unauthorized");
        }
      });
  };

  if (!isAuthorized) {
    // Show loading or authorization message while checking authorization
    return <div>Checking authorization...</div>;
  }

  return (
    <div className="workflow-management">
      <h2>Workflow Management</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        {pages.length > 0 && (
          <Droppable droppableId="workflow-droppable">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {pages.map((page, index) => (
                  <Draggable key={page.id} draggableId={page.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {page.content}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        )}
      </DragDropContext>
      <button onClick={handleDone} className="btn">
        Done
      </button>
    </div>
  );
};

export default WorkflowManage;
