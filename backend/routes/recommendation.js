const express = require("express");
const router = express.Router();

// Motivational quotes
const QUOTES = [
  "Paying off debt is like losing weight. It takes time and discipline!",
  "Debt is not the enemy, mismanagement is.",
  "A debt-free life is a stress-free life.",
  "Your future self will thank you for smart financial decisions today.",
  "Every loan cleared is a step closer to financial freedom!",
  "Make your money work for you, not against you.",
  "The best way to predict your financial future is to create it today.",
  "Small payments lead to big financial wins!",
  "A credit card is a tool, not free money.",
  "Plan today, enjoy tomorrow!"
];

// Loan repayment calculator
const calculateStatistics = (salary, years, method, cards) => {
  let stats = [];
  let loanBalances = cards.map(card => ({
    name: card.name,
    balance: parseFloat(card.balance),
    interest: parseFloat(card.interestRate)
  }));

  const months = years * 12;

  for (let month = 1; month <= months; month++) {
    let currentSalary = salary;

    if (method === "Snowball") {
      loanBalances.sort((a, b) => a.balance - b.balance);
    } else {
      loanBalances.sort((a, b) => b.interest - a.interest);
    }

    for (let loan of loanBalances) {
      if (loan.balance > 0) {
        let interestAmount = (loan.interest / 100 / 12) * loan.balance;
        loan.balance += interestAmount;

        let payment = Math.min(currentSalary, loan.balance);
        loan.balance -= payment;
        currentSalary -= payment;
      }
      if (currentSalary <= 0) break;
    }

    let remainingLoans = loanBalances.filter(loan => loan.balance > 0);
    stats.push({
      month,
      salary,
      loansCleared: salary - currentSalary,
      remainingSalary: currentSalary,
      remainingLoans: remainingLoans.map(loan => `${loan.name}: $${loan.balance.toFixed(2)}`).join(", ")
    });

    if (remainingLoans.length === 0) break;
  }

  return stats;
};

// POST /api/recommend
router.post("/recommend", (req, res) => {
  const { name, salary, years, repaymentMethod, creditCards } = req.body;

  const statistics = calculateStatistics(salary, years, repaymentMethod, creditCards);
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const recommendation = `Dear ${name}, you're using ${creditCards.map(c => c.name).join(", ")} cards with interest rates ${creditCards.map(c => c.interestRate).join("%, ")}%. 
Your balances are ${creditCards.map(c => `$${c.balance}`).join(", ")}. Using the ${repaymentMethod} method, we suggest consistent monthly payments over ${years} years. 
${quote}`;

  res.json({ message: recommendation, statistics });
});

module.exports = router;
