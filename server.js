const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const app = express();

connectDB();

//Init Middleware

app.use(express.json({ extended: false }));

//Define Routes
app.use("/api/userAdmin", require("./routes/userAdmin"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/stats", require("./routes/stats"))
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));


//Serve static assets in production
if(process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sever started on port ${PORT}`));
