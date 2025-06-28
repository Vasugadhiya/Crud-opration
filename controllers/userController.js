const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const HTTP = require("../constant/responseCode.constant");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// SignUp New User Account
const signUp = async (req, res) => {
  try {
    const { name, email, phone_number, password, confirmPassword } = req.body;

    if (!name || !email || !phone_number || !password || !confirmPassword) {
      return res
        .status(HTTP.BAD_REQUEST)
        .send({ status: false, msg: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res
        .status(HTTP.BAD_REQUEST)
        .send({ status: false, msg: "Passwords do not match" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(HTTP.BAD_REQUEST)
        .send({ status: false, msg: "Email already exists" });
    }

    let profileImage = null;
    if (req.file) {
      profileImage = req.file.path;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      profileImage,
    });

    res.status(HTTP.SUCCESS).send({ status: true, msg: "User registered", data: user });
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .send({ status: false, msg: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        msg: "Email and Password are required",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(HTTP.SUCCESS)
        .send({ status: false, code: HTTP.NOT_FOUND, msg: "User not found" });
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.UNAUTHORIZED,
        msg: "Invalid credentials",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(HTTP.SUCCESS).send({ status: true, msg: "Login successful", token });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      msg: "Server error",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone_number } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, phone_number },
      { new: true }
    );
    res.status(HTTP.SUCCESS).send({ status: true, msg: "User updated", data: updatedUser });
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .send({ status: false, msg: "Server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    await userModel.findByIdAndDelete(userId);
    res.status(HTTP.SUCCESS).send({ status: true, msg: "User deleted" });
  } catch (error) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .send({ status: false, msg: "Server error", error: error.message });
  }
};

module.exports = {
  signUp,
  login,
  updateUser,
  deleteUser,
};
