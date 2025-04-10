import React , {useState} from "react";
import './NewDebt.css';

const NewDebt = () => {
    const userId = localStorage.getItem("userId");
    const [isCustomPayment, setIsCustomPayment] = useState(false);

    if (!userId) {
        alert("User is not logged in. Please log in to continue.");
        return;
    }
    
    const submitForm = async (e) => {
        e.preventDefault();

        const creditLimit = parseFloat(e.target.creditLimit.value);
        const debtOwed = parseFloat(e.target.debtOwed.value);
        const outstandingDebt = parseFloat(e.target.outstandingDebt.value) || debtOwed;
        const interestRate = parseFloat(e.target.interestRate.value);
        const minimumPayment = parseFloat(e.target.minimumPayment.value || 0);
        const extraAmount = isCustomPayment ? parseFloat(e.target.extraPayment.value || 0) : 0;
        const cardExpiry = e.target.cardExpiry.value;
        const paymentDay = parseInt(e.target.paymentDay.value);
        const autoPay = e.target.AutoMode.value === "yes";
        const customPayment = isCustomPayment;

        if (debtOwed > creditLimit) {
            alert("Error: Debt owed cannot exceed the credit limit.");
            return;
        }

        if (isNaN(interestRate) || interestRate <= 0) {
            alert("Error: Please enter a valid interest rate.");
            return;
        }

        const currentDate = new Date();
        const expiryDate = new Date(cardExpiry + "-01");

        if (expiryDate < currentDate) {
            alert("Error: Your card is expired. Please use a valid card.");
            return;
        }

        // Estimate payoff date
        const monthlyPayment = minimumPayment + extraAmount;
        const monthsToPayOff = Math.ceil(outstandingDebt / (monthlyPayment || 1));
        const estimatedPayoff = new Date();
        estimatedPayoff.setMonth(estimatedPayoff.getMonth() + monthsToPayOff);
        const estimatedPayoffDate = estimatedPayoff.toISOString().split('T')[0];

        const formData = {
            createdBy: userId,
            cardType: e.target.cardType.value,
            cardIssuer: e.target.cardIssuer.value,
            cardName: e.target.cardName.value,
            cardNumber: e.target.cardNumber.value,
            cardExpiry,
            cardLimit: creditLimit,
            debtOwed,
            outstandingDebt,
            interestRate,
            minimumPayment,
            extraAmount,
            paymentDay,
            paymentStrategy: e.target.paymentStrategy.value,
            autoPay,
            customPayment,
            estimatedPayoffDate
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
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit form. Please try again.");
        }
    };

    return(
        <div>
            <form className="debt-form" onSubmit={submitForm}>
                <h2>Credit Card Details</h2>
                <label className="info-label">Card Type:</label>
                <select className="info-input" name="cardType" required>
                    <option value="">Select your card type</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                    <option value="chase">Chase</option>
                    <option value="Rupay">Rupay</option>
                    <option value="other">Other</option>
                </select>
                
                <label className="info-label">Card Issuer:</label>
                <input type="text" className="info-input" name="cardIssuer" required />
                
                <label className="info-label">Card Name:</label>
                <input type="text" className="info-input" name="cardName" required />
                
                <label className="info-label">Card Number:</label>
                <input type="number" className="info-input" name="cardNumber" maxLength="16" pattern="\d{16}"
                       onInput={(e) => {e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16);}} required />
                
                <label className="info-label">Expiry Date:</label>
                <input type="month" className="info-input" name="cardExpiry" required />
                
                <label className="info-label">Credit Limit:</label>
                <input type="number" className="info-input" name="creditLimit" required />

                <h2>Debt Details</h2>
                <label className="info-label">Debt Amount:</label>
                <input type="number" className="info-input" name="debtOwed" required />
                
                <label className="info-label">Outstanding Debt Amount:</label>
                <input type="number" className="info-input" name="outstandingDebt" required />
                
                <label className="info-label">Interest Rate:</label>
                <input type="number" className="info-input" name="interestRate" required />
                
                <label className="info-label">Minimum Payment:</label>
                <input type="number" className="info-input" name="minimumPayment" required />
                
                <label className="info-label">Billing Cycle Date:</label>
                <select className="info-input" name="paymentDay" required>
                    {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>

                <h2>User Preferences</h2>
                <label className="info-label">Payment Strategy:</label>
                <select className="info-input" name="paymentStrategy">
                    <option value="">Select your strategy</option>
                    <option value="snowball">Snowball</option>
                    <option value="avalanche">Avalanche</option>
                    <option value="custom">Custom</option>
                </select>
                
                <label className="info-label">Auto-Pay Enabled:</label>
                <select className="info-input" name="AutoMode">
                    <option value="">Select your choice</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                
                <label className="info-label">Custom Payment?</label>
                <select className="info-input" name="customPayment" onChange={(e) => setIsCustomPayment(e.target.value === "yes")}>
                    <option value="">Select</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>

                {isCustomPayment && (
                    <input
                        type="number"
                        className="info-input"
                        name="extraPayment"
                        placeholder="Enter extra amount above EMI"
                        required
                    />
                )}
                <button className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default NewDebt;
