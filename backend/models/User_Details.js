const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userID: { type: String, unique: true, required: true },
  username: { type: String },
  email: { type: String, unique: true },
  mobileNo: { type: String, unique: true },
  password: { type: String },
  isActive: { type: Boolean, default: true },
  aadhaarNo: { type: Number },
  panCard: { type: String },
  address1: { type: String },
  address2: { type: String },
  address3: { type: String },
  pincode: { type: Number },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User_Details", userSchema);