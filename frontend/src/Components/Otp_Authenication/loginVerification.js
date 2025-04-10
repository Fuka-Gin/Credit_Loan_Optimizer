import React, {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './SignupVerification.css';

const LoginVerify = () => {
    const [userOTP, setUserOTP] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { mobileNo, token, userId, username } = location.state || {};

    const handleOPT = (e) => {
        const input = (e.target.value);
        if (/^\d{0,6}$/.test(input)) {
            setUserOTP(input);
        }
    };

    const verify = async (e) => {
        e.preventDefault();

        const formattedMobileNo = mobileNo.startsWith("+91") ? mobileNo : `+91${mobileNo}`;

        try {
            const res = await fetch("http://localhost:5000/api/verifyOTP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mobileNo: formattedMobileNo, otp: userOTP, userId })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);
                localStorage.setItem("username", username); 
                alert("Login successful!");
                navigate("/dashboard");
            } else {
                alert(data.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("OTP verification error:", error.message);
            alert("Something went wrong. Please try again.");
        } 
    };
    

    return(
        <div>
            <h1>OTP Verification</h1>
            <form className="OTPform" onSubmit={verify}>
                <h6>OTP has been sent to your registered mobile no</h6>

                <div className='labelBox'>
                    <label htmlFor="otp">Enter the OTP</label>
                </div>

                <div className="inputBox">
                    <input type="number" placeholder="Enter the OTP you received" onChange={handleOPT} required/>
                </div>
                <button className="verifyButton">Verify</button>
            </form>
        </div>
    )
};

export default LoginVerify;