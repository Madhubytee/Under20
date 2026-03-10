const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/under20";

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Connect to MongoDB, then start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Under20 API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.log("Starting server without database (recipe search still works)");
    app.listen(PORT, () => console.log(`Under20 API running on port ${PORT}`));
  });

module.exports = app;
