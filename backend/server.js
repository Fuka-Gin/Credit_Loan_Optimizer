const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
connectDB();

// Routes
const recommendationRoute = require("./routes/recommendation");
const userInputRoute = require("./routes/UserInput");

app.use("/api", recommendationRoute);
app.use("/api", userInputRoute);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
