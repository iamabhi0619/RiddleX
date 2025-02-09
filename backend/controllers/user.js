const axios = require("axios");
const User = require("../models/user");
const serviceId = "S0003";
const serviceName = "RiddleX";
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
    // Login Request
    const response = await axios.post(`${process.env.API_URL}/api/user/login`, {
      email,
      password,
      serviceId,
      serviceName
    });
    const token = response.data.token;
    // Fetch User Profile
    const userData = await axios.get(
      `${process.env.API_URL}/api/user/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const userResponse = userData.data || {};
    // Find or Create User in Local Database
    let user = await User.findOne({
      $or: [{ userId: userResponse.userId }, { email: userResponse.email }],
    });
    if (!user) {
      user = await User.create({
        userId: userResponse.userId,
        name: userResponse.name,
        email: userResponse.email,
        gender: userResponse.gender,
        avatar: userResponse.avatar,
        scores: {
          totalScore: 0,
          level: 1,
          hintsUsed: 0,
        },
      });
    }
    // Check and Renew Hints
    if (User.checkAndRenewHints) {
      await User.checkAndRenewHints(user._id);
    } else {
      console.warn("checkAndRenewHints method is missing in User model");
    }
    return res.status(200).json({ user, token });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// Signup handler
exports.create = async (req, res) => {
  try {
    const { userId, name, email, password, gender } = req.body;
    if (!name || !email || !password || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.findOne({ userId });
    if (user) {
      res.status(200).json({ message: "Your are alrady an User...!!" });
    }
    const response = await axios.post(
      `${process.env.API_URL}/api/user/register`,
      { name, email, password, gender, serviceId, serviceName }
    );
    if (response.data.success) {
      res.status(201).json(response.data);
    }
  } catch (error) {
    res.send("Error");
  }
};
// Verify handler
exports.verify = async (req, res) => {
  try {
    const etoken = req.body.token;
    const response = await axios.post(
      `${process.env.API_URL}/api/user/verify-email?token=${etoken}`
    );
    const { user, message, token } = response.data;

    const newUser = await User.create({
      userId: user.userId,
      name: user.name,
      email: user.email,
      gender: user.gender,
      avatar: user.avatar,
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
