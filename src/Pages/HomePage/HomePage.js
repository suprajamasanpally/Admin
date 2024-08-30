import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    const gotoLogin = () => {
        navigate('/login');
    };

    const gotoSignup = () =>{
        navigate('/signup');
    };
  return (
    <div className="homepage-ctn">
      <h1>Welcome to Our Website</h1>
      <div className="button-ctn">
        <button className="btttn" onClick={gotoLogin}>Login</button>
        <button className="btttn" onClick={gotoSignup}>Signup</button>
      </div>
    </div>
  );
};

export default HomePage;
