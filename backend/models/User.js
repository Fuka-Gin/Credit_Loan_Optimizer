const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  salary: Number,
  creditCards: [
    {
      name: String,
      balance: Number,
      interestRate: Number,
    },
  ],
  repaymentMethod: String,
});

module.exports = mongoose.model("User", UserSchema);
