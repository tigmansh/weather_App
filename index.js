const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
const { weatherRouter } = require("./routes/weather.routes");
const {auth} = require("./middleware/authorization");
const { validate } = require("./middleware/CityValidator");
require("dotenv").config();
const app = express();
app.use(express.json());

// LOGGER HERE ⬇️

const ExpressWinston = require("express-winston");
const winston = require("winston");
require("winston-mongodb");
app.use(ExpressWinston.logger({
    transports: [
        new winston.transports.File({
            level:"info",
            json:true,
            filename:"logs.json"
        }),
        new winston.transports.MongoDB({
            level:"silly",
            db: process.env.mongoURL,
            json: true
        })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));



app.get("/", (req, res) => {
  res.send("Weather App");
});

app.use("/user", userRouter);
app.use(auth);
app.use(validate);
app.use("/weather", weatherRouter);
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
  console.log(`Server is running at port ${process.env.port}`);
});
