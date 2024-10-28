const userModel = require("../Model/userModel");
const { check, validationResult } = require("express-validator");

const updateUserValidationRules = [
  check("email").isEmail().withMessage("Please provide a valid email"),
  check("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  check("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  check("skills").optional().isArray().withMessage("Skills must be an array"),
  check("bio").optional().isString().withMessage("Bio must be a string"),
];

async function updateUserInfo(req, res) {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, errors: error.array() });
  }

  try {
    const { firstName, lastName, email, skills, bio, profileImagePath } =
      req.body;

    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User Does not Exist" });
    }

    const updatedFields = {};

    if (firstName) updatedFields.firstName = firstName;
    if (email) updatedFields.email = email;
    if (profileImagePath) updatedFields.profileImagePath = profileImagePath;
    if (lastName) updatedFields.lastName = lastName;
    if (skills) updatedFields.skills = skills;
    if (bio) updatedFields.bio = bio;

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { $set: updatedFields },
      { new: true, select: "-password" } // returning the updated document
    );

    res
      .status(200)
      .json({ success: true, message: "profile updated", data: updatedFields });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

module.exports = { updateUserInfo, updateUserValidationRules };
