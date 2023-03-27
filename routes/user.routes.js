const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user");
const { client } = require("../redis");
const userRouter = express.Router();
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;
  const x = await userModel.findOne({ email: req.body.email });
  if (x) {
    res.send({ err: "This email-id is already registered" });
  } else {
    try {
      bcrypt.hash(pass, 8, async (err, hash) => {
        if (!err) {
          const user = new userModel({ name, email, pass: hash });
          await user.save();
          res.send({ msg: "Registered Succefully" });
        } else {
          res.send({ err: err.message });
        }
      });
    } catch (err) {
      res.send({ err: err.message });
    }
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  const user = await userModel.find({ email });
  try {
    if (user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, process.env.key, {
            expiresIn: "2h",
          });
          res.send({ msg: "Login Done", token: token });
        } else {
          res.send({ msg: "Wrong Password" });
        }
      });
    } else {
      res.send({ msg: "Wrong Password" });
    }
  } catch (err) {
    res.send({ err: err.message });
  }
});

// blacklisting here ⬇️

userRouter.get("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;
    await client.SETEX("TOKEN", 7200, JSON.stringify(token));
    res.status(200).json({ msg: "Logout Succesfully" });
  } catch (err) {
    res.status(401).json({ err: err.message });
  }
});

module.exports = { userRouter };
