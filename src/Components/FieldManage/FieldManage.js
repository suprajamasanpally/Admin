import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FieldManage.css";

const FieldManage = () => {
  const [selectedPage, setSelectedPage] = useState("PersonalInfo");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editField, setEditField] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newField, setNewField] = useState({
    fieldName: "",
    label: "",
    type: "text",
    required: false,
    visible: true,
    order: 0,
    options: [], // Ensure this is always an array
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/fields/${selectedPage}`
        );
        setFields(response.data);
      } catch (error) {
        console.error("Error fetching fields:", error);
        setError("Failed to load form fields. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [selectedPage]);

  const handleChange = (e) => {
    setNewField({
      ...newField,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setNewField({
      ...newField,
      [e.target.name]: e.target.checked,
    });
  };

  const handleOptionsChange = (e) => {
    try {
      const input = e.target.value;
      const options = input.split(/,\s*/).map((option) => option.trim());
      setNewField({
        ...newField,
        options: options,
      });
    } catch (error) {
      console.error("Error parsing options:", error);
    }
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3001/api/fields/${selectedPage}`,
        newField
      );
      setNewField({
        fieldName: "",
        label: "",
        type: "text",
        required: false,
        visible: true,
        order: 0,
        options: [], // Reset options
      });
      setShowForm(false);
      const response = await axios.get(
        `http://localhost:3001/api/fields/${selectedPage}`
      );
      setFields(response.data);
    } catch (error) {
      console.error("Error adding field:", error);
      setError("Failed to add field. Please try again later.");
    }
  };

  const handleUpdateField = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/api/fields/${editField._id}`,
        newField
      );
      setNewField({
        fieldName: "",
        label: "",
        type: "text",
        required: false,
        visible: true,
        order: 0,
        options: [], // Reset options
      });
      setShowForm(false);
      setEditField(null);
      const response = await axios.get(
        `http://localhost:3001/api/fields/${selectedPage}`
      );
      setFields(response.data);
    } catch (error) {
      console.error("Error updating field:", error);
      setError("Failed to update field. Please try again later.");
    }
  };

  const handleEditClick = (field) => {
    setEditField(field);
    setNewField({
      fieldName: field.fieldName || "",
      label: field.label || "",
      type: field.type || "text",
      required: field.required || false,
      visible: field.visible || true,
      order: field.order || 0,
      options: Array.isArray(field.options) ? field.options.join(", ") : "", // Ensure options is a string
    });
    setShowForm(true);
  };

  const handleDeleteField = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/fields/${id}`);
      setFields(fields.filter((field) => field._id !== id));
    } catch (error) {
      console.error("Error deleting field:", error);
      setError("Failed to delete field. Please try again later.");
    }
  };

  const handleDone = () => {
    navigate("/superadmin-dashboard");
  };

  return (
    <div className="field-manage-container">
      <h1 className="field-manage-title">Field Management</h1>
      {error && <div className="field-manage-error">{error}</div>}
      <select
        onChange={(e) => setSelectedPage(e.target.value)}
        value={selectedPage}
        className="field-manage-select"
      >
        <option value="PersonalInfo">Personal Info</option>
        <option value="EducationalInfo">Educational Info</option>
        <option value="ProfessionalInfo">Professional Info</option>
      </select>
      <button
        onClick={() => setShowForm(!showForm)}
        className="field-manage-button"
      >
        {showForm ? "Cancel" : "Add Field"}
      </button>
      {showForm && (
        <form
          onSubmit={editField ? handleUpdateField : handleAddField}
          className="field-manage-form"
        >
          <label className="field-manage-label">
            Field Name:
            <input
              type="text"
              name="fieldName"
              value={newField.fieldName}
              onChange={handleChange}
              required
              className="field-manage-input"
            />
          </label>
          <label className="field-manage-label">
            Label:
            <input
              type="text"
              name="label"
              value={newField.label}
              onChange={handleChange}
              required
              className="field-manage-input"
            />
          </label>
          <label className="field-manage-label">
            Type:
            <select
              name="type"
              value={newField.type}
              onChange={handleChange}
              className="field-manage-select"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Select</option>
              <option value="checkbox">Checkbox</option>
              <option value="textarea">Textarea</option>
            </select>
          </label>
          {newField.type === "select" && (
            <label className="field-manage-label">
              Options (comma separated):
              <input
                type="text"
                value={newField.options}
                onChange={handleOptionsChange}
                placeholder="e.g., Male, Female, Non-Binary, Prefer not to say"
                required
                className="field-manage-input"
              />
            </label>
          )}
          {newField.type === "textarea" && (
            <label className="field-manage-label">
              Placeholder (optional):
              <textarea
                name="options" // Reuse the options field for placeholder
                value={newField.options}
                onChange={handleOptionsChange}
                placeholder="e.g., Enter your text here..."
                className="field-manage-textarea"
              />
            </label>
          )}
          <label className="field-manage-label">
            Required:
            <input
              type="checkbox"
              name="required"
              checked={newField.required}
              onChange={handleCheckboxChange}
              className="field-manage-checkbox"
            />
          </label>
          <label className="field-manage-label">
            Visible:
            <input
              type="checkbox"
              name="visible"
              checked={newField.visible}
              onChange={handleCheckboxChange}
              className="field-manage-checkbox"
            />
          </label>
          <label className="field-manage-label">
            Order:
            <input
              type="number"
              name="order"
              value={newField.order}
              onChange={handleChange}
              className="field-manage-input"
            />
          </label>
          <button type="submit" className="field-manage-submit-button">
            {editField ? "Update Field" : "Add Field"}
          </button>
        </form>
      )}
      {loading ? (
        <div className="field-manage-loading">Loading...</div>
      ) : (
        <ul className="field-manage-list">
          {fields.map((field) => (
            <li key={field._id} className="field-manage-item">
              <span className="field-manage-order">{field.order}. </span>
              {field.label} ({field.type})
              {field.type === "select" && (
                <ul className="field-manage-options-list">
                  {field.options.map((option, index) => (
                    <li key={index} className="field-manage-option">
                      {option}
                    </li>
                  ))}
                </ul>
              )}
              {field.type === "textarea" && (
                <div className="field-manage-textarea-placeholder">
                  Placeholder: {field.options}
                </div>
              )}
              <button
                onClick={() => handleEditClick(field)}
                className="field-manage-edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteField(field._id)}
                className="field-manage-delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleDone} className="field-manage-done-button">
        Done
      </button>
    </div>
  );
};

export default FieldManage;
