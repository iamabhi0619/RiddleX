const express = require("express");
const { getUnique, checkAnswer } = require("../controllers/riddles");
const { protect } = require("../middleware/tokenVerify");

const routes = express.Router();

routes.get("/getone", protect, getUnique);
routes.post("/check", protect, checkAnswer);

exports.routes = routes;
