import express, { json } from "express";
import cors from "cors";
import * as connectDB from "../config/db";
import { resolve } from "path";
const app = express();

connectDB();

//Init Middleware
app.use(json({ extended: false }));
app.use(cors());

//Define Routes

app.use("/api/payments", require("./routes/payments").default);
app.use("/api/stats", require("./routes/stats").default);
app.use("/api/user", require("./routes/user").default);
app.use("/api/userAdmin", require("./routes/userAdmin").default);
app.use("/api/users", require("./routes/users").default);
app.use("/api/auth", require("./routes/auth").default);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5500;
app.listen(PORT, () =>
  console.log(`Sever successfully started on port ${PORT}`)
);
