const mongoose = require("mongoose");
const questionHistorySchema = new mongoose.Schema({
  questionId: String,
  questionText: Object,
  attemptedAnswer: String,
  correctAnswer: Object,
  isCorrect: Boolean,
  hintsUsed: Number,
  timeTakenSeconds: Number,
  solvedAt: Date,
});
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  dpUrl: {
    type: String,
    default: null,
  },
  scores: {
    totalScore: {
      type: Number,
      required: true,
      default: 0,
    },
    level: {
      type: Number,
      required: true,
      default: 1,
    },
    hintsUsed: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  achievements: [String],
  legendaryAchievements: [String],
  questionHistory: [questionHistorySchema],
  availableHints: {
    type: Number,
    default: 3,
  },
  lastHintRenewal: {
    type: Date,
    default: Date.now,
  },
  currentQuestion: {
    type: String,
    default: null,
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;

const checkAndRenewHints = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const now = new Date();
  const lastRenewal = new Date(user.lastHintRenewal);
  const hoursSinceLastRenewal = (now - lastRenewal) / (1000 * 60 * 60);
  if (hoursSinceLastRenewal >= 24) {
    user.availableHints = 3;
    user.lastHintRenewal = now;
    await user.save();
  }
  return user.availableHints;
};

module.exports.checkAndRenewHints = checkAndRenewHints;