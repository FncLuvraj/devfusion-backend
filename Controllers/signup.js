const Validator = require("custom-data-validator");
const userModel = require("../Model/userModel");
const bcrypt = require("bcrypt");

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

    // Validation rules with custom error messages
    const rules = {
      firstName: [
        "required",
        "string",
        "message:First name is required and must be a string.",
      ],
      lastName: [
        "required",
        "string",
        "message:Last name is required and must be a string.",
      ],
      email: [
        "required",
        "string",
        "regex:^\\S+@\\S+\\.\\S+$",
        "message:Please enter a valid email address (example@example.com).",
      ],
      skills: [
        "required",
        "array",
        "message:Please provide at least one skill in an array format.",
      ],
      password: [
        "required",
        "string",
        "minLength:6",
        "message:Password must be at least 6 characters long.",
      ],
      bio: ["optional", "string", "message:Bio must be a string."],
      profileImagePath: [
        "optional",
        "string",
        "message:Profile image path must be a valid URL.",
      ],
    };

    const validator = new Validator(rules);

    // Custom validation for "optional"
    validator.addCustomValidator(
      "optional",
      (field, value, param, validatorInstance) => {
        if (value === undefined || value === null) {
          // Skip validation if the field is not provided
          return;
        }
      }
    );

    // Custom validation for "array"
    validator.addCustomValidator(
      "array",
      (field, value, param, validatorInstance) => {
        if (!Array.isArray(value)) {
          validatorInstance.addError(field, `${field} must be an array.`);
        }
      }
    );

    // Run the validation
    const isValid = validator.validate(req.body);

    // If validation fails, return the validation errors
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed. Please correct the errors below.",
        errors: validator.getErrors(),
      });
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
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);

    // Catch any unexpected errors and return a generic error message
    res.status(500).json({
      success: false,
      message: "There was an error while signing up. Please Enter valid data",
    });
  }
}

module.exports = signup;
