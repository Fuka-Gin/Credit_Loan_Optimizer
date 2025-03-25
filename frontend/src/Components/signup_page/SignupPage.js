import React, { useState } from 'react';
import { BiShow, BiHide } from "react-icons/bi";
import { SiMaildotru } from "react-icons/si"; 
import './SignupPage.css';
import { FaUser, FaMobile } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import imagePath from './auction-house-conceptual-background_1284-29710.avif';

const SignupPage = () => {
  const [username, setUsername] = useState(''); //Contains username value
  const [password, setPass] = useState(''); //Contains password value for checking
  const [confirmPass, setConfPass] = useState(''); //Contains confirm password value for checking
  const [mobileNo, setPho] = useState(''); //Contains phone no value for checking
  const [email, setEmail] = useState(''); //Contains email value for checking

  const [passView, setView] = useState(false); //Used to see password
  const [match, setMatch] = useState(true); //Used to check password is correctly being entered
  const [Phoval, setPhoVal] = useState(true); //Used to check for valid mobile no
  //const [phoneTouch, setPhoTouch] = useState(false); //Used to check field is entered or not
  const [mailVal, setmail] = useState(true); // Used to check 
  const [emailTouch, setEmailTouch] = useState(false); // Track if the email input has been touched
  const [message, setMessage] = useState(''); 
  const navigate = useNavigate(); //Used to navigate between different page

  const toggle = () => {
    setView(!passView);
  };

  const handleConfirmPass = (e) => {
    setConfPass(e.target.value);
    setMatch(e.target.value === password);
  };

  const handlePhone = (e) => {
    const input = (e.target.value);
    if (/^\d{0,10}$/.test(input)) {
        setPho(input);
    }
  };

  const PhoneBlur = () => {
    //setPhoTouch(true);
    setPhoVal(mobileNo.length === 10)
  };

  const EmailBlur = () => {
    setEmailTouch(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setmail(emailRegex.test(email));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
        setMessage('Passwords do not match');
        return;
    }

    // Check if phone number is valid
    if (!Phoval) {
        setMessage('Phone number must be exactly 10 digits.');
        return;
    }

    // Check if email is valid
    if (!mailVal) {
        setMessage('Please enter a valid email address');
        return;
    }

    const userData = {
      username: username,
      email: email,
      mobileNo: mobileNo,
      password: password
    }
    console.log("Sending data:", userData);

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Signup successful!");
        localStorage.setItem("token", data.token); // Store token for authentication
        navigate("/login"); // Redirect to dashboard after signup
      } else {
          console.error("Signup error:", data);
          throw new Error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setMessage("Something went wrong. Please try again.");
    }
  };


  return (
    <div className="App">
      <div className='design-area'>
        <img src={imagePath} />
      </div>
      <form className='signup-form' onSubmit={handleSignup}>
        <div>
          <div className='label-box'>
            <label htmlFor="username">Name:</label>
          </div>
          <div className="input-box">
            <input type="text" name="username" value={username} placeholder="Enter your name" 
            onChange={(e) => setUsername(e.target.value)} required />
            <span><FaUser className='icon'/></span>
          </div>
        </div>

        <div>
          <div className='label-box'>
            <label htmlFor="email">Email:</label>
          </div>
          <div className={`input-box ${mailVal ? '' : 'invalid'}`}>
            <input type="text" name="email" placeholder="Enter your mail id" value={email} 
             onChange={(e) => setEmail(e.target.value)} onBlur={EmailBlur} required />
            <span><SiMaildotru className='icon'/></span>
            { emailTouch && !mailVal && <p className='error-message'>Please enter a valid email address</p>}
          </div>
        </div>
        
        <div>
          <div className='label-box'>
            <label htmlFor="mobileNo">Moblie No:</label>
          </div>
          <div className="input-box">
            <input type="text" name="mobileNo" placeholder="Enter your mobile no" value={mobileNo} 
             onChange={handlePhone} onBlur={PhoneBlur}/>
            <span><FaMobile className='icon'/></span>
            { !Phoval && (<p className='error-message'>Phone number must be exactly 10 digits.</p>)}
          </div>
        </div>

        <div>
          <div className='label-box'>
            <label htmlFor="password">Password:</label>
          </div>
          <div className="input-box">
            <input type={passView ? 'text' : 'password'} name="password" placeholder="Enter your password" 
              value={password} onChange={(e) => setPass(e.target.value)} required />
            <span onClick={toggle}>{passView ? <BiShow className='icon' /> : <BiHide className='icon' />}</span>
          </div>
        </div>
        
        <div>
          <div className='label-box'>
            <label htmlFor="confirmPass">Confirm Password:</label>
          </div>
          <div className="input-box">
            <input type={passView ? 'text' : 'password'} name="confirmPass" 
             placeholder="Confirm your password" value={confirmPass} onChange={handleConfirmPass} required />
            <span onClick={toggle}>{passView ? <BiShow className='icon' /> : <BiHide className='icon' />}</span>
            {!match && <p className='error-message'>Passwords do not match</p>}
          </div>
        </div>

        <input type="submit" id="button" value="Submit"/>
        <div className='register-link'>
          <p>Already have an account? <Link to='/login'>Login</Link></p>
        </div>
      </form>
    </div>
  );
}
export default SignupPage;