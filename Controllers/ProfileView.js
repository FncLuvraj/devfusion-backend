const userModel = require("../Model/userModel");

async function profileView(req, res) {
  try {
    const userId = req.user.userId;
    const user = await userModel
      .findById(userId)
      .select("-password -createdAt -updatedAt"); // Exclude sensitive data

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log("Error during profile view:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = profileView;
