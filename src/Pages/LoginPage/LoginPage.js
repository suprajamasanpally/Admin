import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data.status === "Success") {
          if (result.data.role === "SuperAdmin") {
            navigate("/superadmin-dashboard");
          } else {
            navigate("/useradmin-dashboard", {
              state: { email: result.data.email },
            });
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          alert(err.response.data.error); //specific alert for wrong password
        } else if (err.response && err.response.status === 404) {
          alert("No record existed");
        } else {
          console.log(err);
          alert("An error occurred during login. Please try again.");
        }
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
