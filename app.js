const express = require("express");
const app = express();
const db = require("./db/connection");
const { getApi, getTopics } = require("./controllers/controllers");

// app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
