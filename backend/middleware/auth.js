const jwt = require("jsonwebtoken");
const User = require("../modules/userModule");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access token required",
        error: "NO_TOKEN"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token",
        error: "INVALID_TOKEN"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token",
      error: "TOKEN_ERROR"
    });
  }
};

module.exports = { authenticateToken };
