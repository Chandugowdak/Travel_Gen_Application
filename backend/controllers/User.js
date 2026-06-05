const express = require("express");
const User = require("../model/User");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const JWT_CODE = process.env.JWT_SECRET_CODE;

const registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please Fill All The Details" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const HashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: HashPassword });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User Registered Successfully", user: newUser });
  } catch (err) {
    return res.status(500).json({
      message: "Server Side Error While Registration ",
      error: err.message,
    });
  }
};

const Userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please Fill All The Details",
      });
    }

    const VerifyUser = await User.findOne({ email });

    if (!VerifyUser) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      VerifyUser.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = JWT.sign(
      { userID: VerifyUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "User Login Successfully",
      user: {
        _id: VerifyUser._id,
        name: VerifyUser.name,
        email: VerifyUser.email,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Side Error While Login",
      error: err.message,
    });
  }
};


module.exports = {registeruser, Userlogin};