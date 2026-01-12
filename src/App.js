const express = require("express");
const cors = require("cors");
const userroutes = require("./routes/user-routes");
// const errorHandler = require("./Middlewares/errorHandler"); 

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", userroutes);
//app.use("/api/users", userroutes);
// app.use(errorHandler);


app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

module.exports = app;
