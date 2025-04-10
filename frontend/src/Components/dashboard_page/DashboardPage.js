import React, {useState, useEffect} from 'react';
import './DashboardPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";

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

    console.log("Fetching credit cards for userId:", userId);

    useEffect(() => {
        if (!userId) return;

        fetch(`http://localhost:5000/api/credit-cards?userId=${userId}`).then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch credit cards");
            }
            return response.json();
        }).then(data => { 
            setCreditCards(data); 
        }).catch(error => {
            console.error("Error fetching credit card data:", error);
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
                    <img src="/logo1.png" alt="Logo" className="logo" />
                    <h2 className='brandName'>FinisCredo</h2>
                </div>
                <div className="navlinks" style={ {marginLeft: '780px'} }>
                    <Link to="/dashboard" id="active">Dashboard</Link>
                </div>
                <div className="navlinks">
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
                    <table className="debtTable">
                        <thead style={{backgroundColor: 'rgb(19, 186, 241)'}}>
                            <tr>
                                <th className='tableHeader'>S.No</th>
                                <th className='tableHeader'>Card Type</th>
                                <th className='tableHeader'>Debt Owed</th>
                                <th className='tableHeader'>Outstanding Debt</th>
                                <th className='tableHeader'>Interest Rate</th>
                                <th className='tableHeader'>Repayment Strategy</th>
                                <th className='tableHeader'>Estimated Payoff Date</th>
                                <th className='tableHeader'>Auto payement mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditCards.map((card, index) => (
                                <tr key={index}>
                                    <td className='tableBody'>{index + 1}</td>
                                    <td className='tableBody'>{card.cardType}</td>
                                    <td className='tableBody'>{card.debtOwed}</td>
                                    <td className='tableBody'>{card.outstandingDebt}</td>
                                    <td className='tableBody'>{card.interestRate}%</td>
                                    <td className='tableBody'>{card.paymentStrategy}</td>
                                    <td className='tableBody'>{card.autoPay}</td>
                                    <td className='tableBody'>{card.autoPay}</td>
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