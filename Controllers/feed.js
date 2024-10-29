const userModel = require("../Model/userModel");
const ConnectionModel = require("../Model/ConnectionModel");

const USER_SAFE_DATA = "firstName lastName profileImagePath bio skills";

const feed = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionModel.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId status");

    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(loggedInUser._id.toString());

    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    const users = await userModel
      .find({ _id: { $nin: Array.from(hideUsersFromFeed) } })
      .select("-password -profilePicture")
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = feed;