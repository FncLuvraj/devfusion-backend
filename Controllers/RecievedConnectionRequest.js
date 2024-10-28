const ConnectionModel = require("../Model/ConnectionModel");

// Function to show all the requests to the user which have status "interested"
async function RecievedConnectionRequest(req, res) {
  try {
    // Verify if the logged-in user is coming through AuthMiddleware
    console.log("Logged in user:", req.user);

    const loggedInUser = req.user._id;

    const connectionRequest = await ConnectionModel.find({
      receiverUserId: loggedInUser,
      status: "interested",
    })
      .populate("senderUserId", [
        "firstName",
        "lastName",
        "email",
        "bio",
        "skills",
        "profileImagePath",
      ]) // Change name to firstName, lastName based on your model
      .select("-createdAt -updatedAt -receiverUserId"); // Keep _id if needed

    // Check if there are any results
    if (connectionRequest.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No connection requests found",
        data: [],
      });
    }

    // Return the result
    res.status(200).json({ success: true, data: connectionRequest });
  } catch (err) {
    console.log("Error in RecievedConnectionRequest:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = RecievedConnectionRequest;
