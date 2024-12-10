const mongoose = require("mongoose");
const riddleSchema = new mongoose.Schema({
  questionId: {
    type: String,
    unique: true,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  question: {
    English: {
      type: String,
      required: true,
    },
    Hindi: {
      type: String,
      required: true,
    },
    Hinglish: {
      type: String,
      required: true,
    },
  },
  answer: {
    English: {
      type: String,
      required: true,
    },
    Hindi: {
      type: String,
      required: true,
    },
    Hinglish: {
      type: String,
      required: true,
    },
  },
  hint: {
    English: {
      type: String,
      required: true,
    },
    Hindi: {
      type: String,
      required: true,
    },
    Hinglish: {
      type: String,
      required: true,
    },
  },
});

const Riddle = mongoose.model("riddles", riddleSchema);

module.exports = Riddle;
