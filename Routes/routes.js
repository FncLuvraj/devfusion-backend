const express = require("express");
const router = express.Router();

// Importing Controllers
const signup = require("../Controllers/signup");
const login = require("../Controllers/login");
const logout = require("../Controllers/logout");
const { sendingRequest } = require("../Controllers/sendingRequest");
const {
  updateUserInfo,
  updateUserValidationRules,
} = require("../Controllers/updateUserInfo");
const respondToConnection = require("../Controllers/respondToConnection");
const Connections = require("../Controllers/Connections");
const feed = require("../Controllers/feed");
const profileView = require("../Controllers/ProfileView");
const RecievedConnectionRequest = require("../Controllers/RecievedConnectionRequest");

// Importing Middleware
const AuthMiddleware = require("../middlewear/Auth");

// ---- User Routes ----
router.post("/signup", signup); // Signup Route
router.post("/login", login); // Login Route
router.post("/logout", AuthMiddleware, logout); // Logout Route
router.get("/profileview", AuthMiddleware, profileView); // Profile View Route
router.patch(
  "/update",
  updateUserValidationRules,
  AuthMiddleware,
  updateUserInfo
); // Update Profile

// ---- Connection Routes ----
router.post(
  "/sendConnectionRequest/:status/:receiverUserId",
  AuthMiddleware,
  sendingRequest
); // Send Connection Request
router.patch(
  "/respondToConnection/:status/:requestId",
  AuthMiddleware,
  respondToConnection
); // Respond to a Connection Request (accept/reject)
router.get("/connections", AuthMiddleware, Connections); // Fetch Connections
router.get(
  "/receivedConnectionRequests",
  AuthMiddleware,
  RecievedConnectionRequest
); // Fetch Received Connection Requests

// ---- Feed Routes ----
router.get("/feed", AuthMiddleware, feed); // Fetch Feed

module.exports = router;
