import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import "./WorkflowManage.css";


const WorkflowManage = () => {
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/workflow");
        console.log("Fetched workflow:", response.data);

        // Check if response data is correctly formatted
        if (response.data && Array.isArray(response.data.order)) {
          setPages(
            response.data.order.map((id) => ({
              id,
              content: getPageContent(id), // Set content based on id
            }))
          );
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching workflow:", error);
      }
    };

    fetchPages();
  }, []);

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
    // Save the updated workflow to the database
    axios
      .post("http://localhost:3001/api/workflow", {
        order: pages.map((page) => page.id),
      })
      .then(() => {
        console.log("Workflow updated successfully");
        navigate("/superadmin-dashboard"); // Navigate back to SuperAdminDashboard
      })
      .catch((error) => console.error("Error updating workflow:", error));
  };


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
