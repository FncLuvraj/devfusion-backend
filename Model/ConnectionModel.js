const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    receiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ignored", "rejected", "accepted", "interested"],
    },
  },
  { timestamps: true }
);

const model = mongoose.model("ConnectionModel", ConnectionSchema);
module.exports = model;
