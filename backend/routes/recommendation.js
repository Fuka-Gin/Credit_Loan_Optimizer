const express = require("express");
const router = express.Router();

router.post("/recommend", (req, res) => {
  const { name, salary, creditCards, repaymentMethod } = req.body;

  let sortedCards;
  if (repaymentMethod === "Snowball") {
    sortedCards = creditCards.sort((a, b) => a.balance - b.balance); // Smallest debt first
  } else {
    sortedCards = creditCards.sort((a, b) => b.interestRate - a.interestRate); // Highest interest first
  }

  let remainingSalary = salary;
  let recommendations = [];
  sortedCards.forEach((card) => {
    if (remainingSalary > card.balance) {
      recommendations.push(
        `Pay off ${card.name} first with balance ${card.balance}`
      );
      remainingSalary -= card.balance;
    } else {
      recommendations.push(
        `Pay partially ${remainingSalary} on ${card.name} and save the rest`
      );
      remainingSalary = 0;
    }
  });

  res.json({ message: recommendations.join(". "), remainingSalary });
});

module.exports = router;
