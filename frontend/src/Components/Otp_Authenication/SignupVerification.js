import React, {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './SignupVerification.css';

const SignupVerify = () => {
    const [userOTP, setUserOTP] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state?.userData;

    const handleOPT = (e) => {
        const input = (e.target.value);
        if (/^\d{0,6}$/.test(input)) {
            setUserOTP(input);
        }
    };

    const verify = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/verifyOTP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mobileNo: `+91${userData.mobileNo}`, otp: userOTP })
            });

            const data = await res.json();
            if (res.ok) {
                // Now save userData to DB
                const saveRes = await fetch("http://localhost:5000/api/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(userData)
                });

                const saveData = await saveRes.json();
                if (saveRes.ok) {
                    alert("Signup successful!");
                    navigate("/login");
                } else {
                    alert("Error saving user data: " + (saveData.message || "Unknown error"));
                }
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
            <form className="OTPform" onSubmit={verify}>
                <h6 className="headLine">OTP Authenication</h6>
                <div className='labelBox'>
                    <label htmlFor="otp">Enter the OTP</label>
                </div>

                <div className="inputBox">
                    <input type="number" placeholder="Enter the OTP you received" onChange={handleOPT} required/>
                </div>
                <button className="verifyButton">Verify</button>
            </form>
        </div>
    );
};

export default SignupVerify;