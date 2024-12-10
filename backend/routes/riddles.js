const express = require("express");
const { getAll, getUnique } = require("../controllers/riddles");
const routes = express.Router();

routes.get("/", getAll);
routes.get("/unique", getUnique);

exports.routes = routes;
