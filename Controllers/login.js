const Validator = require("custom-data-validator");
const userModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation using custom validator
    const rules = {
      email: ["required", "string", "regex:^\\S+@\\S+\\.\\S+$"],
      password: ["required", "string"],
    };

    const validator = new Validator(rules);
    const isValid = validator.validate(req.body);

    if (!isValid) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: validator.getErrors(),
        });
    }

    // Proceed with the login logic
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const payload = { email: userExist.email, _id: userExist._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        data: userExist,
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
};

module.exports = login;
