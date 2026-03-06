const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const adherenceRoutes = require("./routes/adherenceRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const userRoutes = require("./routes/userRoutes");
const alertRoutes = require("./routes/alertRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/adherence", adherenceRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alerts", alertRoutes);

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

})
.catch(err => console.log(err));