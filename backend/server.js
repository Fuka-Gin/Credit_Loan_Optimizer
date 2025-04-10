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

        await User_Details.updateOne({ email }, { $set: { isActive: true } });
        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token, userId: user._id, email: user.email, username: user.username });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
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

app.post('/api/newDebt', upload.none(), async (req, res) => {
    try {
        const formData = req.body;
        let existingCard = await CreditCard.findOne({ cardNumber: formData.cardNumber });
        const debtOwed = parseFloat(formData.debtOwed);
        
        const user = await User_Details.findOne({ userID: formData.createdBy });
        if (!user) return res.status(404).json({ error: "User not found" });
        if (existingCard) {
            // Update existing debt owed
            // const DebtAmount =  existingCard.debtOwed + debtOwed;
            // const newDebt = new CreditCard({
            //     ...formData,
            //     CreatedBy: user.userID,
            //     debtOwed: DebtAmount,
            // })
            // await newDebt.save();
            existingCard.debtOwed += debtOwed;
            await existingCard.save();
            res.status(200).json({ message: "Debt updated successfully!" });
        } else {
            // Create new credit card entry
            const creditCard = new CreditCard(formData);
            await creditCard.save();
            res.status(201).json({ message: "Credit card debt added successfully!" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to add credit card debt", details: error });
    }
});
app.post("/api/addDebt", async (req, res) => {
    try {
        const {
            cardType,
            cardIssuer,
            cardName,
            cardNumber,
            cardExpiry,
            cardLimit,
            debtOwed,
            outstandingDebt,
            interestRate,
            minimumPayment,
            paymentDay,
            paymentStrategy,
            autoMode,
            customPayment,
            extraAmount,
            createdBy
        } = req.body;

        const debt = parseFloat(debtOwed);
        const interest = parseFloat(interestRate) / 100;
        const monthlyPayment = parseFloat(minimumPayment || 0) + parseFloat(extraAmount || 0);

        if (!monthlyPayment || monthlyPayment <= 0) {
            return res.status(400).json({ message: "Monthly payment must be greater than zero" });
        }

        // Calculate estimated months to pay off
        const monthsToPayOff = Math.ceil(debt / monthlyPayment);
        const estimatedPayoffDate = new Date();
        estimatedPayoffDate.setMonth(estimatedPayoffDate.getMonth() + monthsToPayOff);

        const newDebt = new CreditCard({
            cardType,
            cardIssuer,
            cardName,
            cardNumber,
            cardExpiry,
            cardLimit: parseFloat(cardLimit),
            debtOwed: debt,
            outstandingDebt: parseFloat(outstandingDebt) || debt,
            interestRate: parseFloat(interestRate),
            minimumPayment: parseFloat(minimumPayment),
            paymentDay: parseInt(paymentDay),
            paymentStrategy,
            autoPay: autoMode === "yes",
            customPayment: customPayment === "yes",
            extraAmount: parseFloat(extraAmount) || 0,
            estimatedPayoffDate: estimatedPayoffDate.toISOString().split('T')[0],
            createdBy
        });

        await newDebt.save();
        res.status(201).json({ message: "Debt record added successfully!" });

    } catch (error) {
        console.error("Error saving debt record:", error);
        res.status(500).json({ error: "Failed to add debt record", details: error.message });
    }
});


// API Route to Get All Credit Card Data
app.get("/api/credit-cards", async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    
    try {
        // In server.js
        const creditCards = await CreditCard.find(
        { createdBy: userId },
        "cardType debtOwed outstandingDebt interestRate paymentStrategy autoPay estimatedPayoffDate"
        ).lean();
        

        res.json(creditCards);
    } catch (error) {
        console.error("Error fetching credit card data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Add this to your server.js
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