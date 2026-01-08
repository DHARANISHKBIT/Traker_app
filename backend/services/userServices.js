const User = require("../modules/userModule");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (name, email, password) => {
  // Input validation
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  // Generate token for the new user
  const token = generateToken(user._id);

  // Return user without password and include token
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    token
  };

  return userResponse;
};

const loginUser = async (email, password) => {
  // Input validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate token for the user
  const token = generateToken(user._id);

  // Return user without password and include token
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    token
  };

  return userResponse;
};

module.exports = { registerUser, loginUser };
