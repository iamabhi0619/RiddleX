const Riddle = require("../models/riddles");
const User = require("../models/user");
const natural = require("natural");
const Sanscript = require("sanscript");

const getUniqueQuestion = async (answerSet, level) => {
  const riddles = await Riddle.find({ level });
  if (!riddles || riddles.length === 0) {
    return null;
  }
  let uniqueRiddle = null;
  let attempts = 0;
  const maxAttempts = 10;
  const answerSetLookup = new Set(answerSet);
  while (!uniqueRiddle && attempts < maxAttempts) {
    const randomIndex = Math.floor(Math.random() * riddles.length);
    const potentialRiddle = riddles[randomIndex];
    if (!answerSetLookup.has(potentialRiddle.questionId)) {
      uniqueRiddle = potentialRiddle;
    }
    attempts++;
  }
  return uniqueRiddle;
};

exports.getUnique = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user || !user.scores || typeof user.scores.level !== "number") {
      return res.status(400).send("Invalid user data or level information");
    }
    const currentLevel = Math.floor(user.scores.level);
    const answerSet = user.questionHistory.map((history) => history.questionId);
    const currentQuestion = user.questionHistory.find(
      (question) => question.questionId === user.currentQuestion
    );
    if (currentQuestion && !currentQuestion.isCorrect) {
      return res.json(currentQuestion);
    }
    const uniqueRiddle = await getUniqueQuestion(answerSet, currentLevel);
    if (!uniqueRiddle) {
      return res
        .status(404)
        .send("No unique riddle found after multiple attempts");
    }
    const question = {
      questionId: uniqueRiddle.questionId,
      questionText: uniqueRiddle.question,
      attemptedAnswer: "",
      correctAnswer: uniqueRiddle.answer,
      isCorrect: false,
      hintsUsed: 0,
      timeTakenSeconds: 0,
      solvedAt: null,
    };
    user.questionHistory.push(question);
    user.currentQuestion = uniqueRiddle.questionId;
    await user.save();
    res.json(question);
  } catch (error) {
    console.error("Error getting unique riddle:", error.message);
    res.status(500).send("Server Error");
  }
};

const normalizeString = (str) => {
  return str?.toLowerCase().trim();
};

const transliterateToLatin = (str) => {
  try {
    return Sanscript.t(str, "devanagari", "itrans"); // Hindi to Hinglish (Latin script)
  } catch (err) {
    return str; // Fallback to original input
  }
};

const isFuzzyMatch = (answer, correctAnswer) => {
  const threshold = 0.8; // Adjust for strictness
  const distance = natural.JaroWinklerDistance(answer, correctAnswer);
  return distance >= threshold;
};

exports.checkAnswer = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const { answer } = req.body;
    const normalizedAnswer = normalizeString(answer);
    const transliteratedAnswer = transliterateToLatin(normalizedAnswer);

    const riddle = await Riddle.findOne({ questionId: user.currentQuestion });
    if (!riddle) {
      return res.status(404).send("Riddle not found");
    }

    // Normalize correct answers for all languages
    const correctAnswers = [
      normalizeString(riddle.answer.English),
      normalizeString(riddle.answer.Hindi),
      normalizeString(riddle.answer.Hinglish),
    ];

    // Check for exact match, fuzzy match, or transliterated match
    const isCorrect = correctAnswers.some(
      (correctAnswer) =>
        normalizedAnswer === correctAnswer ||
        transliteratedAnswer === correctAnswer ||
        isFuzzyMatch(normalizedAnswer, correctAnswer) ||
        isFuzzyMatch(transliteratedAnswer, correctAnswer)
    );

    // Update the user's question history
    const currentQuestion = user.questionHistory.find(
      (question) => question.questionId === user.currentQuestion
    );
    if (currentQuestion) {
      currentQuestion.attemptedAnswer = answer;
      currentQuestion.isCorrect = isCorrect;
      currentQuestion.solvedAt = new Date();
    }

    // Update the user's scores
    if (isCorrect) {
      user.scores.totalScore += 10;
      user.currentQuestion = null;
      user.scores.level += 0.2;
    }

    await user.save();
    res.json({ isCorrect, user });
  } catch (error) {
    console.error("Error checking answer:", error.message);
    res.status(500).send("Server Error");
  }
};
