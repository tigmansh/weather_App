const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    pass: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("user", userSchema);
module.exports = { userModel };
