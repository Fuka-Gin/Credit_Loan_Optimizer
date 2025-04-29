import React , {useState} from "react";
import './NewDebt.css';
import { Link, useNavigate } from "react-router-dom";

const NewDebt = () => {
    const userId = localStorage.getItem("userId");
    const [isCustomPayment, setIsCustomPayment] = useState(false);
    const navigate = useNavigate();

    if (!userId) {
        alert("User is not logged in. Please log in to continue.");
        return;
    }
    
    const submitForm = async (e) => {
        e.preventDefault();

        const creditLimit = parseFloat(e.target.creditLimit.value);
        const debtOwed = parseFloat(e.target.debtOwed.value);
        const interestRate = parseFloat(e.target.interestRate.value);
        const cardExpiry = e.target.cardExpiry.value;

        if (debtOwed > creditLimit) {
            alert("Error: Debt owed cannot exceed the credit limit.");
            return;
        }

        if (isNaN(interestRate) || interestRate <= 0) {
            alert("Error: Please enter a valid interest rate.");
            return;
        }

        const currentDate = new Date();
        const expiryDate = new Date(cardExpiry + "-01"); // Convert "YYYY-MM" to a valid Date object

        if (expiryDate < currentDate) {
            alert("Error: Your card is expired. Please use a valid card.");
            return;
        }

        const formData = {
            createdBy: userId,
            cardType: e.target.cardType.value,
            cardIssuer: e.target.cardIssuer.value,
            cardName: e.target.cardName.value,
            cardNumber: e.target.cardNumber.value,
            cardExpiry,
            creditLimit,
            debtOwed,
            outstandingDebt: e.target.outstandingDebt.value,
            interestRate,
            minimumPayment: e.target.minimumPayment.value,
            paymentDay: e.target.paymentDay.value,
            paymentStrategy: e.target.paymentStrategy.value,
            autoPay: e.target.autoPay.value,
            customPayment: isCustomPayment ? e.target.extraPayment.value : null
        };

        try {
            const response = await fetch("http://localhost:5000/api/addDebt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            alert(data.message);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit form. Please try again.");
        }
    };

    return(
        <div className="new-debt-container">
            <form className="debt-form" onSubmit={submitForm}>
                <h2>Credit Card Details</h2>
                <label htmlFor="cardType" className="info-label">Card Type:</label>
                <select className="info-input" name="cardType">
                    <option value="">Select your card type</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                    <option value="chase">Chase</option>
                    <option value="Rupay">Rupay</option>
                    <option value="other">Other</option>
                </select>
                
                <label htmlFor="cardIssuer" className="info-label">Card Issuer:</label>
                <input type="text" className="info-input" name="cardIssuer" placeholder="Name of the bank that issued your credit card" required />
                
                <label htmlFor="cardName" className="info-label">Card Name:</label>
                <input type="text" className="info-input" name="cardName" placeholder="Your name in the Credit Card" required />
                
                <label htmlFor="cardNumber" className="info-label">Card Number:</label>
                <input type="number" className="info-input" name="cardNumber" placeholder="Enter the 16 digit of credit number" 
                 maxLength="16" pattern="\d{16}" onInput={(e) => {e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16);}} 
                 required />
                
                <label htmlFor="cardExpiry" className="info-label">Expiry Date:</label>
                <input type="month" className="info-input" name="cardExpiry" required />
                
                <label htmlFor="creditLimit" className="info-label">Credit Limit:</label>
                <input type="number" className="info-input" name="creditLimit" placeholder="Enter the Credit Limit of Credit Card" required />

                <h2>Debt Details</h2>
                <label htmlFor="debtOwed" className="info-label">Debt Amount:</label>
                <input type="number" className="info-input" name="debtOwed" placeholder="Enter the Debt amount credited to you" required />
                
                <label htmlFor="outstandingDebt" className="info-label">Outstanding Debt Amount:</label>
                <input type="number" className="info-input" name="outstandingDebt" placeholder="Enter the remaining amount you need to pay" required />
                
                <label htmlFor="interestRate" className="info-label">Interest Rate:</label>
                <input type="number" className="info-input" name="interestRate" placeholder="Enter the Annual Interest rate for the debt" required />
                
                <label htmlFor="minimumPayment" className="info-label">Minimum Payment:</label>
                <input type="number" className="info-input" name="minimumPayment" placeholder="How much payment needed to pay per month" />
                
                <label htmlFor="paymentDay" className="info-label">Billing Cycle Date:</label>
                <select className="info-input" name="paymentDay" required>
                    {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>

                <h2>User Preferences</h2>
                <label htmlFor="paymentStrategy" className="info-label">Payment Strategy:</label>
                <select className="info-input" name="paymentStrategy">
                    <option value="">Select your strategy</option>
                    <option value="snowball">Snowball</option>
                    <option value="avalanche">Avalanche</option>
                    <option value="custom">Custom</option>
                </select>
                
                <label htmlFor="autoPay" className="info-label">Auto-Pay Enabled:</label>
                <select className="info-input" name="autoPay">
                <option value="">Select your choice</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                
                <label htmlFor="customPayment" className="info-label">Do you want to make a custom payment?</label>
                <select className="info-input" onChange={(e) => setIsCustomPayment(e.target.value === "yes")} name="customPayment">
                    <option value="">Select your choice</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>

                {isCustomPayment && (
                    <input
                    type="number"
                    className="info-input"
                    name="extraPayment"
                    placeholder="Enter extra amount above the EMI"
                    required
                    />
                )}
                <button className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default NewDebt;