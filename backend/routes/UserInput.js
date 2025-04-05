const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Save user form data
router.post("/save", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: "User data saved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to save user data." });
  }
});

// Generate repayment recommendation table
router.post("/recommendation", async (req, res) => {
  const { salary, creditCards, repaymentMethod } = req.body;

  let sortedCards = [...creditCards];
  if (repaymentMethod === "Snowball") {
    sortedCards.sort((a, b) => a.balance - b.balance);
  } else {
    sortedCards.sort((a, b) => b.interestRate - a.interestRate);
  }

  let remainingSalary = salary;
  const tableData = sortedCards.map((card) => {
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
