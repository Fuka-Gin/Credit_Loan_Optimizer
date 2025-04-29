import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecommendationPage = () => {
  const [quote, setQuote] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const quotes = [
    "Every step you take today is a step toward a debt-free tomorrow.",
    "Small progress is still progress. Keep going!",
    "You are in control of your finances and your future!",
    "You spend $200/month on subscriptions. Canceling two could pay off Card X 3 months faster.",
    "Discipline today leads to freedom tomorrow."
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    fetchLoanData();
  }, []);

  const fetchLoanData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/credit-cards", {
        params: { userId },
      });
      const loans = res.data;

      if (!loans || loans.length === 0) {
        setRecommendation("No debt records found.");
        return;
      }

      const sortedLoans = [...loans].sort((a, b) => parseFloat(b.interestRate) - parseFloat(a.interestRate));
      const topLoan = sortedLoans[0];

      const {
        cardType,
        interestRate,
        paymentStrategy,
        debtOwed,
        cardName,
        paymentDay,
        estimatedPayoffDate
      } = topLoan;

      const customPayment = topLoan.customPayment
        ? topLoan.extraAmount + topLoan.minimumPayment
        : topLoan.minimumPayment;

      setRecommendation(`Dear ${username}, you are using a ${cardType} card, and it adds interest of ${interestRate}% for ${paymentStrategy} type of loan. 
You have a ₹${debtOwed} loan to clear, so it is better to clear ${cardName} loan first and maintain the balance for another loan. 
Also, if you pay at ${paymentDay} time, you will not be charged extra, and you will be left with ₹${customPayment} at the end of the month so you can spend it on other personal expenses!!`);
    } catch (error) {
      console.error("Error fetching recommendation data:", error);
      setRecommendation("Unable to fetch recommendation at the moment.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2><b>Personalized Recommendation</b></h2>
      <p style={{ whiteSpace: 'pre-line', fontSize: '25px' }}>{recommendation}</p>
      <hr />
      <p><em>{quote}</em></p>
    </div>
  );
};

export default RecommendationPage;
