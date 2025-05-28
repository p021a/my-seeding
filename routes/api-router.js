const express = require("express");
const apiRouter = express.Router();
const { getApi } = require("../controllers/controllers");

apiRouter.get("/", getApi);

module.exports = apiRouter;
