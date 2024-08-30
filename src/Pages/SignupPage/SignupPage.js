import React, {useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("UserAdmin");
  const [invitationCode, setInvitationCode] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
        setPasswordError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        return;
      }

    axios
      .post("http://localhost:3001/signup", { name, email, password, role, invitationCode })
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) => setName(e.target.value)}
          />
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
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
          <div className='role-selection'>
            <label>
              <input
                type="radio"
                name="role"
                value="UserAdmin"
                checked={role === "UserAdmin"}
                onChange={() => setRole("UserAdmin")}
              />
              UserAdmin
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="SuperAdmin"
                checked={role === "SuperAdmin"}
                onChange={() => setRole("SuperAdmin")}
              />
              SuperAdmin
            </label>
          </div>
          {role === "SuperAdmin" && (
            <input
              type="text"
              placeholder="Invitation Code"
              onChange={(e) => setInvitationCode(e.target.value)}
            />
          )}
        </div>
        <button type="submit" className="btn">
          Register
        </button>
      </form>
      <div className="btn-container">
        <p>Already have an Account?</p>
        <Link to="/login" className="btn">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
