import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { themes } from "./themes";

function applyTheme(theme) {
  const selectedTheme = themes[theme] || themes['default'];
  Object.keys(selectedTheme).forEach(variable => {
    document.documentElement.style.setProperty(variable, selectedTheme[variable]);
  });
}

// Apply the theme on page load
const savedTheme = localStorage.getItem('theme') || 'default';
applyTheme(savedTheme);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
