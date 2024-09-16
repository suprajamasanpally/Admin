import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [showInvitationCodeInput, setShowInvitationCodeInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        if (result.data.status === "Success") {
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("role", result.data.role);

          if (result.data.role === "SuperAdmin") {
            // Show the invitation code input for SuperAdmin
            setShowInvitationCodeInput(true);
          } else if (result.data.role === "User") {
            navigate("/useradmin-dashboard", {
              state: { email: result.data.email },
            });
          }
        } else {
          alert("Login failed. Please check your credentials.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred during login. Please try again.");
      });
  };

  const handleInvitationCodeSubmit = () => {
    axios
      .post("http://localhost:3001/validate-invitation-code", {
        invitationCode,
      })
      .then((result) => {
        if (result.data.status === "Success") {
          navigate("/superadmin-dashboard");
        } else {
          alert("Invalid invitation code.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while validating the invitation code.");
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="btn">
          Login
        </button>
      </form>

      {showInvitationCodeInput && (
        <div className="invitation-code-container">
          <h2>Enter Invitation Code</h2>
          <input
            type="password"
            placeholder="Invitation Code"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
          />
          <button onClick={handleInvitationCodeSubmit} className="btn">
            Submit Invitation Code
          </button>
        </div>
      )}

      <div className="btn-container">
        <p>Don't have an account?</p>
        <Link to="/signup" className="btn">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
