const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.token;

    // If no token is found, return 401
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // If token verification fails, return 401
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Token verification failed" });
    }

    // Attach the decoded payload (user info) to req.user
    req.user = decoded; // Now req.user should have _id and email

    next(); // Pass control to the next middleware or route
  } catch (err) {
    console.log(err.message);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  }
};

module.exports = AuthMiddleware;
