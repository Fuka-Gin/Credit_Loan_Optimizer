const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Save user data
router.post("/save", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: "User data saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get recommendations
router.post("/recommendation", async (req, res) => {
  const { salary, creditCards, repaymentStrategy } = req.body;

  let sortedCards;
  if (repaymentStrategy === "snowball") {
    sortedCards = creditCards.sort((a, b) => a.balance - b.balance);
  } else {
    sortedCards = creditCards.sort((a, b) => b.interestRate - a.interestRate);
  }

  let remainingSalary = salary;
  let tableData = sortedCards.map((card) => {
    let amountPaid = Math.min(card.balance, remainingSalary);
    remainingSalary -= amountPaid;
    return {
      name: card.name,
      amountPaid,
      remainingSalary,
    };
  });

  res.status(200).json({ recommendation: tableData });
});

module.exports = router;
