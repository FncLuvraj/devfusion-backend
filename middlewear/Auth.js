const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }
};

module.exports = AuthMiddleware;