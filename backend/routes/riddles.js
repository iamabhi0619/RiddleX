const express = require("express");
const { getUnique, checkAnswer, getHint } = require("../controllers/riddles");
const { protect } = require("../middleware/tokenVerify");

const routes = express.Router();

routes.get("/getone", protect, getUnique);
routes.post("/check", protect, checkAnswer);
routes.get("/hint", protect, getHint);

exports.routes = routes;