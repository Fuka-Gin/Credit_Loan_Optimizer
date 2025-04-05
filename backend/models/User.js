const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  name: String,
  balance: Number,
  interestRate: Number,
});

const UserSchema = new mongoose.Schema({
  name: String,
  salary: Number,
  repaymentMethod: String,
  creditCards: [CardSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
