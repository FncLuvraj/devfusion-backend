const timespan = require("jsonwebtoken/lib/timespan");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: true,
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    profileImagePath: {
      type: String,
    },
    email: {
      required: true,
      unique: true,
      type: String,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    skills: {
      required: true,
      type: [String], // array of string
    },
    bio: {
      type: String,
    },
    password: {
      required: true,
      type: String,
      minLength: 8,
      validate: {
        validator(v) {
          // Custom regex to check for at least one number and one special character
          return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/.test(v);
        },
        message: (props) =>
          "Password must be at least 8 characters long, include one letter, one number, and one special character.",
      },
    },
  },
  { timestamps: true }
);

const model = mongoose.model("userModel", userSchema);
module.exports = model;
