const userModel = require("../Model/userModel");

const logout = (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()), // Corrected the expiration
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res
      .status(200)
      .json({ success: true, message: "User Logged out Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = logout;
