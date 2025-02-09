const express = require("express");
const {
  login,
  create,
  getLeaderBoard,
  verify,
  session,
  history,
  test,
} = require("../controllers/user");
const { protect } = require("../middleware/tokenVerify");
const routes = express.Router();
routes.post("/login", login);
routes.get("/session", protect, session);
routes.post("/signup", create);
routes.post("/verify", verify);
routes.get("/history", protect, history);
routes.get("/leaderboard", protect, getLeaderBoard);
exports.routes = routes;
