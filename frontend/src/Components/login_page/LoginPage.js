import React, { useState } from 'react';
import './LoginPage.css';
import { BiShow, BiHide } from "react-icons/bi";
import imagePath from './auction-house-conceptual-background_1284-29710.avif';
import { SiMaildotru } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [passView, setView] = useState(false);
  const [email, setUsername] = useState(''); // Username input state
  const [password, setPassword] = useState(''); // Password input state
  // const [message, setMessage] = useState(''); // For displaying feedback messages
  const navigate = useNavigate();

  const toggle = () => {
    setView(!passView);
  };
 
  const handleMailId = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    try {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          const sendOTP = await fetch("http://localhost:5000/api/sendOTP", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ mobileNo: `+91${data.mobileNo}` })  // This assumes login response returns mobileNo
          });

          if (!sendOTP.ok) {
            alert("Failed to send OTP. Try again.");
            return;
          }
    
          alert("OTP sent to your mobile number!");

          navigate("/login/authenication", { state: { mobileNo: data.mobileNo } });
          
          localStorage.setItem("token", data.token); // Store token in localStorage
          localStorage.setItem("userId", data.userId); // Store userId in localStorage
          localStorage.setItem("userEmail", email);
          localStorage.setItem("username", data.username);
        } else {
            alert(data.message); // Show error message
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <div className='design'>
        <img src={imagePath}/>
      </div>
      <form className='login-form' onSubmit={handleSubmit}>
        <div>
          <div className='label-box'>
            <label htmlFor="umail">Email:</label>
          </div>
          <div className="input-box">
            <input type="text" id="umail" name="umail" placeholder="Enter your mail id" onChange={handleMailId} required />
            <SiMaildotru className='icon'/>
          </div>
        </div>
            
        <div>
          <div className='label-box'>
            <label htmlFor="password">Password:</label>
          </div>
          <div className="input-box">
            <input type={passView ? 'text' : 'password'} 
              id="password" name="password" placeholder="Enter your password" 
              onChange={handlePassword}
              required
            />
            <span onClick={toggle}>
              {passView ? <BiShow className='icon' /> : <BiHide className='icon' />}
            </span>
          </div>
        </div>

        <div className='forgot-password'>
          <Link to='/forgot-password' className='forgot-link'>Forgot password?</Link>
        </div>

        <input type="submit" id="button" value="Login"/>
        <div className='register-link'>
          <p>Don't have an account? <Link to='/signup'>Register</Link></p>
        </div>
      </form>
    </div>
  );
}
export default LoginPage;