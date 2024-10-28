const ConnectionModel = require("../Model/ConnectionModel");

// This API allows the logged-in user to accept or reject a specific connection request.
async function respondToConnection(req, res) {
  try {
    const receiverId = req.user._id; // logged in user
    const requestId = req.params.requestId; // unique ID of the request
    const status = req.params.status;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid status" });
    }

    const connectionRequest = await ConnectionModel.findOne({
      _id: requestId,
      receiverUserId: receiverId,
      status: "interested",
    });

    if (!connectionRequest) {
      console.log(connectionRequest);
      return res
        .status(400)
        .json({ success: false, message: "Connection not found" });
    }

    connectionRequest.status = status; // coming from params
    await connectionRequest.save();

    res
      .status(200)
      .json({ success: true, message: "Connection successfully made" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

module.exports = respondToConnection;
