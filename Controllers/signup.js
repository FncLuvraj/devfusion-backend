const { Validator } = require("custom-data-validator");
const userModel = require("../Model/userModel");
const bcrypt = require("bcryptjs");

async function signup(req, res) {
  try {
    const { firstName, lastName, email, skills, password, bio, profileImagePath } = req.body;

    // Define validation rules (without custom messages inline)
    const rules = {
      firstName: ["required", "string"],
      lastName: ["required", "string"],
      email: ["required", "string", "regex:^\\S+@\\S+\\.\\S+$"],
      skills: ["required", "array"],
      password: ["required", "string", "minLength:6"],
      bio: ["optional", "string"],
      profileImagePath: ["optional", "string"]
    };

    // Initialize validator
    const validator = new Validator(rules);

    // Add custom validation for optional fields
    validator.addCustomValidator("optional", (field, value, param, validatorInstance) => {
      if (value === undefined || value === null) {
        return; // Skip validation if the field is not provided
      }
    });

    // Add custom validation for array type fields
    validator.addCustomValidator("array", (field, value, param, validatorInstance) => {
      if (!Array.isArray(value)) {
        validatorInstance.addError(field, `${field} must be an array.`);
      }
    });

    // Run the validation
    const isValid = validator.validate(req.body);

    // Custom error messages
    const customErrors = {
      firstName: "First name is required and must be a string.",
      lastName: "Last name is required and must be a string.",
      email: "Please enter a valid email address (example@example.com).",
      skills: "Please provide at least one skill in an array format.",
      password: "Password must be at least 6 characters long.",
      bio: "Bio must be a string.",
      profileImagePath: "Profile image path must be a valid URL."
    };

    // If validation fails, return the validation errors with custom messages
    if (!isValid) {
      const errors = validator.getErrors();
      const formattedErrors = Object.keys(errors).reduce((acc, key) => {
        acc[key] = customErrors[key];
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        message: "Validation failed. Please correct the errors below.",
        errors: formattedErrors
      });
    }

    // Check if the email already exists in the database
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      skills,
      bio,
      password: hashedPassword,
      profileImagePath
    });

    // Save the user to the database
    await newUser.save();

    // Return a success response after the user has been saved
    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  } catch (error) {
    console.error(error); // Log the full error, including stack trace
    res.status(500).json({
      success: false,
      message: "There was an error while signing up. Please enter valid data.",
      error: error.message || "Internal server error",
      stack: error.stack // Optional: include the error stack for deeper debugging
    });
  }
}

module.exports = signup;