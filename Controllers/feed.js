const userModel = require("../Model/userModel");
const ConnectionModel = require("../Model/ConnectionModel");

const USER_SAFE_DATA = "firstName lastName profileImagePath bio skills";

const feed = async (req, res) => {
  try {
    const loggedInUser = req.user; // Get logged-in user

    // Pagination Setup
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // Ensure a max limit of 50 profiles per page
    const skip = (page - 1) * limit;

    // Step 1: Fetch all connection requests involving the logged-in user (either sent or received)
    const connectionRequests = await ConnectionModel.find({
      $or: [
        { fromUserId: loggedInUser._id }, // Sent requests (including "interested")
        { toUserId: loggedInUser._id }, // Received requests
      ],
    }).select("fromUserId toUserId status"); // Including the status to check for pending/interested/accepted/rejected

    // Step 2: Create a Set to store users to hide (including logged-in user)
    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(loggedInUser._id.toString()); // Prevent showing own profile

    // Step 3: Add users who are part of any connection request to the hide list
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString()); // Users to whom you've sent requests
      hideUsersFromFeed.add(request.toUserId.toString()); // Users who sent requests to you
    });

    // Step 4: Find users who are NOT part of the connection set and exclude logged-in user
    const users = await userModel
      .find({
        _id: { $nin: Array.from(hideUsersFromFeed) }, // Exclude users involved in any connection requests
      })
      .select("-password -profilePicture") // Safely select the required fields, excluding sensitive data
      .skip(skip)
      .limit(limit);

    // Return the filtered users as the feed data
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = feed;
