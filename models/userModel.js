const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
    },
    phone_number: {
      type: Number,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    profileImage: { type: String }, 
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
