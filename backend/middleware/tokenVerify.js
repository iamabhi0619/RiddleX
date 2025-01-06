const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ userId: decoded.userId }).select(
      "-password"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error during token verification:", error);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};
module.exports = { protect };
