const jwt = require("jsonwebtoken");
const { client } = require("../redis");
require("dotenv").config();

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  const redisToken = await client.get("TOKEN");
  const blacklistToken = JSON.parse(redisToken);
  if (!token || blacklistToken) {
    res.send({ err: "please login" });
  } else {
    const decoding = jwt.verify(token, process.env.key);
    if (decoding) {
      req.body.userID = decoding.userID;
      next();
    } else {
      res.send({ err: "please login" });
    }
  }
};

module.exports = {auth};