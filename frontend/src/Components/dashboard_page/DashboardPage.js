import React, {useState, useEffect} from 'react';
import './DashboardPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";

const DashboardPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const userId = localStorage.getItem("userId");
    const [creditCards, setCreditCards] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

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

    const generateRepaymentSchedule = (card) => {
        const monthlyData = [];
        let debt = parseFloat(card.outstandingDebt);
        const interestRate = parseFloat(card.interestRate) / 100;
        const monthlyPayment = debt / 12; // Or use minimumPayment if available
        
        let month = 1;
        let payoffDate = new Date(); // Start from current date
        
        while (debt > 0 && month <= 60) { // Max 5 years (60 months)
            const interest = debt * interestRate / 12;
            const principalPayment = Math.min(monthlyPayment - interest, debt);
            const amountPaid = principalPayment + interest;
            
            debt = debt - principalPayment;
            if (debt < 0) debt = 0;
            
            // Calculate payoff date for this month
            const currentMonthDate = new Date(payoffDate);
            currentMonthDate.setMonth(payoffDate.getMonth() + month - 1);
            
            monthlyData.push({
                month: `Month ${month}`,
                cardType: card.cardType,
                paid: amountPaid.toFixed(2),
                remainingDebt: debt > 0 ? debt.toFixed(2) : "0.00",
                interest: interest.toFixed(2),
                payoffDate: debt <= 0 ? currentMonthDate.toLocaleDateString() : null
            });
            
            month++;
        }
        
        return monthlyData;
    };

    const handleDeleteCard = async (cardId) => {
        if (window.confirm("Are you sure you want to delete this credit card?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/credit-cards/${cardId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                const data = await response.json();
                
                if (response. ok && data.message === "Credit card deleted successfully") {
                    // Update the UI by removing the deleted card
                    setCreditCards(creditCards.filter(card => card._id !== cardId));
                    alert("Credit card deleted successfully!");
                } else {
                    alert(data.message || "Failed to delete credit card");
                }
            } catch (error) {
                console.error("Error deleting credit card:", error);
                alert(
                    error.data?.message || 
                    error.data?.error || 
                    "Failed to delete credit card. Please try again."
                );
            }
        }
    };

    const calculatePayoffDate = (card) => {
        if (!card.outstandingDebt || !card.interestRate) return 'N/A';
        
        const debt = parseFloat(card.outstandingDebt);
        const interestRate = parseFloat(card.interestRate) / 100;
        const monthlyPayment = debt / 12; // Or use minimumPayment if available
        
        if (monthlyPayment <= 0) return 'N/A';
        
        let months = 0;
        let remainingDebt = debt;
        while (remainingDebt > 0 && months < 60) {
            const interest = remainingDebt * interestRate / 12;
            const principalPayment = Math.min(monthlyPayment - interest, remainingDebt);
            remainingDebt -= principalPayment;
            months++;
        }
        
        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + months);
        return payoffDate.toLocaleDateString();
    };

    return(
        <div>
            <nav className="navbar-section">
                <div className="brand">
                    <img src="/logo1.png" alt="Logo" className="logo" />
                    <h2 className='brandName'>FinisCredo</h2>
                </div>
                <div className="navlinks" style={ {marginLeft: '540px'} }>
                    <Link to="/dashboard" id="active">Dashboard</Link>
                </div>
                <div className="navlinks">
                    <Link to="/dashboard/Recommendation">Recommendation</Link>
                </div>
                <div className="navlinks">
                    <Link to="/profile">My Profile</Link>
                </div>

                <div className="due-alerts">
                    {creditCards.map((card, index) => {
                        const today = new Date();
                        const dueDate = new Date(today.getFullYear(), today.getMonth(), card.paymentDay);
                        const isDueSoon = dueDate >= today && dueDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

                        return isDueSoon ? (
                            <span key={index} className="due-message">
                                {card.cardType} bill due on {dueDate.toDateString()}
                            </span>
                        ) : null;
                    })}
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
                                <th className='tableHeader'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditCards.map((card, index) => (
                                <tr key={index}>
                                    <td className='tableBody'>{index + 1}</td>
                                    <td className='tableBody'>{card.cardType}</td>
                                    <td className='tableBody'>{card.debtOwed || '0'}</td>
                                    <td className='tableBody'>{card.outstandingDebt || card.debtOwed || '0'}</td>
                                    <td className='tableBody'>{card.interestRate}%</td>
                                    <td className='tableBody'>{card.paymentStrategy}</td>
                                    <td className='tableBody'>{card.estimatedPayoffDate ? new Date(card.estimatedPayoffDate).toLocaleDateString() : 'N/A'}</td>
                                    <td className='tableBody'>{card.autoPay ? 'On' : 'Off'}</td>
                                    <td >
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="show-table-button" onClick={() => {
                                                setSelectedCard(card);
                                                setShowPopup(true);
                                            }}>Show Table</button>
                                            <button className="delete-button" onClick={() => handleDeleteCard(card._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showPopup && selectedCard && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h3>Repayment Schedule for {selectedCard.cardType}</h3>
                                <button className="close-button" onClick={() => setShowPopup(false)}>Close</button>
                                <table className="debtTable">
                                    <thead>
                                        <tr>
                                            <th className='showTableHeader'>Month</th>
                                            <th className='showTableHeader'>Card Type</th>
                                            <th className='showTableHeader'>Amount Paid</th>
                                            <th className='showTableHeader'>Remaining Debt</th>
                                            <th className='showTableHeader'>Interest</th>
                                            <th className='showTableHeader'>Payoff Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateRepaymentSchedule(selectedCard).map((row, index) => (
                                            <tr key={index}>
                                                <td className='tableBody'>{row.month}</td>
                                                <td className='tableBody'>{row.cardType}</td>
                                                <td className='tableBody'>₹{row.paid}</td>
                                                <td className='tableBody'>₹{row.remainingDebt}</td>
                                                <td className='tableBody'>₹{row.interest}</td>
                                                <td className='tableBody'>{row.payoffDate || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div> 
    );
};

export default DashboardPage;