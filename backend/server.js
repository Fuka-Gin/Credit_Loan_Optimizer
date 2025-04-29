const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

  mongoose.connection.once("open", async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(col => col.name)); // Should list User_Details
});

//Model
const User_Details = require("./models/User_Details");
const CreditCard = require("./models/CreditCard");

//Twiolo API Credentials
const twilioSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(twilioSid, authToken);
const optStore = {};

app.post("/api/signup", async (req, res) => {
    try {
        const { username, email, mobileNo, password } = req.body;

        // Check if user already exists
        const existingUser = await User_Details.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userID = uuidv4(); //Generate an unqiue userID for the user

        // Create user
        const newUser = new User_Details({ userID, username, email, mobileNo, password: hashedPassword });
        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "Signup successful", token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User_Details.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token, userId: user._id, username: user.username, mobileNo: user.mobileNo });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/sendOTP", async (req, res) => {
    const { mobileNo } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    if (!mobileNo) return res.status(400).json({ message: "Mobile number is required" });
    
    if (!/^\+\d{10,15}$/.test(mobileNo)) {
        return res.status(400).json({ message: "Invalid mobile number format. Use +<countrycode><number>" });
    }      

    try {
        // Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: +16812026545 ,
            to: mobileNo
        });
        optStore [mobileNo] = otp;
        console.log("OTP stored for", mobileNo, "is", otp);
        res.status(200).send({success: true, otp});
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

app.post("/api/verifyOTP", async (req, res) => {
    const { mobileNo, otp } = req.body;

    if (!mobileNo || !otp) {
        return res.status(400).json({ message: "Phone number and OTP is required" });
    }

    const storedOTP = optStore[mobileNo];
    console.log("Verifying OTP for", mobileNo, "with input:", otp);
    console.log("Stored OTP:", storedOTP);
    
    if (parseInt(otp) === storedOTP) {
        delete optStore[mobileNo]; // Remove OTP after verification
        return res.status(200).json({ message: "OTP verified successfully" });
    } else {
        return res.status(400).json({ message: "Invalid OTP" });
    }
});

app.get('/api/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User_Details.findById( userId ).select("-password"); // Exclude password from response
        if (!user) return res.status(404).json({ message: "User not found" });
 
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error); // Debugging log
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

app.put("/api/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedData = req.body;

        const user = await User_Details.findByIdAndUpdate(userId, updatedData, { new: true});
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json({ message: "Profile updated successfully!", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

app.post("/api/logout", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if user exists
        const user = await User_Details.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found" });

        // Update isActive status to false
        await User_Details.updateOne({ _id: userId }, { $set: { isActive: false } });

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/addDebt", async (req, res) => {
    try {
        const newDebt = new CreditCard(req.body);
        await newDebt.save();
        res.status(201).json({ message: "Debt record added successfully!" });
    } catch (error) {
        console.error("Error saving debt record:", error);
        res.status(500).json({ error: "Failed to add debt record" });
    }
});

// API Route to Get All Credit Card Data
app.get("/api/credit-cards", async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    
    try {
        const creditCards = await CreditCard.find(
            { createdBy: userId }, // Fetch only the logged-in user's cards
            "cardType debtOwed outstandingDebt interestRate paymentStrategy autoPay" // required fields
        ).lean();

        res.json(creditCards);
    } catch (error) {
        console.error("Error fetching credit card data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete("/api/credit-cards/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCard = await CreditCard.findByIdAndDelete(id);
        
        if (!deletedCard) {
            return res.status(404).json({ message: "Credit card not found" });
        }
        
        res.status(200).json({ message: "Credit card deleted successfully" });
    } catch (error) {
        console.error("Error deleting credit card:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});