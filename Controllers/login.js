const { Validator } = require("custom-data-validator");
const userModel = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation rules
    const rules = {
      email: ["required", "string", "regex:^\\S+@\\S+\\.\\S+$"],
      password: ["required", "string"],
    };

    const validator = new Validator(rules);
    const isValid = validator.validate(req.body);

    if (!isValid) {
      const errors = validator.getErrors();
      const customErrors = {
        email: errors.email ? "Invalid email format or missing email." : undefined,
        password: errors.password ? "Password is required." : undefined,
      };

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: customErrors,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const payload = { email: user.email, _id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "There was an error while logging in. Please try again.",
      error: error.message,
    });
  }
};

module.exports = login;