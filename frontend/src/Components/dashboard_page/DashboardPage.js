import React, {useState, useEffect} from 'react';
import './DashboardPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import axios from "axios";

const DashboardPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const userId = localStorage.getItem("userId");
    const [creditCards, setCreditCards] = useState([]);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username"); // Get stored username
        if(storedUsername){
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        axios.get("http://localhost:5000/api/credit-cards", {
            params: { userId: userId }  // Ensure loggedInUserId is correctly set
        })
            .then(response => {
                setCreditCards(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [userId]);


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
                    <h2>FinisCredo</h2>
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
            <div>
                <div className="welcome-section">
                    {username ? (
                        <p>Welcome, {username}!</p>
                    ) : (
                        <p>Please log in to view your dashboard.</p>
                    )}
                </div>
                <div className="dashboard-section">
                    <Link to='/dashboard/new-debt' className='new-button'>New <FaPlus style={{marginLeft: '5px'}}/></Link>
                    <h3>Dashboard</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Card Type</th>
                                <th>Debt Owed</th>
                                <th>Outstanding Debt</th>
                                <th>Interest Rate</th>
                                <th>Repayment Strategy</th>
                                <th>Estimated Payoff Date</th>
                                <th>Auto payement mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditCards.map((card, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{card.cardType}</td>
                                    <td>{card.debtOwed}</td>
                                    <td>{card.outstandingDebt}</td>
                                    <td>{card.interestRate}%</td>
                                    <td>{card.paymentStrategy}</td>
                                    <td>{card.autoPay}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    );
};

export default DashboardPage;