const userModel = require("../Model/userModel");
const bcrypt = require('bcryptjs');

async function signup(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      skills,
      password,
      bio,
      profileImagePath,
    } = req.body;

    // Check for required fields
    if (!firstName || !lastName || !email || !skills || !password || !bio || !profileImagePath) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    // Check if the email already exists in the database
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({
      email,
      firstName,
      lastName,
      skills,
      bio,
      password: hashedPassword,
      profileImagePath,
    });

    // Save the user to the database
    await newUser.save();

    // Return a success response after the user has been saved
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error); // Log the full error, including stack trace
    // Return the error message in the response
    res.status(500).json({
      success: false,
      message: "There was an error while signing up. Please enter valid data.",
      error: error.message || 'Internal server error', // Return the error message
      stack: error.stack // Optional: include the error stack for deeper debugging
    });
  }
}

module.exports = signup;