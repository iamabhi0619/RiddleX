const axios = require("axios");
const User = require("../models/user");

const handleErrorResponse = (res, error) => {
  console.error("Error:", error.message);
  if (error.response) {
    return res.status(error.response.status).json({
      error: error.response.data.message || "External API error",
    });
  }
  return res.status(500).json({ error: "Internal Server Error" });
};

// Login handler
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const response = await axios.post(
      "https://iamabhi.onrender.com/api/users/login",
      { email, password }
    );
    const { userResponse, token } = response.data || {};
    let user = await User.findOne({ userId: userResponse.userId });
    if (!user) {
      user = await User.create({
        userId: userResponse.userId,
        name: userResponse.name,
        email: userResponse.email,
        gender: userResponse.gender,
        dpUrl: userResponse.dpUrl,
        scores: {
          totalScore: 0,
          level: 1,
          hintsUsed: 0,
        },
      });
    }
    await User.checkAndRenewHints(user._id);
    return res.status(200).json({ user, token });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// Signup handler
exports.create = async (req, res) => {
  try {
    const { userId, name, email, password, gender, dpUrl } = req.body;
    if (!userId || !name || !email || !password || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const response = await axios.post(
      "https://iamabhi.onrender.com/api/users/singup",
      { userId, name, email, password, gender, dpUrl }
    );
    const { userResponse, message } = response.data;
    res.status(201).json({ userResponse, message });
  } catch (error) {
    console.log(error);
    
    return handleErrorResponse(res, error);
  }
};
// Verify handler
exports.verify = async (req, res) => {
  let { otp, email } = req.body;
  const paylode = { otp: parseInt(otp), email };
  try {
    const response = await axios.post(
      "https://iamabhi.onrender.com/api/users/verify",
      paylode
    );
    const { user, message, token } = response.data;
    const newUser = await User.create({
      userId: user.userId,
      name: user.name,
      email: user.email,
      gender: user.gender,
      dpUrl: user.dpUrl,
      scores: {
        totalScore: 0,
        level: 1,
        hintsUsed: 0,
      },
    });
    return res.status(201).json({ user: newUser, message, token });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error });
  }
};
// Leaderboard handler
exports.getLeaderBoard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ "scores.totalScore": -1 })
      .select("name dpUrl achievements scores")
      .exec();
    if (!users.length) {
      return res.status(404).json({ error: "No users found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

exports.session = async (req, res) => {
  try {
    await User.checkAndRenewHints(req.user._id);
    delete req.user.questionHistory;
    delete req.user.legendaryAchievements;
    delete req.user.achievements;
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ error: "InterNet Server Error" });
  }
};
exports.history = async (req, res) => {
  try {
    const history = req.user.questionHistory;
    history.reverse();
    res.status(200).send(history);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "InterNet Server Error" });
  }
};
