const Validator = require("custom-data-validator");
const ConnectionModel = require("../Model/ConnectionModel");
const userModel = require("../Model/userModel");

async function sendingRequest(req, res) {
  try {
    const { receiverUserId, status } = req.params;

    // Validation using custom validator
    const rules = {
      receiverUserId: ["required", "string"], // Assume ID is a string
      status: ["required", "string", "regex:^(interested|ignored)$"], // Only allow "interested" or "ignored"
    };

    const validator = new Validator(rules);
    const isValid = validator.validate(req.params);

    if (!isValid) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: validator.getErrors(),
        });
    }

    // Proceed with the logic to send a connection request
    const senderUserId = req.user._id;
    const receiverUserExist = await userModel.findById(receiverUserId);

    if (!receiverUserExist) {
      return res
        .status(400)
        .json({ success: false, message: "Receiver user does not exist" });
    }

    const connectionExist = await ConnectionModel.findOne({
      $or: [
        { senderUserId, receiverUserId },
        { senderUserId: receiverUserId, receiverUserId: senderUserId },
      ],
    });

    if (connectionExist) {
      return res
        .status(400)
        .json({ success: false, message: "Connection already exists" });
    }

    const newConnection = new ConnectionModel({
      senderUserId,
      receiverUserId,
      status,
    });
    await newConnection.save();

    res
      .status(200)
      .json({ success: true, message: "Connection request successful" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { sendingRequest };
