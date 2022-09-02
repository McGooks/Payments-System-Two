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

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Sever successfully started on port ${PORT}`));
