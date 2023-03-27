const express = require("express");
const { client } = require("../redis");
const weatherRouter = express.Router();
require("dotenv").config();

weatherRouter.get("/city", async (req, res) => {
    let city = req.body.city;
  let obj = {
    city: city,
    temp: "25 degree celcius",
    "About-To-Rain": "NO",
    Sunny: "YES",
  };
  await client.SETEX("cityData", 1800, JSON.stringify(obj));
  res.send({ msg: `WEATHER DATA FROM API FOR ${city}`, data: obj });
});

module.exports = { weatherRouter };
