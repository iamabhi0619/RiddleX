const Riddle = require("../models/riddles");

const getUniqueQuestion = async (answerSet, level) => {
  const riddles = await Riddle.find({ level: level });
  if (!riddles || riddles.length === 0) {
    return res.status(404).send("Riddle not found");
  }
  let uniqueRiddle;
  let attempts = 0;
  const maxAttempts = 10;
  while (!uniqueRiddle && attempts < maxAttempts) {
    const randomIndex = Math.floor(Math.random() * riddles.length);
    const potentialRiddle = riddles[randomIndex];
    if (!answerSet.includes(potentialRiddle.questionId)) {
      uniqueRiddle = potentialRiddle;
    }
    attempts++;
  }
  return uniqueRiddle;
};

exports.getAll = async (req, res) => {
  try {
    const riddles = await Riddle.find();
    res.json(riddles);
  } catch (error) {
    console.error("Error getting all riddles", error.message);
    res.status(500).send("Server Error");
  }
};

exports.getUnique = async (req, res) => {
  try {
    const answerSet = ["Q10005", "Q10006", "Q10004", "Q10002", "Q10003", "Q10001", "Q20003", "Q20007", "Q20006", "Q20001", "Q20005"];
    const currentlevel = 2;
    
    const uniqueRiddle = await getUniqueQuestion(answerSet, currentlevel);
    if (!uniqueRiddle) {
      return res
        .status(404)
        .send("No unique riddle found after multiple attempts");
    }

    res.json(uniqueRiddle);
  } catch (error) {
    console.error("Error getting unique riddle", error.message);
    res.status(500).send("Server Error");
  }
};
