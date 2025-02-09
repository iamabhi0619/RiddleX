const express = require("express");
const cors = require('cors')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const riddlesRoute = require("./routes/riddles");
const userRoute = require("./routes/user");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Routes

app.use("/api/riddles", riddlesRoute.routes);
app.use("/api/user", userRoute.routes);



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
