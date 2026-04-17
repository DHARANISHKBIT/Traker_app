const { registerUser, loginUser } = require("../services/userServices");

const register = async (req, res) => {
  try {
    const body = req.body || {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required (name, email, password)",
        error: "MISSING_FIELDS"
      });
    }

    const user = await registerUser(name, email, password);
    
    res.status(201).json({ 
      success: true,
      message: "User registered successfully", 
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token: user.token
      }
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    const statusCode = error.message?.includes("Server configuration") ? 500 : 400;
    res.status(statusCode).json({ 
      success: false, 
      message: error.message,
      error: "REGISTRATION_FAILED"
    });
  }
};

const login = async (req, res) => {
  try {
    const body = req.body || {};
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required",
        error: "MISSING_CREDENTIALS"
      });
    }

    const user = await loginUser(email, password);
    
    res.status(200).json({ 
      success: true,
      message: "Login successful", 
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token: user.token
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ 
      success: false, 
      message: error.message,
      error: "LOGIN_FAILED"
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.status(200).json({ 
      success: true,
      message: "Profile retrieved successfully", 
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve profile",
      error: "PROFILE_ERROR"
    });
  }
};

module.exports = { register, login, getProfile };
