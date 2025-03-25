import React, {useState, useEffect} from 'react';
import './DashboardPage.css';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(""); //Contains current logged-in user's email
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username"); // Get stored username
        if(storedUsername){
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = async () => {
        const userId = localStorage.getItem("userId"); // Get stored user ID

        if (!userId) {
            alert("No user found to log out.");
            return;
        }

        try{
            const response = await fetch("http://localhost:5000/api/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if(Response.ok){
                // Clear local storage and redirect to Landing Page
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("username");
                alert("Logged out successfully!");
                navigate("/");
            }
            else {
                const data = await response.json();
                alert(data.message || "Logout failed. Please try again.");
            }
        }catch (error) {
            console.error("Logout error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return(
        <div>
            <nav className="navbar-section">
                <div className="brand">
                    <h2>Netikos Dimoprasía</h2>
                </div>
                <div className="links" style={ {marginLeft: '380px'} }>
                    <Link to="/dashboard" id="active">Dashboard</Link>
                </div>
                <div className="links">
                    <Link to="/bidding">Bidding</Link>
                </div>
                <div className="links">
                    <Link to="/listing">Listing</Link>
                </div>
                <div className="links">
                    <Link to="/profile">My Profile</Link>
                </div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </nav>
            <div className="body-container">
            {username ? (
                <p>Welcome, {username}!</p>
            ) : (
                <p>Please log in to view your dashboard.</p>
            )}
            </div>
        </div> 
    );
};

export default DashboardPage;