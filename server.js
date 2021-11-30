const express = require("express");
const cors = require("cors")
const connectDB = require("./config/db");
const path = require("path");
const app = express();

connectDB();

//Init Middleware
app.use(express.json({ extended: false }));
app.use(cors())

//Define Routes

app.use("/api/payments", require("./routes/payments"));
app.use("/api/stats", require("./routes/stats"))
app.use("/api/user", require("./routes/user"))
app.use("/api/userAdmin", require("./routes/userAdmin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Sever successfully started on port ${PORT}`));
