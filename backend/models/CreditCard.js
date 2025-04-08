const mongoose = require("mongoose");

const creditCardSchema = new mongoose.Schema({
    cardType: String,
    cardIssuer: String,
    cardName: String,
    cardNumber: Number,
    cardExpiry: String,
    cardLimit: Number,
    interestRate: Number,
    minimumPayment: Number,
    paymentDay: Number,
    paymentStrategy: String,
    autoPay: Boolean,
    customPayment: Boolean,
    extraAmount: Number,
    debtOwed: Number,
    outstandingDebt: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User_Details" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CreditCard", creditCardSchema);