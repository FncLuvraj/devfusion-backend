const ConnectionModel = require("../Model/ConnectionModel");

async function Connections(req, res) {
  try {
    const loggedInUser = req.user._id;

    const connectionRequest = await ConnectionModel.find({
      $or: [
        { receiverUserId: loggedInUser, status: "accepted" },
        { senderUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("senderUserId", ["name"])
      .populate("receiverUserId", ["name"]);

    const data = await connectionRequest.map((row) => {
      if (row.senderUserId._id.toString() == loggedInUser._id.toString()) {
        return loggedInUser._id;
      }
      return row.senderUserId;
    });

    res.status(200).json({
      success: true,
      message: "Connections fetched Successfully",
      data: data,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = Connections;
